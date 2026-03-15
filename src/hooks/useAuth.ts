import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    setIsAuthenticated(loggedIn);
    setIsAdmin(loggedIn && user.role === 'admin');
    setIsSuperAdmin(loggedIn && user.role === 'admin' && user.department === 'ketua-wakil');
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading, isAdmin, isSuperAdmin };
}
