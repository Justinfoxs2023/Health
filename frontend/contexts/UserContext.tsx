import React from 'react';

export interface IUser {
  /** id 的描述 */
  id: string;
  /** name 的描述 */
  name: string;
  /** avatar 的描述 */
  avatar: string;
  /** role 的描述 */
  role: 'user' | 'nutritionist' | 'admin';
}

interface IUserContextValue {
  /** currentUser 的描述 */
  currentUser?: IUser;
  /** setCurrentUser 的描述 */
  setCurrentUser: (user: IUser) => void;
  /** logout 的描述 */
  logout: () => void;
}

export const UserContext = React.createContext<IUserContextValue>({
  setCurrentUser: () => {},
  logout: () => {},
});

export const useUser = () => React.useContext(UserContext);

export const UserProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<IUser>();

  const logout = () => {
    setCurrentUser(undefined);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
