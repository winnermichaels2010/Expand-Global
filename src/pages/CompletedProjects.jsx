import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaDownload, FaFile, FaImage, FaCommentDots, FaClipboardCheck, FaCreditCard, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';
import MessageThread from '../components/MessageThread';

function isImage(url) {
  return /\.(jpe?g|png|webp|gif|svg|bmp)$/i.test(url);
}

function parseSubmittedFiles(req) {
  if (req.submittedFiles) return req.submittedFiles;
  if (!req.submittedFileUrl) return [];
  try {
    const parsed = JSON.parse(req.submittedFileUrl);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // legacy single-file format
  }
  return [{ url: req.submittedFileUrl, name: req.submittedFileName || 'Finished design file' }];
}

export default function CompletedProjects() {
  const { currentUser, subscribeToDesignRequests } = useAuth();
  const navigate = useNavigate();
  const [designRequests, setDesignRequests] = useState([]);
  const [openThreadId, setOpenThreadId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToDesignRequests((requests) => {
      setDesignRequests(
        requests.filter(
          (r) => r.email === currentUser.email && r.status === 'Completed' && r.submittedFileUrl
        )
      );
    });
    return unsub;
  }, [currentUser, subscribeToDesignRequests]);

  const finished = [...designRequests].reverse();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Completed Projects"
        subtitle="Finished designs delivered by the admin"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaClipboardCheck size={14} />
          {finished.length} {finished.length === 1 ? 'project' : 'projects'}
        </div>
      </PanelHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-5 sm:p-6 rounded-2xl glass-strong"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {finished.length === 0 ? (
            <div className="text-center py-16">
              <FaCheckCircle className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No completed projects yet. Once the admin submits a finished design, it will appear here.
              </p>
              <button
                onClick={() => navigate('/request-design')}
                className="mt-5 px-5 py-2.5 text-sm font-semibold rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer pressable"
                style={{ background: 'var(--color-accent)' }}
              >
                Request a Design
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {finished.map((req) => {
                const paid = !!req.halfPaid;
                const price = Number(req.standardPrice) || 0;
                const remaining = price / 2;

                return (
                  <motion.div
                    key={req.id}
                    className="relative p-5 rounded-xl transition-all duration-300 hover-lift"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span
                      className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full"
                      style={{ background: '#10b981' }}
                    />
                    <div className="flex items-start justify-between mb-3 pl-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{req.service}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          Requested on{' '}
                          {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium flex-shrink-0"
                        style={{ background: '#10b9811a', color: '#10b981', border: '1px solid #10b98133' }}
                      >
                        <FaCheckCircle className="text-xs" />
                        Completed
                      </span>
                    </div>

                    <div
                      className="rounded-xl overflow-hidden mb-3 pl-2"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                    >
                      <div
                        className="px-4 py-2 text-xs font-medium"
                        style={{
                          background: 'var(--bg-secondary)',
                          borderBottom: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Finished Design
                      </div>
                      <div className="p-4 space-y-3">
                        {parseSubmittedFiles(req).map((file, idx) => (
                          <div key={idx}>
                            {isImage(file.url) ? (
                              <div className="relative rounded-xl overflow-hidden">
                                <div
                                  className="relative"
                                  style={{
                                    maxHeight: paid ? 'none' : '220px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <img
                                    src={file.url}
                                    alt={file.name || 'Finished design'}
                                    className="w-full object-contain rounded-xl"
                                    style={{
                                      filter: paid ? 'none' : 'none',
                                      maxHeight: paid ? '400px' : '220px',
                                    }}
                                  />
                                </div>
                                {!paid && (
                                  <div
                                    className="absolute inset-0 flex flex-col items-center justify-center"
                                    style={{
                                      background: 'linear-gradient(to bottom, transparent 30%, var(--bg-elevated) 60%)',
                                      backdropFilter: 'blur(4px)',
                                    }}
                                  >
                                    <FaLock className="text-2xl mb-2" style={{ color: 'var(--text-tertiary)' }} />
                                    <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                                      Complete payment to view the full design
                                    </p>
                                    <button
                                      onClick={() => navigate(`/active-requests`)}
                                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg text-white cursor-pointer pressable"
                                      style={{ background: '#059669' }}
                                    >
                                      <FaCreditCard /> Pay to Unlock
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div
                                className="flex items-center gap-3 p-4 rounded-xl"
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                              >
                                <FaFile style={{ color: 'var(--color-accent)' }} />
                                <span className="text-xs font-medium truncate flex-1">
                                  {file.name || 'Finished design file'}
                                </span>
                                {!paid && <FaLock className="text-xs" style={{ color: 'var(--text-tertiary)' }} />}
                              </div>
                            )}
                          </div>
                        ))}
                        {req.submittedMessage && (
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {req.submittedMessage}
                          </p>
                        )}
                        {req.submittedAt && (
                          <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                            Submitted on {new Date(req.submittedAt).toLocaleString()}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {parseSubmittedFiles(req).map((file, idx) => (
                            paid ? (
                              <a
                                key={idx}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg text-white"
                                style={{ background: 'var(--color-accent)' }}
                              >
                                <FaDownload /> {file.name || 'Download'}
                              </a>
                            ) : (
                              <button
                                key={idx}
                                onClick={() => navigate('/active-requests')}
                                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg text-white cursor-pointer pressable"
                                style={{ background: '#059669' }}
                              >
                                <FaCreditCard /> Pay ₦{remaining.toLocaleString()} to Download
                              </button>
                            )
                          ))}
                        </div>
                      </div>
                    </div>

                    {!paid && (
                      <div
                        className="rounded-xl p-4 mb-3 pl-2 flex items-center justify-between"
                        style={{ background: '#f59e0b1a', border: '1px solid #f59e0b33' }}
                      >
                        <div>
                          <p className="text-xs font-medium" style={{ color: '#f59e0b' }}>Remaining Payment</p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                            Pay the remaining ₦{remaining.toLocaleString()} to download your design
                          </p>
                        </div>
                        <button
                          onClick={() => navigate('/active-requests')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white cursor-pointer pressable flex-shrink-0"
                          style={{ background: '#f59e0b' }}
                        >
                          <FaCreditCard /> Pay Now
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pl-2">
                      <button
                        onClick={() => setOpenThreadId(openThreadId === req.id ? null : req.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer pressable"
                        style={{
                          background: openThreadId === req.id ? 'var(--color-accent)' : 'var(--color-accent-light)',
                          color: openThreadId === req.id ? '#fff' : 'var(--color-accent)',
                          border: '1px solid ' + (openThreadId === req.id ? 'transparent' : 'hsl(262 60% 80%)'),
                        }}
                      >
                        <FaCommentDots />
                        {openThreadId === req.id ? 'Hide Messages' : 'Message Admin'}
                      </button>
                    </div>

                    {openThreadId === req.id && (
                      <div className="pl-2">
                        <MessageThread designRequestId={req.id} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
