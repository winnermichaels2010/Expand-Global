/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaChevronRight, FaArrowLeft, FaTimes, FaEllipsisV, FaCheck, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';
import MessageThread from './MessageThread';
import ProfileAvatar from './ProfileAvatar';

export default function ClientsAside({ open, onClose, initial = null }) {
  const { getRegisteredUsers, getDesignRequests, rejectDesignRequest, ADMIN_EMAIL, getUnreadMessageCounts, markMessagesAsRead } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [previewPicture, setPreviewPicture] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingBusy, setRejectingBusy] = useState(false);
  const [asideToast, setAsideToast] = useState(null);
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [unreadCounts, setUnreadCounts] = useState({});
  const touchStart = useRef(null);
  const infoRef = useRef(null);
  const toastTimer = useRef(null);
  const appliedClientRef = useRef(null);
  const appliedProjectRef = useRef(null);

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
    setPreviewPicture(null);
    setShowRejectForm(false);
    setRejectReason('');
  }, [selectedClient, selectedProject]);

  useEffect(() => {
    if (!open) setPreviewPicture(null);
  }, [open]);

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
    let mounted = true;
    async function load() {
      const [users] = await Promise.all([getRegisteredUsers()]);
      if (!mounted) return;
      setClients(users.filter((u) => u.email !== ADMIN_EMAIL));
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [getRegisteredUsers, ADMIN_EMAIL]);

  useEffect(() => {
    if (!open) {
      setSelectedClient(null);
      setSelectedProject(null);
      setProjects([]);
    }
  }, [open]);

  useEffect(() => {
    let mounted = true;
    if (!selectedClient) {
      setProjects([]);
      return;
    }
    setLoadingProjects(true);
    getDesignRequests().then((all) => {
      if (!mounted) return;
      setProjects(
        all.filter(
          (r) =>
            r.email === selectedClient.email &&
            r.status !== 'Completed' &&
            r.status !== 'Rejected'
        )
      );
      setLoadingProjects(false);
    });
    return () => { mounted = false; };
  }, [selectedClient, getDesignRequests]);

  useEffect(() => {
    if (projects.length === 0) { setUnreadCounts({}); return; }
    let mounted = true;
    async function fetch() {
      const ids = projects.map((p) => p.id);
      const counts = await getUnreadMessageCounts(ids);
      if (mounted) setUnreadCounts(counts);
    }
    fetch();
    const interval = setInterval(fetch, 8000);
    return () => { mounted = false; clearInterval(interval); };
  }, [projects, getUnreadMessageCounts]);

  useEffect(() => {
    if (!open || !initial?.projectId) return;
    if (appliedClientRef.current === initial.nonce) return;
    if (clients.length === 0) return;
    const client = clients.find((c) => c.userId === initial.clientId);
    if (!client) return;
    setSelectedClient(client);
    appliedClientRef.current = initial.nonce;
  }, [open, initial, clients]);

  useEffect(() => {
    if (!open || !initial?.projectId) return;
    if (appliedProjectRef.current === initial.nonce) return;
    if (!selectedClient) return;
    if (loadingProjects) return;
    const project = projects.find((p) => p.id === initial.projectId);
    if (project) {
      setSelectedProject(project);
      appliedProjectRef.current = initial.nonce;
      return;
    }
    let cancelled = false;
    getDesignRequests().then((all) => {
      if (cancelled) return;
      const p = all.find((r) => r.id === initial.projectId);
      if (p && p.status !== 'Rejected') {
        setSelectedProject(p);
        appliedProjectRef.current = initial.nonce;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, initial, selectedClient, projects, loadingProjects, getDesignRequests]);

  const clientName = (c) => [c.surname, c.firstName, c.lastName].filter(Boolean).join(' ') || c.email;

  const avatarButton = (client, sizeClass, onOpen) => {
    const size = sizeClass.includes('w-9') ? 36 : 24;
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          if (client.profilePicture) setPreviewPicture(client.profilePicture);
          onOpen?.();
        }}
        className="flex-shrink-0 rounded-full cursor-pointer"
        aria-label="View profile picture"
      >
        <ProfileAvatar src={client.profilePicture} alt={clientName(client)} size={size} />
      </div>
    );
  };

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
      aria-label="Close clients panel"
    >
      <FaTimes className="text-xs" />
    </button>
  );

  const clientInfoMenu = selectedClient ? (
    <div className="relative" ref={infoRef}>
      <button
        onClick={() => setInfoOpen((o) => !o)}
        className="p-2 rounded-lg transition-colors duration-200 cursor-pointer"
        style={{ color: 'var(--text-tertiary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
        aria-label="Client information"
        title="Client information"
      >
        <FaEllipsisV className="text-xs" />
      </button>
      {infoOpen && (
        <div
          className="absolute right-0 top-full mt-1 w-52 rounded-xl p-3 shadow-2xl z-30"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Client info
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Name</p>
              <p className="text-xs font-medium break-words" style={{ color: 'var(--text-primary)' }}>
                {clientName(selectedClient)}
              </p>
            </div>
            <div>
              <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Email</p>
              <p className="text-xs font-medium break-words" style={{ color: 'var(--text-primary)' }}>
                {selectedClient.email}
              </p>
            </div>
            <div>
              <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-tertiary)' }}>Phone</p>
              <p className="text-xs font-medium break-words" style={{ color: 'var(--text-primary)' }}>
                {selectedProject?.phone || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;

  function showAsideToast(type, message) {
    setAsideToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setAsideToast(null), 3500);
  }

  async function handleAsideReject() {
    if (!selectedProject || !rejectReason.trim()) return;
    setRejectingBusy(true);
    const ok = await rejectDesignRequest(selectedProject.id, rejectReason.trim());
    setRejectingBusy(false);
    if (ok) {
      const rejectedId = selectedProject.id;
      setProjects((prev) => prev.filter((p) => p.id !== rejectedId));
      setShowRejectForm(false);
      setRejectReason('');
      setSelectedProject(null);
      showAsideToast('success', 'Request rejected successfully.');
    } else {
      showAsideToast('error', 'Failed to reject request. Please try again.');
    }
  }

  const canChat =
    selectedProject &&
    ['Accepted', 'In Progress', 'Completed'].includes(selectedProject.status);

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
      {selectedProject ? (
        <>
          <div
            className="flex items-center justify-between gap-1.5 px-2 py-2 shrink-0 z-10"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {backButton(() => setSelectedProject(null), 'Projects')}
              {selectedClient ? avatarButton(selectedClient, 'w-6 h-6') : null}
              <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                {selectedProject.service || 'Project'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <StatusBadge status={selectedProject.status} />
              {clientInfoMenu}
              {closeButton}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            {canChat ? (
              <MessageThread fill designRequestId={selectedProject.id} />
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="px-4 py-3">
                  <p className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    Submitted{' '}
                    {new Date(selectedProject.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <span><strong>Timeline:</strong> {selectedProject.timeline || 'N/A'}</span>
                    <span><strong>Budget:</strong> {selectedProject.budget || 'N/A'}</span>
                    <span><strong>Phone:</strong> {selectedProject.phone || 'N/A'}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Description:</strong>
                  </p>
                  <p className="text-xs line-clamp-3" style={{ color: 'var(--text-primary)' }}>
                    {selectedProject.description}
                  </p>
                </div>

                <div className="px-4 py-4 space-y-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <p className="text-[10px] text-center mb-1" style={{ color: 'var(--text-tertiary)' }}>
                    This request is awaiting your review.
                  </p>
                  <button
                    onClick={() => navigate(`/admin/design-requests/reply/${selectedProject.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-white transition-all duration-200 cursor-pointer pressable"
                    style={{ background: '#059669' }}
                  >
                    <FaCheck /> Accept Request
                  </button>
                  <button
                    onClick={() => setShowRejectForm((v) => !v)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-white transition-all duration-200 cursor-pointer pressable"
                    style={{ background: '#dc2626' }}
                  >
                    <FaTimes /> Reject Request
                  </button>

                  {showRejectForm && (
                    <div
                      className="p-2.5 rounded-lg"
                      style={{
                        background: 'hsl(0 84% 60% / 0.06)',
                        border: '1px solid hsl(0 84% 60% / 0.2)',
                      }}
                    >
                      <label
                        className="block text-[10px] font-medium mb-1.5"
                        style={{ color: '#dc2626' }}
                      >
                        Reason for rejection
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter reason..."
                        className="w-full px-2.5 py-1.5 text-[11px] rounded-lg resize-none"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        rows={2}
                      />
                      <div className="flex justify-end gap-1.5 mt-1.5">
                        <button
                          onClick={() => {
                            setShowRejectForm(false);
                            setRejectReason('');
                          }}
                          className="px-2.5 py-1 text-[10px] font-medium rounded-md transition-all duration-200 cursor-pointer pressable"
                          style={{
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAsideReject}
                          disabled={!rejectReason.trim() || rejectingBusy}
                          className="px-2.5 py-1 text-[10px] font-medium rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer pressable"
                          style={{ background: '#dc2626' }}
                        >
                          {rejectingBusy ? 'Rejecting...' : 'Confirm Reject'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : selectedClient ? (
        <>
          <div
            className="flex items-center justify-between gap-2 px-3 py-3 shrink-0 z-10"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center gap-2 min-w-0">
              {backButton(() => setSelectedClient(null), 'Clients')}
              <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                {clientName(selectedClient)}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
              >
                {projects.length}
              </span>
              {closeButton}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {loadingProjects ? (
              <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                Loading projects...
              </p>
            ) : projects.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                This client hasn&apos;t sent any projects yet.
              </p>
            ) : (
              [...projects].reverse().map((request) => (
                <button
                  key={request.id}
                  onClick={() => { setSelectedProject(request); markMessagesAsRead(request.id).then(() => { getUnreadMessageCounts(projects.map((p) => p.id)).then(setUnreadCounts); }); }}
                  className="w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer hover-lift pressable"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {request.service || 'Design request'}
                    </p>
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
                    </div>
                  </div>
                  <p className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(request.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-[11px] line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {request.description}
                  </p>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color: 'var(--color-accent)' }}>
                    View &amp; Chat <FaChevronRight className="inline text-[8px]" />
                  </p>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className="flex items-center justify-between gap-2 px-4 py-4 shrink-0 z-10"
            style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center gap-2">
              <FaUserFriends style={{ color: 'var(--color-accent)' }} />
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                Clients
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}
              >
                {clients.length}
              </span>
              {closeButton}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {loading ? (
              <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                Loading clients...
              </p>
            ) : clients.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                No clients yet.
              </p>
            ) : (
              clients.map((client) => (
                <div
                  key={client.userId}
                  className="px-2"
                >
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer hover-lift text-left"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    {avatarButton(client, 'w-9 h-9')}
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {clientName(client)}
                    </p>
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {previewPicture && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setPreviewPicture(null)}
        >
          <img
            src={previewPicture}
            alt="Profile picture"
            className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setPreviewPicture(null)}
            className="absolute top-4 right-4 p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 cursor-pointer"
            aria-label="Close picture"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      )}

      {asideToast && (
        <div
          className="fixed bottom-6 right-6 z-[90] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium text-white"
          style={{ background: asideToast.type === 'success' ? '#059669' : '#dc2626' }}
        >
          {asideToast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          {asideToast.message}
        </div>
      )}
    </aside>
  );
}
