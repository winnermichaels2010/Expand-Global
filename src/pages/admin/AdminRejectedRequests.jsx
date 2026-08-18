import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import PanelHeader from '../../components/PanelHeader';
import ProfileAvatar from '../../components/ProfileAvatar';
import { useProfilePicsByEmail } from '../../hooks/useProfilePics';

export default function AdminRejectedRequests() {
  const { currentUser, getDesignRequests, ADMIN_EMAIL } = useAuth();
  const [designRequests, setDesignRequests] = useState([]);
  const profilePicsByEmail = useProfilePicsByEmail();

  const rejected = designRequests.filter((r) => r.status === 'Rejected');

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
      <PanelHeader
        title="Rejected Requests"
        subtitle="Design requests that have been rejected"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaClipboardList size={14} />
          {rejected.length} {rejected.length === 1 ? 'request' : 'requests'}
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
            Rejected Requests ({rejected.length})
          </h2>
          <div className="space-y-3">
            {rejected.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FaTimesCircle className="text-3xl mb-3" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  No rejected requests yet.
                </p>
              </div>
            ) : (
              [...rejected].reverse().map((request) => (
                <div
                  key={request.id}
                  className="p-3 sm:p-4 rounded-xl overflow-hidden"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid hsl(0 84% 60% / 0.25)',
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
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: 'hsl(0 84% 60% / 0.12)', color: '#dc2626' }}
                    >
                      Rejected
                    </span>
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
                  <div
                    className="mt-2 p-2.5 rounded-lg"
                    style={{
                      background: 'hsl(0 84% 60% / 0.06)',
                      border: '1px solid hsl(0 84% 60% / 0.2)',
                    }}
                  >
                    <p className="text-[10px]" style={{ color: '#dc2626' }}>
                      <strong>Reject Reason:</strong> {request.rejectReason || 'Not provided'}
                    </p>
                    {request.rejectedAt && (
                      <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        Rejected on {new Date(request.rejectedAt).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
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
