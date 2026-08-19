import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const UserContext = createContext<{
  userId: string | null;
  setUserId: (id: string | null) => void;
  logout: () => void;
}>({
  userId: null,
  setUserId: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserIdState] = useState<string | null>(null);

  // On mount, check session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/session`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('No session');
        const data = await res.json();
        if (data.loggedIn && data.userId) {
          setUserIdState(data.userId);
        } else {
          setUserIdState(null);
        }
      } catch {
        setUserIdState(null);
      }
    };
    checkSession();
  }, []);

  // Used after login/register success
  const setUserId = (id: string | null) => {
    setUserIdState(id);
  };

  // Logout: call server and clear userId
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    setUserIdState(null);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export { UserContext };

