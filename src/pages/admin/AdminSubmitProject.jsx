import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaPaperPlane, FaDownload, FaFile, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import PanelHeader from '../../components/PanelHeader';
import StatusBadge from '../../components/StatusBadge';
import ProfileAvatar from '../../components/ProfileAvatar';
import { useProfilePicsByEmail } from '../../hooks/useProfilePics';

function isImage(url) {
  return /\.(jpe?g|png|webp|gif|svg|bmp)$/i.test(url);
}

// eslint-disable-next-line react/prop-types
export default function AdminSubmitProject({ mode = 'submit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, getDesignRequests, uploadProjectFile, submitProject, ADMIN_EMAIL } = useAuth();
  const profilePicsByEmail = useProfilePicsByEmail();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const isView = mode === 'view';

  useEffect(() => {
    async function fetchRequest() {
      try {
        const requests = await getDesignRequests();
        setRequest(requests.find((r) => r.id === id) || null);
      } catch (err) {
        console.error('Failed to fetch design request:', err);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser?.email === ADMIN_EMAIL) {
      fetchRequest();
    }
  }, [id, currentUser, ADMIN_EMAIL, getDesignRequests]);

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Project not found.</p>
      </div>
    );
  }

  async function handleSubmit() {
    if (!file || submitting) return;
    setSubmitting(true);
    setFeedback(null);
    const uploaded = await uploadProjectFile(file);
    if (!uploaded) {
      setSubmitting(false);
      setFeedback({ type: 'error', text: 'Failed to upload the file. Please try again.' });
      return;
    }
    const ok = await submitProject(request.id, {
      fileUrl: uploaded.url,
      fileName: uploaded.name,
      message,
    });
    setSubmitting(false);
    if (ok) {
      setFeedback({ type: 'success', text: 'Project submitted successfully. Redirecting to Finished Projects...' });
      setTimeout(() => navigate('/admin/projects/finished'), 1400);
    } else {
      setFeedback({ type: 'error', text: 'Failed to submit the project. Please try again.' });
    }
  }

  const submitted = request.submittedFileUrl;
  const backTo = isView ? '/admin/projects/finished' : '/admin/projects/active';
  const backLabel = isView ? 'Back to Finished Projects' : 'Back to Active Projects';

  return (
    <div className="min-h-screen overflow-x-hidden">
      <PanelHeader
        title={isView ? 'Submitted Project' : 'Submit Project'}
        subtitle={`${request.name || 'Client'} - ${request.service}`}
        onBack={() => navigate(backTo)}
        backLabel={backLabel}
      />

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8 max-w-3xl mx-auto">
        <AnimatePresence>
          {feedback && (
            <motion.div
              className={`flex items-start gap-3 p-4 rounded-2xl mb-4 shadow-lg ${feedback.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}
              style={{
                background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
                border: '1px solid ' + (feedback.type === 'success' ? '#a7f3d0' : '#fecaca'),
              }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {feedback.type === 'success' ? (
                <FaCheckCircle className="mt-0.5 flex-shrink-0" style={{ color: '#059669' }} />
              ) : (
                <FaExclamationTriangle className="mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{feedback.text}</p>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="p-1.5 rounded-lg cursor-pointer hover:bg-black/5 flex-shrink-0"
                style={{ color: 'inherit' }}
                aria-label="Dismiss"
              >
                <FaTimes className="text-xs" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="p-6 rounded-2xl glass-strong"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <ProfileAvatar
              src={profilePicsByEmail[request.email?.toLowerCase()]}
              alt={request.name || 'Client'}
              size={40}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{request.name || 'Unknown'}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                {request.email}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>
          <div
            className="grid grid-cols-2 gap-3 text-xs p-4 rounded-xl mb-6"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            <span><strong>Service:</strong> {request.service}</span>
            <span><strong>Timeline:</strong> {request.timeline || 'N/A'}</span>
            <span><strong>Budget:</strong> {request.budget || 'N/A'}</span>
            <span><strong>Phone:</strong> {request.phone || 'N/A'}</span>
          </div>

          {submitted ? (
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}
            >
              <div
                className="px-4 py-2 text-xs font-medium"
                style={{
                  background: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                Submitted Design
              </div>
              <div className="p-4 space-y-3">
                {isImage(request.submittedFileUrl) ? (
                  <a
                    href={request.submittedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden hover-lift"
                  >
                    <img
                      src={request.submittedFileUrl}
                      alt="Finished design"
                      className="w-full max-h-80 object-contain rounded-xl"
                    />
                  </a>
                ) : (
                  <a
                    href={request.submittedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <FaFile style={{ color: 'var(--color-accent)' }} />
                    <span className="text-xs font-medium truncate">
                      {request.submittedFileName || 'Finished design file'}
                    </span>
                  </a>
                )}
                {request.submittedMessage && (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {request.submittedMessage}
                  </p>
                )}
                {request.submittedAt && (
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                    Submitted on {new Date(request.submittedAt).toLocaleString()}
                  </p>
                )}
                <a
                  href={request.submittedFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg text-white"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <FaDownload /> Download
                </a>
              </div>
            </div>
          ) : isView ? (
            <p
              className="text-xs text-center py-10"
              style={{ color: 'var(--text-tertiary)' }}
            >
              No submitted design found for this project.
            </p>
          ) : (
            <div
              className="flex flex-col rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                minHeight: '320px',
              }}
            >
              <div
                className="px-4 py-2 text-xs font-medium"
                style={{
                  background: 'var(--bg-secondary)',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                Send the finished design to {request.name || 'the client'}
              </div>

              <div className="flex-1 px-4 py-3 space-y-3">
                {file ? (
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                  >
                    <FaFile style={{ color: 'var(--color-accent)' }} />
                    <span className="text-xs font-medium truncate flex-1">{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      className="p-1.5 rounded-lg cursor-pointer hover:bg-black/5"
                      style={{ color: 'var(--text-tertiary)' }}
                      aria-label="Remove file"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                    Tap the + to attach the finished design, then add a note and submit.
                  </p>
                )}
              </div>

              <div
                className="flex items-end gap-2 px-4 py-3"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-lg text-white cursor-pointer pressable"
                  style={{ background: 'var(--color-accent)' }}
                  aria-label="Attach file"
                  title="Attach finished design"
                >
                  <FaPlus className="text-sm" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message for the client (optional)..."
                  rows={2}
                  className="flex-1 text-xs rounded-lg px-3 py-2 resize-none"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!file || submitting}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer pressable"
                  style={{ background: '#059669' }}
                >
                  <FaPaperPlane />
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
