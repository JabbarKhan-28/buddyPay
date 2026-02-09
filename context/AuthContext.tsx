import { onAuthStateChanged, signOut, User } from '@firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';

type AuthContextType = {
     user: User | null;
     loading: boolean;
     logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
     user: null,
     loading: true,
     logout: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
               setUser(user);
               setLoading(false);
          });

          return unsubscribe;
     }, []);

     const logout = async () => {
          try {
               await signOut(auth);
          } catch (error) {
               console.error("Logout error:", error);
          }
     };

     return (
          <AuthContext.Provider value={{ user, loading, logout }}>
               {children}
          </AuthContext.Provider>
     );
};

export const useAuth = () => useContext(AuthContext);
