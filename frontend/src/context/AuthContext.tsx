import { createContext, useState, useContext, useEffect, ReactNode, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface User
{
  id: number;
  name: string;
  email: string;
  keymap: string;
  language: string;
}

interface AuthContextType
{
  user: User | null;
  isLoading: boolean;
  wsRef: React.MutableRefObject<WebSocket | null>;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsername: (newName: string) => Promise<void>;
  refreshAvatar: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps =
{
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps)
{
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const wsRef = useRef<WebSocket | null>(null);
  const { t } = useTranslation();

  useEffect(() =>
  {
    const checkUserSession = async () =>
    {
      try
      {
        const response = await fetch('/api/user/getloggeduser',
        {
          credentials: 'include',
        });

        if (response.ok)
        {
          const userData: User = await response.json();
          setUser(userData);
        }
        else
        {
          setUser(null);
        }
      }
      catch (error)
      {
        console.error("Erreur lors de la vérification de la session :", error);
        setUser(null);
      }
      finally
      {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    if (!user) {
      if (wsRef.current)
      {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }
    if (wsRef.current) return;
    const wsUrl = `wss://${window.location.hostname}:8443/online`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () =>
    {
      ws.send(JSON.stringify({ type: "connection", id: user.id }));
    };
    ws.onclose = () =>
    {
      wsRef.current = null;
    };
    return () =>
    {
      if (ws.readyState === WebSocket.OPEN)
        ws.close();
    };
  }, [user]);

  const refreshAvatar = useCallback(() =>
  {
    window.dispatchEvent(new CustomEvent('avatarUpdated'));
  }, []);

  const getLoggedUser = useCallback(async () =>
  {
    try
    {
      const response = await fetch('/api/user/getloggeduser', { credentials: 'include' });
      if (!response.ok)
        throw new Error(t("auth.error.unauthenticated"));
      const userData = await response.json();
      setUser(userData);
    }
    catch (error: any)
    {
      setUser(null);
    }
  }, [t]);

  const register = useCallback(async (name: string, email: string, password: string) =>
  {
    const response = await fetch('/api/auth/signup',
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok)
      throw new Error(t("auth.error.registerFailed"));
    await getLoggedUser();
  }, [t, getLoggedUser]);


  const login = useCallback(async (email: string, password: string) =>
  {
    const response = await fetch('/api/auth/login',
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userlogin: email, password: password })
    });
    if (!response.ok)
      throw new Error(t("auth.error.loginFailed"));
    await getLoggedUser();
  }, [t, getLoggedUser]);

  const logout = useCallback(async () =>
  {
    try
    {
      const response = await fetch('/api/auth/logout',
      {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok)
        console.error("La déconnexion côté serveur a échoué.");
    }
    catch (error)
    {
      console.error("Erreur lors de la déconnexion:", error);
    }
    finally
    {
      setUser(null);
    }
  }, []);

  const updateUsername = useCallback(async (newName: string) =>
  {
    if (!user)
      throw new Error(t("auth.error.notConnected"));
    try
    {
      const response = await fetch('/api/user/updateusername',
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newusername: newName })
      });

      if (!response.ok)
        throw new Error(t("auth.error.serverErrorWithStatus", { status: response.status }));
      const data = await response.json();
      const actualSavedName = data.name;
      setUser(currentUser =>
        currentUser ? { ...currentUser, name: actualSavedName } : null
      );
    }
    catch (error)
    {
      console.error("Erreur dans updateUsername:", error);
      throw error;
    }
  }, [user, t]);

  const value = useMemo(() =>
  ({
    user,
    isLoading,
    register,
    login,
    logout,
    wsRef,
    updateUsername,
    refreshAvatar
  }), [user, isLoading, register, login, logout, updateUsername, refreshAvatar]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth(): AuthContextType
{
  const context = useContext(AuthContext);
  if (context === null)
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  return context;
}
