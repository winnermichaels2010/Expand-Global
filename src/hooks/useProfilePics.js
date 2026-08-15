import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useProfilePicsByEmail() {
  const { getRegisteredUsers } = useAuth();
  const [profilePics, setProfilePics] = useState({});

  useEffect(() => {
    let mounted = true;
    getRegisteredUsers().then((users) => {
      if (!mounted) return;
      const map = {};
      users.forEach((u) => {
        if (u.email) map[u.email.toLowerCase()] = u.profilePicture || null;
      });
      setProfilePics(map);
    });
    return () => {
      mounted = false;
    };
  }, [getRegisteredUsers]);

  return profilePics;
}
