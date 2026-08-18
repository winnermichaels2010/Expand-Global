/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { FaPalette, FaChevronRight, FaArrowLeft, FaTimes, FaClock, FaCheckCircle, FaTimesCircle, FaEllipsisV } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';
import MessageThread from './MessageThread';

export default function MyRequestsAside({ open, onClose, initial = null }) {
  const { currentUser, subscribeToDesignRequests, getUnreadMessageCounts, markMessagesAsRead } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [unreadCounts, setUnreadCounts] = useState({});
  const touchStart = useRef(null);
  const infoRef = useRef(null);
  const appliedRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const update = () => setViewportHeight(`${window.visualViewport.height}px`);
    update();
    window.visualViewport.addEventListener('resize', update);
    window.visualViewport.addEventListener('scroll', update);
    return () => {
      window.visualViewport.removeEventListener('resize', update);
      window.visualViewport.removeEventListener('scroll', update);
    };
  }, []);

  useEffect(() => {
    if (!infoOpen) return;
    const onDoc = (e) => {
      if (infoRef.current && !infoRef.current.contains(e.target)) setInfoOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, [infoOpen]);

  useEffect(() => {
    setInfoOpen(false);
  }, [selectedRequest]);

  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.t;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 600 && dx > 0) {
      onClose();
    }
    touchStart.current = null;
  };

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToDesignRequests((all) => {
      setRequests(all.filter((r) => r.email === currentUser.email && r.status !== 'Rejected'));
    });
    return unsub;
  }, [currentUser, subscribeToDesignRequests]);

  useEffect(() => {
    if (requests.length === 0) { setUnreadCounts({}); return; }
    let mounted = true;
    async function fetch() {
      const ids = requests.map((r) => r.id);
      const counts = await getUnreadMessageCounts(ids);
      if (mounted) setUnreadCounts(counts);
    }
    fetch();
    const interval = setInterval(fetch, 8000);
    return () => { mounted = false; clearInterval(interval); };
  }, [requests, getUnreadMessageCounts]);

  useEffect(() => {
    if (!selectedRequest) return;
    const fresh = requests.find((r) => r.id === selectedRequest.id);
    if (fresh) setSelectedRequest(fresh);
  }, [requests, selectedRequest]);

  useEffect(() => {
    if (!open) setSelectedRequest(null);
  }, [open]);

  useEffect(() => {
    if (!open || !initial?.requestId) return;
    if (appliedRef.current === initial.nonce) return;
    if (requests.length === 0) return;
    const request = requests.find((r) => r.id === initial.requestId);
    if (request) {
      setSelectedRequest(request);
      appliedRef.current = initial.nonce;
    }
  }, [open, initial, requests]);

  const backButton = (onBack, label) => (
    <button
      onClick={onBack}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors duration-200 cursor-pointer flex-shrink-0"
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-primary)',
      }}
    >
      <FaArrowLeft className="text-[9px]" />
      {label}
    </button>
  );

  const closeButton = (
    <button
      onClick={onClose}
      className="lg:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer"
      style={{ color: 'var(--text-tertiary)' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
      aria-label="Close my requests panel"
    >
      <FaTimes className="text-xs" />
    </button>
  );

  const requestInfoMenu = selectedRequest ? (
    <div className="relative" ref={infoRef}>
      <button
        onClick={() => setInfoOpen((o) => !o)}
        className="p-2 rounded-lg transition-colors duration-200 cursor-pointer"
        style={{ color: 'var(--text-tertiary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
        aria-label="Request information"
        title="Request information"
      >
        <FaEllipsisV className="text-xs" />
      </button>
      {infoOpen && (
        <div
          className="absolute right-0 top-full mt-1 w-52 rounded-xl p-3 shadow-2xl z-30"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Your info
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Name</p>
              <p className="text-xs font-medium break-words" style={{ color: 'var(--text-primary)' }}>
                {selectedRequest.name || currentUser?.displayName || '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Email</p>
              <p className="text-xs font-medium break-words" style={{ color: 'var(--text-primary)' }}>
                {selectedRequest.email}
              </p>
            </div>
            <div>
              <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Phone</p>
              <p className="text-xs font-medium break-words" style={{ color: 'var(--text-primary)' }}>
                {selectedRequest.phone || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;

  return (
    <aside
      className={`fixed right-0 top-0 w-full lg:w-64 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl ${
        open ? 'translate-x-0' : 'translate-x-full'
      } lg:translate-x-0`}
      style={{
        background: 'var(--bg-elevated)',
        borderLeft: '1px solid var(--border-default)',
        height: viewportHeight,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {selectedRequest ? (
        <>
          <div
            className="flex items-center justify-between gap-1.5 px-2 py-2 shrink-0 z-10"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {backButton(() => setSelectedRequest(null), 'Requests')}
              <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                {selectedRequest.service || 'Design request'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <StatusBadge status={selectedRequest.status} />
              {requestInfoMenu}
              {closeButton}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <div className="shrink-0 px-4 py-3">
              <p className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Submitted{' '}
                {new Date(selectedRequest.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                <span><strong>Timeline:</strong> {selectedRequest.timeline || 'N/A'}</span>
                <span><strong>Budget:</strong> {selectedRequest.budget || 'N/A'}</span>
                <span><strong>Phone:</strong> {selectedRequest.phone || 'N/A'}</span>
              </div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                <strong>Description:</strong>
              </p>
              <p className="text-xs line-clamp-3" style={{ color: 'var(--text-primary)' }}>
                {selectedRequest.description}
              </p>
            </div>

            <div className="flex-1 min-h-0 flex flex-col" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              {['Accepted', 'In Progress', 'Completed'].includes(selectedRequest.status) ? (
                <MessageThread fill designRequestId={selectedRequest.id} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                  {selectedRequest.status === 'Pending' ? (
                    <>
                      <FaClock className="text-2xl mb-2" style={{ color: 'var(--text-tertiary)' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Awaiting admin review</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        You&apos;ll be able to chat once the admin accepts this project.
                      </p>
                    </>
                  ) : selectedRequest.status === 'Rejected' ? (
                    <>
                      <FaTimesCircle className="text-2xl mb-2" style={{ color: '#ef4444' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>This project was declined</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        You can request another design at any time.
                      </p>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-2xl mb-2" style={{ color: '#10b981' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {selectedRequest.status}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        This project is moving along. Chat is available once it is accepted.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="flex items-center justify-between gap-2 px-4 py-4 shrink-0 z-10"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center gap-2">
              <FaPalette style={{ color: 'var(--color-accent)' }} />
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                My Requests
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
              >
                {requests.length}
              </span>
              {closeButton}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {requests.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                No design requests yet.
              </p>
            ) : (
              [...requests].reverse().map((request) => (
                <button
                  key={request.id}
                  onClick={() => { setSelectedRequest(request); markMessagesAsRead(request.id).then(() => { getUnreadMessageCounts(requests.map((r) => r.id)).then(setUnreadCounts); }); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer hover-lift text-left"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: 'var(--color-accent)' }}
                  >
                    {request.service?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {request.service || 'Design request'}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {unreadCounts[request.id] > 0 && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white min-w-[18px] text-center"
                        style={{ background: '#ef4444' }}
                      >
                        {unreadCounts[request.id]}
                      </span>
                    )}
                    <StatusBadge status={request.status} />
                    <FaChevronRight className="text-[10px]" style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </aside>
  );
}
