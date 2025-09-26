import { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// --- Définition des Types ---
// Décrit la forme d'un objet utilisateur. Adaptez-le à vos besoins.
interface User
{
  id: number;
  name: string;
  email: string;
  keymap: string;
  language: string;
}

// Décrit la forme de ce que notre Contexte va fournir.
interface AuthContextType
{
  user: User | null;
  isLoading: boolean;
  register: (email: string, password: string, username: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  wsRef: React.MutableRefObject<WebSocket | null>;
  updateUsername: (newName: string) => void;
}

// --- Création du Contexte ---
// On type le contexte pour qu'il s'attende à la forme de AuthContextType ou null.
const AuthContext = createContext<AuthContextType | null>(null);

// --- Création du Provider ---
// On type les props du Provider. "children" représente les composants enfants.
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps)
{
  // On type l'état 'user'. Il peut être soit un objet User, soit null.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const response = await fetch('/api/user/getloggeduser', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData: User = await response.json();
          console.log(userData);
          setUser(userData);
        } else {
          console.log("that's why i don't see anything")
          setUser(null);
        }
      } catch (error) {
        console.error("that's really strange", error)
        setUser(null);
      } finally {
        setIsLoading(false);
  const { t } = useTranslation();

  const getLoggedUser = async () =>
  {
    try
    {
      const response = await fetch('/api/user/getloggeduser');
      if (!response.ok)
      {
        throw new Error(t("auth.error.unauthenticated"));
      }
      const userData = await response.json();
      setUser(userData);
    }
    catch (error: any)
    {
      console.log("Aucune session active trouvée.", error.message);
      setUser(null);
    }
  };
   useEffect(() =>
   {
      const checkUserSession = async () =>
      {
        setIsLoading(true);
        await getLoggedUser();
        setIsLoading(false);
      };
      checkUserSession();
    }, []);

  const register = async (name: string, email: string, password: string) =>
  {
    const response = await fetch('/api/auth/signup',
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, password: password })
    });

  useEffect(() => {
    if (!user || wsRef.current) return;

    const wsUrl = `wss://${window.location.hostname}:8443/online`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "connection", id: user.id }));
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [user]);

  const login = async (email: string, password: string) =>
  {
    const response = await fetch('/api/auth/login',
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userlogin: email, password: password })
    });

    if (!response.ok)
    {
      const errorData = await response.json();
      throw new Error(errorData.msg || t("auth.error.loginFailed"));
    }

    await getLoggedUser();
  };

  const logout = async () =>
  {
    try
    {
      const response = await	fetch('/api/auth/logout',
        {
  				method: 'DELETE',
  				credentials: 'include'
  			})
  		if (response.ok)
        setUser(null);
  		else
  		  console.error("back deconnexion failed");
  	}
    catch(error)
    {
      console.error(error)
    }
      setUser(null);
  };


  const updateUsername = async (newName: string) => {
    if (!user) {
      throw new Error(t("auth.error.notConnected"));
    }
    try {
      const response = await fetch(`/api/user/updateusername/${newName}`, {
        method: 'PUT',
        credentials: 'include',
      });

      console.log('Réponse du serveur reçue:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(t("auth.error.serverErrorWithStatus", { status: response.status }));
      }
      const data = await response.json();

      console.log('Données JSON lues depuis la réponse:', data);

      const actualSavedName = data.name;

      console.log('Nom réellement sauvegardé selon le serveur:', actualSavedName);

      setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, name: actualSavedName };
      });

    } catch (error) {
      console.error("Erreur dans updateUsername:", error);
      throw error;
    }
  };

  const value: AuthContextType =
  {
    user,
    isLoading,
    register,
    login,
    logout,
    wsRef,
    updateUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Création du Custom Hook ---
// C'est ici que la magie de TypeScript opère pour la sécurité.
export default function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // Si on essaie d'utiliser ce hook en dehors du Provider, le contexte sera null.
  // On lève une erreur claire pour le développeur.
  if (context === null) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  // Si le contexte existe, on sait (grâce au typage) qu'il correspond à AuthContextType.
  return context;
}
