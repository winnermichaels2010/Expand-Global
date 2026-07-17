import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
export default function MessageThread({ designRequestId }) {
  const { currentUser, sendMessage, subscribeToMessages } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [profile, setProfile] = useState(null);

  const { getUserProfile } = useAuth();

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    await sendMessage(designRequestId, newMessage.trim(), profile);
    setNewMessage('');
    setSending(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
      <div
        className="px-4 py-2 text-xs font-medium"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        Messages ({messages.length})
      </div>

      <div
        className="overflow-y-auto px-4 py-3 space-y-3"
        style={{ maxHeight: '300px' }}
      >
        {messages.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-tertiary)' }}>
            No messages yet. Start the conversation below.
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUser?.uid;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%] rounded-xl px-3 py-2"
                  style={{
                    background: isOwn ? 'var(--color-accent)' : 'var(--bg-elevated)',
                    border: isOwn ? 'none' : '1px solid var(--border-default)',
                  }}
                >
                  <p
                    className="text-[10px] font-medium mb-1"
                    style={{ color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' }}
                  >
                    {isOwn ? 'You' : msg.senderName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: isOwn ? '#fff' : 'var(--text-primary)' }}
                  >
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
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
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
    </motion.div>
  );
}
