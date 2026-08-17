import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase, ADMIN_EMAIL } from '../lib/supabase';

const AuthContext = createContext();

function mapProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    surname: row.surname,
    firstName: row.first_name,
    lastName: row.last_name,
    profilePicture: row.profile_picture,
    active: row.active,
    createdAt: row.created_at,
  };
}

function mapRequest(row) {
  let submittedFiles = null;
  if (row.submitted_file_url) {
    try {
      const parsed = JSON.parse(row.submitted_file_url);
      if (Array.isArray(parsed)) submittedFiles = parsed;
    } catch {
      // legacy single-file format
    }
  }
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    description: row.description,
    timeline: row.timeline,
    budget: row.budget,
    status: row.status,
    standardPrice: row.standard_price,
    premiumPrice: row.premium_price,
    adminComment: row.admin_comment,
    rejectReason: row.reject_reason,
    rejectedAt: row.rejected_at,
    repliedAt: row.replied_at,
    submittedFileUrl: row.submitted_file_url,
    submittedFileName: row.submitted_file_name,
    submittedFiles,
    submittedMessage: row.submitted_message,
    submittedAt: row.submitted_at,
    halfPaid: row.half_paid,
    createdAt: row.created_at,
  };
}

function toRequestWrite(data) {
  const payload = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.service !== undefined) payload.service = data.service;
  if (data.description !== undefined) payload.description = data.description;
  if (data.timeline !== undefined) payload.timeline = data.timeline;
  if (data.budget !== undefined) payload.budget = data.budget;
  if (data.status !== undefined) payload.status = data.status;
  if (data.standardPrice !== undefined) payload.standard_price = data.standardPrice;
  if (data.premiumPrice !== undefined) payload.premium_price = data.premiumPrice;
  if (data.adminComment !== undefined) payload.admin_comment = data.adminComment;
  if (data.rejectReason !== undefined) payload.reject_reason = data.rejectReason;
  if (data.rejectedAt !== undefined) payload.rejected_at = data.rejectedAt;
  if (data.repliedAt !== undefined) payload.replied_at = data.repliedAt;
  if (data.submittedFileUrl !== undefined) payload.submitted_file_url = data.submittedFileUrl;
  if (data.submittedFileName !== undefined) payload.submitted_file_name = data.submittedFileName;
  if (data.submittedMessage !== undefined) payload.submitted_message = data.submittedMessage;
  if (data.submittedAt !== undefined) payload.submitted_at = data.submittedAt;
  if (data.halfPaid !== undefined) payload.half_paid = data.halfPaid;
  return payload;
}

function mapNotification(row) {
  return {
    id: row.id,
    userId: row.user_id,
    message: row.message,
    type: row.type,
    read: row.read,
    link: row.link,
    createdAt: row.created_at,
  };
}

function mapGalleryImage(row) {
  return {
    id: row.id,
    url: row.url,
    name: row.name,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
  };
}

