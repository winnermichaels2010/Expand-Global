/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends, FaChevronRight, FaArrowLeft, FaTimes, FaHome, FaEllipsisV } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';
import MessageThread from './MessageThread';

export default function ClientsAside({ open, onClose }) {
  const { getRegisteredUsers, getDesignRequests, ADMIN_EMAIL } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [previewPicture, setPreviewPicture] = useState(null);
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const touchStart = useRef(null);
  const infoRef = useRef(null);

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
      setProjects(all.filter((r) => r.email === selectedClient.email));
      setLoadingProjects(false);
    });
    return () => { mounted = false; };
  }, [selectedClient, getDesignRequests]);

  const clientName = (c) => [c.surname, c.firstName, c.lastName].filter(Boolean).join(' ') || c.email;
  const initials = (c) => (clientName(c).split(' ').map((w) => w.charAt(0)).join('').slice(0, 2) || '?').toUpperCase();

  const avatarButton = (client, sizeClass, fontClass, onOpen) => (
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
      {client.profilePicture ? (
        <img
          src={client.profilePicture}
          alt=""
          className={`${sizeClass} rounded-full object-cover`}
          style={{ border: '2px solid var(--border-default)' }}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold ${fontClass}`}
          style={{ background: 'var(--color-accent)' }}
        >
          {initials(client)}
        </div>
      )}
    </div>
  );

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

  const dashboardButton = (
    <button
      onClick={() => { onClose(); navigate('/admin'); }}
      className="p-2 rounded-lg transition-colors duration-200 cursor-pointer"
      style={{ color: 'var(--text-tertiary)' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
      aria-label="Back to dashboard"
      title="Back to dashboard"
    >
      <FaHome className="text-xs" />
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
              {selectedClient ? avatarButton(selectedClient, 'w-6 h-6', 'text-[9px]') : null}
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
            <MessageThread fill designRequestId={selectedProject.id} />
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
                  onClick={() => setSelectedProject(request)}
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
                    <StatusBadge status={request.status} />
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
              {dashboardButton}
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
                    {avatarButton(client, 'w-9 h-9', 'text-xs')}
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
    </aside>
  );
}
