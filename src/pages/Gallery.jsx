import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImages, FaPlus, FaTrash, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';
import { staticGalleryImages } from '../lib/galleryImages';

export default function Gallery() {
  const {
    currentUser,
    ADMIN_EMAIL,
    subscribeToGalleryImages,
    getGalleryImages,
    uploadGalleryImage,
    deleteGalleryImage,
  } = useAuth();
  const [uploaded, setUploaded] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  const isAdmin = currentUser?.email === ADMIN_EMAIL;
  const inPanel = !!currentUser;

  useEffect(() => {
    const unsub = subscribeToGalleryImages(setUploaded);
    return unsub;
  }, [subscribeToGalleryImages]);

  const allImages = [
    ...uploaded.map((img) => ({
      id: img.id,
      src: img.url,
      alt: img.name || 'Uploaded design',
      isUploaded: true,
    })),
    ...staticGalleryImages.map((img, i) => ({
      id: `static-${i}`,
      src: img.src,
      alt: img.alt,
      isUploaded: false,
    })),
  ];

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', text: 'Only image files are allowed. Please choose a picture.' });
      return;
    }
    setUploading(true);
    setFeedback(null);
    const result = await uploadGalleryImage(file);
    if (result) {
      setUploaded((prev) => [result, ...prev]);
      const fresh = await getGalleryImages();
      setUploaded(fresh);
      setFeedback({ type: 'success', text: 'Image uploaded successfully. It is now live in the gallery.' });
    } else {
      setFeedback({ type: 'error', text: 'Upload failed. Please try again.' });
    }
    setUploading(false);
    e.target.value = '';
  }

  async function handleDelete(image) {
    if (!isAdmin || deletingId) return;
    setDeletingId(image.id);
    const ok = await deleteGalleryImage({ id: image.id, url: image.src });
    setDeletingId(null);
    if (ok) {
      setFeedback({ type: 'success', text: 'Image deleted.' });
    } else {
      setFeedback({ type: 'error', text: 'Failed to delete the image. Please try again.' });
    }
  }

  const description =
    'These are some of the designs we have created for our clients — logos, brand identities, signage and full brand packages. Every image here is real work done by the Expand Global team. Take a look, get inspired, and let us know what we can create for you.';

  const header = inPanel ? (
    <PanelHeader title="Gallery" subtitle={description}>
      {isAdmin && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full text-[var(--color-accent)] bg-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer pressable disabled:opacity-60"
        >
          <FaPlus className="text-xs" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      )}
    </PanelHeader>
  ) : (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--color-accent)' }} />
      <div className="grain-overlay absolute inset-0" />
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full" style={{ background: 'hsl(0 0% 100% / 0.06)', filter: 'blur(80px)' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'hsl(0 0% 100% / 0.15)', border: '1px solid hsl(0 0% 100% / 0.2)', color: 'white' }}>
            <FaImages size={14} />
            Portfolio
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Our Gallery
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.7)', lineHeight: 1.7 }}>
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {header}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />

      <div className={inPanel ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32'}>
        <AnimatePresence>
          {feedback && (
            <motion.div
              className={`flex items-start gap-3 p-4 rounded-2xl mb-6 shadow-lg ${feedback.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}
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

        {allImages.length === 0 ? (
          <div className="text-center py-16">
            <FaImages className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No gallery images yet.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {allImages.map((image) => (
              <motion.div
                key={image.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in hover-lift"
                style={{ border: '1px solid var(--border-default)' }}
                onClick={() => setLightbox(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-end p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="text-white text-xs font-medium line-clamp-1">{image.alt}</span>
                </div>
                {isAdmin && image.isUploaded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image);
                    }}
                    disabled={deletingId === image.id}
                    className="absolute top-2 right-2 p-2 rounded-lg text-white cursor-pointer disabled:opacity-60"
                    style={{ background: 'hsl(0 84% 60% / 0.9)' }}
                    aria-label="Delete image"
                    title="Delete image"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
            <motion.img
              src={lightbox.src}
              alt={lightbox.alt}
              className="relative max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
