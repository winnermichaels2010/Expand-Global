import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaDownload, FaFile, FaImage, FaClipboardCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';

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

async function handleDownload(req) {
  const files = parseSubmittedFiles(req);
  for (const file of files) {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name || 'design-file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(file.url, '_blank');
    }
  }
}

export default function CompletedProjects() {
  const { currentUser, subscribeToDesignRequests } = useAuth();
  const navigate = useNavigate();
  const [designRequests, setDesignRequests] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToDesignRequests((requests) => {
      setDesignRequests(
        requests.filter(
          (r) => r.email === currentUser.email && r.status === 'Completed' && r.submittedFileUrl && r.fullyPaid
        )
      );
    });
    return unsub;
  }, [currentUser, subscribeToDesignRequests]);

  const finished = designRequests;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Completed Design"
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
          className="p-5 sm:p-6 rounded-2xl "
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {finished.length === 0 ? (
            <div className="text-center py-16">
              <FaCheckCircle className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No completed projects yet. Once the admin submits a finished design and you complete payment, it will appear here.
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
              {finished.map((req) => (
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
                              <img
                                src={file.url}
                                alt={file.name || 'Finished design'}
                                className="w-full object-contain rounded-xl"
                                style={{ maxHeight: '400px' }}
                              />
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
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <button
                      onClick={() => handleDownload(req)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer pressable"
                      style={{
                        background: 'var(--color-accent)',
                        color: '#fff',
                        border: '1px solid transparent',
                      }}
                    >
                      <FaDownload />
                      Download Design
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