function mapMessage(row) {
  return {
    id: row.id,
    designRequestId: row.design_request_id,
    senderId: row.sender_id,
    senderEmail: row.sender_email,
    senderName: row.sender_name,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
    replyToId: row.reply_to_id,
    replyToName: row.reply_to_name,
    replyToMessage: row.reply_to_message,
    deleted: row.deleted,
    deletedBy: row.deleted_by,
    deletedByLabel: row.deleted_by_label,
    deletedFor: row.deleted_for || [],
  };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- Auth ----------

  async function signup(email, password, profile = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: profile },
    });
    if (error) throw error;
    return data;
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }

  function logout() {
    return supabase.auth.signOut();
  }

  async function getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      return mapProfile(data);
    } catch {
      return null;
    }
  }

  async function saveUserProfile(userId, profile) {
    try {
      const payload = { id: userId, email: profile.email, active: true };
      if (profile.surname) payload.surname = profile.surname;
      if (profile.firstName) payload.first_name = profile.firstName;
      if (profile.lastName) payload.last_name = profile.lastName;
      if (profile.profilePicture) payload.profile_picture = profile.profilePicture;
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }
  }

  async function getProfileByEmail(email) {
    try {
      const { data, error } = await supabase.rpc('get_user_id_by_email', { target_email: email });
      if (error) throw error;
      return data ? { id: data } : null;
    } catch {
      return null;
    }
  }

  async function getRegisteredUsers() {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return (data || []).map((row) => ({ userId: row.id, ...mapProfile(row) }));
    } catch (err) {
      console.error('Failed to fetch registered users:', err);
      return [];
    }
  }

  async function deleteRegisteredUser(userId) {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  }

  async function hasProfilePicture(userId) {
    const profile = await getUserProfile(userId);
    return !!(profile && profile.profilePicture);
  }

  async function updateProfilePicture(userId, file) {
    try {
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(path);

      await supabase.from('profiles').update({ profile_picture: publicUrl }).eq('id', userId);
      return publicUrl;
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      return null;
    }
  }

  // ---------- Design Requests ----------

  async function getDesignRequests() {
    try {
      const { data, error } = await supabase
        .from('design_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRequest);
    } catch (err) {
      console.error('Failed to fetch design requests:', err);
      return [];
    }
  }

  function subscribeToDesignRequests(callback) {
    const fetchAll = async () => callback(await getDesignRequests());
    fetchAll();
    const topic = `design-requests-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(topic)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'design_requests' }, fetchAll)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }

  async function saveDesignRequest(request) {
    const { data, error } = await supabase.from('design_requests').insert({
      user_id: currentUser?.id,
      name: request.name,
      email: request.email,
      phone: request.phone,
      service: request.service,
      description: request.description,
      timeline: request.timeline,
      budget: request.budget || null,
      status: 'Pending',
    }).select('id');
    if (error) throw error;

    const requestId = data?.[0]?.id;

    try {
      const adminProfile = await getProfileByEmail(ADMIN_EMAIL);
      if (adminProfile) {
        await addNotification(
          adminProfile.id,
          `New design request from ${request.name || 'a user'} (${request.service})`,
          'design_request',
          requestId ? `/admin/design-requests/reply/${requestId}` : '/admin/design-requests'
        );
      }
    } catch (err) {
      console.error('Failed to notify admin:', err);
    }
  }

  async function updateDesignRequest(id, data) {
    try {
      const { error } = await supabase
        .from('design_requests')
        .update(toRequestWrite(data))
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to update design request:', err);
      return false;
    }
  }

  async function rejectDesignRequest(id, reason) {
    try {
      const ok = await updateDesignRequest(id, {
        status: 'Rejected',
        rejectReason: reason,
        rejectedAt: new Date().toISOString(),
      });
      if (!ok) return false;

      const { data, error } = await supabase
        .from('design_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      const request = mapRequest(data);

      if (request?.email) {
        const userProfile = await getProfileByEmail(request.email);
        if (userProfile) {
          await addNotification(
            userProfile.id,
            `Your design request "${request.service}" has been rejected. Reason: ${reason}`,
            'design_request',
            '/rejected-projects'
          );
        }
      }
      return true;
    } catch (err) {
      console.error('Failed to reject design request:', err);
      return false;
    }
  }

  async function acceptDesignRequest(id, { price, adminComment }) {
    try {
      await updateDesignRequest(id, {
        status: 'Accepted',
        standardPrice: price,
        premiumPrice: price,
        adminComment: (adminComment || '').trim(),
        repliedAt: new Date().toISOString(),
      });

      const { data, error } = await supabase
        .from('design_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      const request = mapRequest(data);

      if (request?.email) {
        const userProfile = await getProfileByEmail(request.email);
        if (userProfile) {
          await addNotification(
            userProfile.id,
            `Your design request "${request.service}" has been accepted! Price: ₦${Number(price).toLocaleString()}`,
            'design_request',
            '/dashboard'
          );
        }
      }
    } catch (err) {
      console.error('Failed to accept design request:', err);
    }
  }

  async function uploadProjectFile(file) {
    try {
      const path = `${currentUser?.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(path);

      return { url: publicUrl, name: file.name };
    } catch (err) {
      console.error('Failed to upload project file:', err);
      return null;
    }
  }

  async function submitProject(requestId, { fileUrl, fileName, message }) {
    try {
      const updated = await updateDesignRequest(requestId, {
        status: 'Completed',
        submittedFileUrl: fileUrl,
        submittedFileName: fileName,
        submittedMessage: (message || '').trim(),
        submittedAt: new Date().toISOString(),
      });
      if (!updated) return false;

      const { data, error } = await supabase
        .from('design_requests')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();
      if (error) throw error;
      const request = mapRequest(data);

      if (request?.email) {
        const userProfile = await getProfileByEmail(request.email);
        if (userProfile) {
          await addNotification(
            userProfile.id,
            `Your project "${request.service}" has been submitted! View the finished design in your Completed Projects.`,
            'design_request',
            '/completed-projects'
          );
        }
      }
      return true;
    } catch (err) {
      console.error('Failed to submit project:', err);
      return false;
    }
  }

  async function processHalfPayment(requestId) {
    const ok = await updateDesignRequest(requestId, {
      halfPaid: true,
    });
    if (!ok) throw new Error('Failed to update payment status');

    const { data, error } = await supabase
      .from('design_requests')
      .select('*')
      .eq('id', requestId)
      .maybeSingle();
    if (error) throw error;
    const request = mapRequest(data);

    if (request?.email) {
      const userProfile = await getProfileByEmail(request.email);
      if (userProfile) {
        await addNotification(
          userProfile.id,
          `Payment received for "${request.service}"! Your design is now being worked on.`,
          'payment',
          '/completed-projects'
        );
      }
    }
    return true;
  }

  async function toggleUserStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('active')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ active: data.active === false })
        .eq('id', userId);
      if (updateError) throw updateError;
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  }

  // ---------- Notifications ----------

  async function getNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapNotification);
    } catch {
      return [];
    }
  }

  async function getUnreadNotificationCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      if (error) throw error;
      return count || 0;
    } catch {
      return 0;
    }
  }

  async function markNotificationAsRead(notifId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notifId);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }

  async function deleteNotification(notifId) {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', notifId);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }

  async function markAllNotificationsAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }

  async function deleteAllNotifications(userId) {
    try {
      const { error } = await supabase.from('notifications').delete().eq('user_id', userId);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete all notifications:', err);
    }
  }

  async function addNotification(userId, message, type = 'info', link = '') {
    const payload = { user_id: userId, message, type, read: false };
    try {
      if (link) {
        const { error } = await supabase.from('notifications').insert({ ...payload, link });
        if (error) {
          console.warn('Notification link insert failed, retrying without link:', error.message);
          const { error: fallbackError } = await supabase.from('notifications').insert(payload);
          if (fallbackError) throw fallbackError;
        }
      } else {
        const { error } = await supabase.from('notifications').insert(payload);
        if (error) throw error;
      }
    } catch (err) {
      console.error('Failed to add notification:', err);
    }
  }

  function subscribeToNotifications(userId, callback) {
    const fetchAll = async () => callback(await getNotifications(userId));
    fetchAll();
    const topic = `notifications-${userId}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(topic)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchAll)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }

  // ---------- Messages ----------

  async function sendMessage(designRequestId, message, currentUserProfile, replyTo = null) {
    try {
      const senderName = currentUserProfile
        ? [currentUserProfile.surname, currentUserProfile.firstName, currentUserProfile.lastName].filter(Boolean).join(' ') || currentUser.email
        : currentUser.displayName || currentUser.email;

      const { error: insertError } = await supabase.from('messages').insert({
        design_request_id: designRequestId,
        sender_id: currentUser.id,
        sender_email: currentUser.email,
        sender_name: senderName,
        message,
        read: false,
        reply_to_id: replyTo?.id ?? null,
        reply_to_name: replyTo?.senderName ?? null,
        reply_to_message: replyTo?.message ?? null,
      });
      if (insertError) throw insertError;

      const { data: requestData, error: reqError } = await supabase
        .from('design_requests')
        .select('*')
        .eq('id', designRequestId)
        .maybeSingle();
      if (reqError) throw reqError;
      const request = mapRequest(requestData);
      if (!request) return;

      const isFromAdmin = currentUser.email === ADMIN_EMAIL;
      let recipient;
      if (isFromAdmin) {
        recipient = await getProfileByEmail(request.email);
      } else {
        recipient = await getProfileByEmail(ADMIN_EMAIL);
      }

      if (recipient) {
        const snippet = (message || '').trim();
        await addNotification(
          recipient.id,
          `New message from ${isFromAdmin ? 'Admin' : senderName} regarding "${request.service}" request${snippet ? `: "${snippet.slice(0, 80)}"` : ''}`,
          'message',
          isFromAdmin
            ? `/dashboard?thread=${designRequestId}`
            : `/admin?client=${request.userId}&thread=${designRequestId}`
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  function subscribeToMessages(designRequestId, callback) {
    const fetchAll = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('design_request_id', designRequestId)
          .order('created_at', { ascending: true });
        if (error) throw error;
        callback((data || []).map(mapMessage));
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchAll();
    const topic = `messages-${designRequestId}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(topic)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchAll)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }

  async function deleteMessageForEveryone(messageId, deleterLabel) {
    try {
      const isAdmin = currentUser?.email === ADMIN_EMAIL;
      const { error } = await supabase
        .from('messages')
        .update({
          deleted: true,
          deleted_by: currentUser.id,
          deleted_by_label: isAdmin ? 'Admin deleted this message' : deleterLabel || 'This message was deleted',
        })
        .eq('id', messageId);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete message for everyone:', err);
    }
  }

  async function deleteMessageForMe(messageId) {
    try {
      const { error } = await supabase.rpc('delete_message_for_me', {
        p_message_id: messageId,
        p_user_id: currentUser.id,
      });
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete message for me:', err);
    }
  }

  // ---------- Gallery ----------

  const isAdmin = () => currentUser?.email === ADMIN_EMAIL;

  async function getGalleryImages() {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapGalleryImage);
    } catch (err) {
      console.error('Failed to fetch gallery images:', err);
      return [];
    }
  }

  const subscribeToGalleryImages = useCallback((callback) => {
    const fetchAll = async () => {
      const images = await getGalleryImages();
      callback(images);
    };
    fetchAll();
    const topic = `gallery-images-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(topic)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchAll)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function uploadGalleryImage(file) {
    if (!isAdmin() || !file) return null;
    try {
      const path = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(path);

      const { data, error } = await supabase
        .from('gallery_images')
        .insert({
          url: publicUrl,
          name: file.name,
          uploaded_by: currentUser.id,
        })
        .select('*')
        .single();
      if (error) throw error;
      return mapGalleryImage(data);
    } catch (err) {
      console.error('Failed to upload gallery image:', err);
      return null;
    }
  }

  async function deleteGalleryImage(image) {
    if (!isAdmin() || !image) return false;
    try {
      const { error: deleteError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);
      if (deleteError) throw deleteError;

      const marker = '/gallery-images/';
      const markerIndex = image.url.indexOf(marker);
      if (markerIndex !== -1) {
        const path = image.url.slice(markerIndex + marker.length).split('?')[0];
        if (path) {
          await supabase.storage.from('gallery-images').remove([path]);
        }
      }
      return true;
    } catch (err) {
      console.error('Failed to delete gallery image:', err);
      return false;
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(compatUser(session.user));
        syncGoogleProfile(session.user);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(compatUser(session.user));
        syncGoogleProfile(session.user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function compatUser(user) {
    const meta = user.user_metadata || {};
    return {
      id: user.id,
      uid: user.id,
      email: user.email,
      displayName: meta.full_name || meta.name || null,
      photoURL: meta.avatar_url || meta.picture || null,
      metadata: { creationTime: user.created_at },
    };
  }

  async function syncGoogleProfile(user) {
    try {
      if ((user.app_metadata?.provider !== 'google' && (user.user_metadata?.iss !== 'https://accounts.google.com')) || !user.email) {
        return;
      }
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      if (existing) return;

      const meta = user.user_metadata || {};
      const fullName = meta.full_name || meta.name || '';
      const parts = fullName.split(' ').filter(Boolean);
      await saveUserProfile(user.id, {
        email: user.email,
        surname: parts.slice(1).join(' ') || '',
        firstName: parts[0] || '',
        lastName: '',
        profilePicture: meta.avatar_url || meta.picture || '',
      });
    } catch {
      // non-critical backfill
    }
  }

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    getUserProfile,
    saveUserProfile,
    getRegisteredUsers,
    deleteRegisteredUser,
    hasProfilePicture,
    updateProfilePicture,
    getDesignRequests,
    subscribeToDesignRequests,
    saveDesignRequest,
    updateDesignRequest,
    rejectDesignRequest,
    acceptDesignRequest,
    uploadProjectFile,
    submitProject,
    processHalfPayment,
    toggleUserStatus,
    ADMIN_EMAIL,
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    subscribeToNotifications,
    sendMessage,
    subscribeToMessages,
    deleteMessageForEveryone,
    deleteMessageForMe,
    getGalleryImages,
    subscribeToGalleryImages,
    uploadGalleryImage,
    deleteGalleryImage,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
