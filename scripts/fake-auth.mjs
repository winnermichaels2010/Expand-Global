
  import React from 'react';
  export function useAuth() { return {"currentUser":{"id":"test-id","uid":"test-id","email":"user@example.com","displayName":"Test User"},"ADMIN_EMAIL":"adminemail@gmail.com"}; }
  export const AuthProvider = ({ children }) => children;
