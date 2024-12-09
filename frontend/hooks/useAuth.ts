interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  // 实现登录、登出等逻辑...

  return {
    currentUser,
    setCurrentUser,
    // 其他方法...
  };
}; 