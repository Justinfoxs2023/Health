import React from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'user' | 'nutritionist' | 'admin';
}

interface UserContextValue {
  currentUser?: User;
  setCurrentUser: (user: User) => void;
  logout: () => void;
}

export const UserContext = React.createContext<UserContextValue>({
  setCurrentUser: () => {},
  logout: () => {}
});

export const useUser = () => React.useContext(UserContext);

export const UserProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<User>();

  const logout = () => {
    setCurrentUser(undefined);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}; 