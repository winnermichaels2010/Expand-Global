import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaReply } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
export default function MessageThread({ designRequestId, fill = false }) {
  const {
    currentUser,
    sendMessage,
    subscribeToMessages,
    markMessagesAsRead,
    getUserProfile,
    deleteMessageForEveryone,
    deleteMessageForMe,
  } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [dragMsg, setDragMsg] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const gesture = useRef(null);
  const pressTimer = useRef(null);

  useEffect(() => {
    if (currentUser?.uid) {
      getUserProfile(currentUser.uid).then(setProfile);
    }
  }, [currentUser, getUserProfile]);

  useEffect(() => {
    if (!designRequestId) return;
    const unsub = subscribeToMessages(designRequestId, setMessages);
    return unsub;
  }, [designRequestId, subscribeToMessages]);

  useEffect(() => {
    if (!designRequestId) return;
    markMessagesAsRead(designRequestId);
  }, [designRequestId, markMessagesAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const visibleMessages = messages.filter(
    (m) => !(m.deletedFor || []).includes(currentUser?.uid)
  );

  function handleSend() {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    sendMessage(designRequestId, newMessage.trim(), profile, replyingTo).finally(() => {
      setNewMessage('');
      setReplyingTo(null);
      setSending(false);
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInputFocus() {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 250);
  }

  function handlePointerDown(e, msg) {
    gesture.current = { startX: e.clientX, startY: e.clientY, msg, moved: false };
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      setActionMessage(msg);
    }, 500);
  }

  function handlePointerMove(e) {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      clearTimeout(pressTimer.current);
      g.moved = true;
    }
    if (Math.abs(dy) > Math.abs(dx)) {
      if (dragMsg?.id === g.msg.id) setDragMsg(null);
      return;
    }
    if (dx > 15 && dragMsg?.id !== g.msg.id) {
      setDragMsg(g.msg);
    } else if (dx < -15 && dragMsg?.id === g.msg.id) {
      setDragMsg(null);
    }
    if (dx > 50) {
      clearTimeout(pressTimer.current);
      gesture.current = null;
      setDragMsg(null);
      setReplyingTo(g.msg);
      inputRef.current?.focus();
    }
  }

  function handlePointerEnd(e) {
    clearTimeout(pressTimer.current);
    const g = gesture.current;
    gesture.current = null;
    setDragMsg(null);
    if (!g) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (dx > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      setReplyingTo(g.msg);
      inputRef.current?.focus();
    }
  }

  function handleContextMenu(e, msg) {
    e.preventDefault();
    clearTimeout(pressTimer.current);
    gesture.current = null;
    setActionMessage(msg);
  }

  async function handleDeleteForMe() {
    const id = actionMessage?.id;
    setActionMessage(null);
    if (!id) return;
    await deleteMessageForMe(id);
  }

  async function handleDeleteForEveryone() {
    const id = actionMessage?.id;
    setActionMessage(null);
    if (!id) return;
    const name =
      [profile?.surname, profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
      currentUser?.email ||
      '';
    await deleteMessageForEveryone(id, `${name} deleted this message`);
  }

  const replyBubble = (msg, isOwn) =>
    msg.replyToMessage ? (
      <div
        className="mb-1 px-2 py-1 rounded-md text-[10px]"
        style={{
          background: isOwn ? 'rgba(255,255,255,0.15)' : 'var(--bg-secondary)',
          borderLeft: `2px solid ${isOwn ? 'rgba(255,255,255,0.6)' : 'var(--color-accent)'}`,
        }}
      >
        <span
          className="block font-semibold truncate"
          style={{ color: isOwn ? 'rgba(255,255,255,0.85)' : 'var(--color-accent)' }}
        >
          {msg.replyToName || 'Reply'}
        </span>
        <span className="line-clamp-2" style={{ color: isOwn ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}>
          {msg.replyToMessage}
        </span>
      </div>
    ) : null;

  const renderMessage = (msg) => {
    const isOwn = msg.senderId === currentUser?.uid;
    const highlighted = actionMessage?.id === msg.id;
    const dragging = dragMsg?.id === msg.id;

    if (msg.deleted) {
      const text =
        msg.deletedBy === currentUser?.uid
          ? 'You deleted this message'
          : msg.deletedByLabel || 'This message was deleted';
      return (
        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <div
            className="max-w-[80%] rounded-xl px-3 py-2"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
          >
            <p className="text-[11px] italic" style={{ color: 'var(--text-tertiary)' }}>
              {text}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} relative`}
        style={{ touchAction: 'pan-y' }}
        onPointerDown={(e) => handlePointerDown(e, msg)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onContextMenu={(e) => handleContextMenu(e, msg)}
      >
        <div
          className={`relative max-w-[80%] rounded-xl px-3 py-2 cursor-pointer ${dragging ? 'transition-transform duration-100' : ''}`}
          style={{
            background: isOwn ? 'var(--color-accent)' : 'var(--bg-elevated)',
            border: isOwn ? 'none' : '1px solid var(--border-default)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            ...(dragging
              ? { transform: 'translateX(8px)', outline: '2px solid var(--color-accent)', outlineOffset: 1 }
              : {}),
            ...(highlighted && !dragging ? { outline: '2px solid var(--color-accent)', outlineOffset: 1 } : {}),
          }}
        >
          {dragging && (
            <div
              className="absolute -left-6 top-1/2 -translate-y-1/2 p-1.5 rounded-full"
              style={{ background: 'var(--color-accent)' }}
            >
              <FaReply className="text-[9px] text-white" />
            </div>
          )}
          <p
            className="text-[10px] font-medium mb-1"
            style={{ color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' }}
          >
            {isOwn ? 'You' : msg.senderName}
          </p>
          {replyBubble(msg, isOwn)}
          <p className="text-xs" style={{ color: isOwn ? '#fff' : 'var(--text-primary)' }}>
            {msg.message}
          </p>
          <p
            className="text-[10px] mt-1 text-right"
            style={{ color: isOwn ? 'rgba(255,255,255,0.5)' : 'var(--text-tertiary)' }}
          >
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  };

  const header = (
    <div
      className="px-4 py-2 text-xs font-medium shrink-0"
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
      }}
    >
      Messages ({visibleMessages.length})
    </div>
  );

  const replyBar = replyingTo ? (
    <div
      className="shrink-0 flex items-center gap-2 px-4 py-2"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}
    >
      <FaReply className="text-[10px] flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
      <p className="flex-1 text-[10px] min-w-0">
        <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>
          Replying to{' '}
          {replyingTo.senderId === currentUser?.uid ? 'yourself' : replyingTo.senderName || 'this message'}
          :{' '}
        </span>
        <span className="inline-block max-w-full align-bottom truncate" style={{ color: 'var(--text-secondary)' }}>
          {replyingTo.message}
        </span>
      </p>
      <button
        onClick={() => setReplyingTo(null)}
        className="p-1 rounded cursor-pointer hover:bg-black/5"
        style={{ color: 'var(--text-tertiary)' }}
        aria-label="Cancel reply"
      >
        <FaTimes className="text-xs" />
      </button>
    </div>
  ) : null;

  const actionBar = actionMessage ? (
    <div
      className="shrink-0 flex items-center gap-2 px-3 py-2"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}
    >
      <span className="text-[10px] font-medium flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>
        Delete this message?
      </span>
      <button
        onClick={handleDeleteForMe}
        className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
        }}
      >
        Delete for me
      </button>
      {actionMessage.senderId === currentUser?.uid && (
        <button
          onClick={handleDeleteForEveryone}
          className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg text-white cursor-pointer"
          style={{ background: '#ef4444' }}
        >
          Delete for everyone
        </button>
      )}
      <button
        onClick={() => setActionMessage(null)}
        className="p-1 rounded cursor-pointer"
        style={{ color: 'var(--text-tertiary)' }}
        aria-label="Cancel"
      >
        <FaTimes className="text-xs" />
      </button>
    </div>
  ) : null;

  const inputBar = (
    <div className="shrink-0 flex items-center gap-2 px-4 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <input
        ref={inputRef}
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        enterKeyHint="send"
        placeholder="Type a message..."
        className="flex-1 text-xs rounded-lg px-3 py-2"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
        }}
        disabled={sending}
      />
      <button
        onClick={handleSend}
        disabled={!newMessage.trim() || sending}
        className="p-2 rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer pressable"
        style={{ background: 'var(--color-accent)' }}
      >
        <FaPaperPlane className="text-xs" />
      </button>
    </div>
  );

  const body = (
    <>
      <div
        className={`overflow-y-auto px-4 py-3 space-y-3 ${fill ? 'flex-1 min-h-0' : ''}`}
        style={fill ? undefined : { maxHeight: '300px' }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {visibleMessages.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-tertiary)' }}>
            No messages yet. Start the conversation below.
          </p>
        ) : (
          visibleMessages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>
      {replyBar}
      {actionBar}
      {inputBar}
    </>
  );

  if (fill) {
    return (
      <div className="flex flex-col h-full min-h-0">
        {body}
      </div>
    );
  }

  return (
    <motion.div
      className="mt-3 rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-default)',
      }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.2 }}
    >
      {header}
      {body}
    </motion.div>
  );
}
