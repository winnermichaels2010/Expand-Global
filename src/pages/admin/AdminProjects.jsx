import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClipboardList, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import PanelHeader from '../../components/PanelHeader';
import StatusBadge from '../../components/StatusBadge';
import ProfileAvatar from '../../components/ProfileAvatar';
import { useProfilePicsByEmail } from '../../hooks/useProfilePics';

const variantConfig = {
  active: {
    title: 'Active Projects',
    subtitle: 'Projects accepted by the admin and still in progress',
    statuses: ['Accepted', 'In Progress'],
    empty: 'No active projects yet.',
    button: { label: 'Submit Project', path: (id) => `/admin/projects/submit/${id}` },
  },
  pending: {
    title: 'Pending Requests',
    subtitle: 'Projects awaiting admin review',
    statuses: ['Pending'],
    empty: 'No pending requests yet.',
    button: { label: 'View Project', path: (id) => `/admin/design-requests/reply/${id}` },
  },
  finished: {
    title: 'Finished Projects',
    subtitle: 'Completed projects',
    statuses: ['Completed'],
    empty: 'No finished projects yet.',
    button: { label: 'View Project', path: (id) => `/admin/projects/view/${id}` },
  },
};

// eslint-disable-next-line react/prop-types
export default function AdminProjects({ variant = 'active' }) {
  const { currentUser, getDesignRequests, ADMIN_EMAIL } = useAuth();
  const navigate = useNavigate();
  const [designRequests, setDesignRequests] = useState([]);
  const profilePicsByEmail = useProfilePicsByEmail();

  const config = variantConfig[variant] || variantConfig.active;
  const projects = designRequests.filter((r) => config.statuses.includes(r.status));

  useEffect(() => {
    if (currentUser?.email === ADMIN_EMAIL) {
      getDesignRequests().then(setDesignRequests);
    }
  }, [currentUser, getDesignRequests, ADMIN_EMAIL]);

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <PanelHeader title={config.title} subtitle={config.subtitle}>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaClipboardList size={14} />
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </div>
      </PanelHeader>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8 overflow-hidden">
        <motion.div
          className="p-4 sm:p-6 rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {config.title} ({projects.length})
          </h2>
          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                {config.empty}
              </p>
            ) : (
              [...projects].reverse().map((request) => (
                <div
                  key={request.id}
                  className="p-3 sm:p-4 rounded-xl overflow-hidden"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <ProfileAvatar
                        src={profilePicsByEmail[request.email?.toLowerCase()]}
                        alt={request.name || 'Client'}
                        size={32}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{request.name || 'Unknown'}</p>
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                          {request.email}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <div
                    className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] mb-1.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="truncate"><strong>Service:</strong> {request.service}</span>
                    <span className="truncate"><strong>Budget:</strong> {request.budget || 'N/A'}</span>
                    <span className="truncate"><strong>Timeline:</strong> {request.timeline || 'N/A'}</span>
                    <span className="truncate"><strong>Phone:</strong> {request.phone || 'N/A'}</span>
                  </div>
                  <p className="text-[10px] mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Description:</strong> {request.description}
                  </p>

                  {(request.status === 'Accepted' || request.status === 'In Progress') && (
                    <div className="mt-1.5 text-[10px] space-y-0.5" style={{ color: '#059669' }}>
                      <p><strong>Price:</strong> ₦{request.standardPrice?.toLocaleString()}</p>
                      {request.adminComment && <p className="line-clamp-1"><strong>Comment:</strong> {request.adminComment}</p>}
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between mt-2 pt-2"
                    style={{ borderTop: '1px solid var(--border-default)' }}
                  >
                    <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => navigate(config.button.path(request.id))}
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-md transition-all duration-200 cursor-pointer pressable"
                      style={
                        variant === 'active'
                          ? { background: '#059669', color: '#ffffff' }
                          : { background: 'var(--color-accent-light)', color: 'var(--color-accent)' }
                      }
                    >
                      {config.button.label} <FaChevronRight className="text-[8px]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
