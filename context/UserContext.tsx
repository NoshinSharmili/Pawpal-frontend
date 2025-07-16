import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'userId';

type UserContextType = {
  userId: string | null;
  setUserId: (id: string | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserIdState] = useState<string | null>(null);

  useEffect(() => {
    // Load userId from AsyncStorage on mount
    AsyncStorage.getItem(STORAGE_KEY).then((id) => {
      if (id) setUserIdState(id);
    });
  }, []);

  const setUserId = (id: string | null) => {
    setUserIdState(id);
    if (id) {
      AsyncStorage.setItem(STORAGE_KEY, id);
    } else {
      AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  const logout = () => {
    setUserIdState(null);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export { UserContext };

