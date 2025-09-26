import { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';

// --- Définition des Types ---
// Décrit la forme d'un objet utilisateur. Adaptez-le à vos besoins.
interface User {
  id: number;
  name: string;
  email: string;
  keymap: string;
  language: string;
}

// Décrit la forme de ce que notre Contexte va fournir.
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  wsRef: React.MutableRefObject<WebSocket | null>;
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

// --- Création du Contexte ---
// On type le contexte pour qu'il s'attende à la forme de AuthContextType ou null.
const default_image = "/futuristic-avatar.svg";
const AuthContext = createContext<AuthContextType | null>(null);


// --- Création du Provider ---
// On type les props du Provider. "children" représente les composants enfants.
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  // On type l'état 'user'. Il peut être soit un objet User, soit null.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const wsRef = useRef<WebSocket | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(default_image);

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
      }
    };

    checkLoggedInUser();
  }, []);

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

  useEffect(() => {
    setImageUrl(default_image);
  }, [user?.id]);

  // La fonction login attend un paramètre qui doit être de type User.
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  // La valeur fournie correspondra parfaitement à notre interface AuthContextType
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    wsRef,
    imageUrl,
    setImageUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


// --- Création du Custom Hook ---
// C'est ici que la magie de TypeScript opère pour la sécurité.
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // Si on essaie d'utiliser ce hook en dehors du Provider, le contexte sera null.
  // On lève une erreur claire pour le développeur.
  if (context === null) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  // Si le contexte existe, on sait (grâce au typage) qu'il correspond à AuthContextType.
  return context;
}
