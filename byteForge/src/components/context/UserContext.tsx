import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * UserContext - Manages user authentication and profile
 * Handles login, registration, logout, and user data persistence
 */

export interface User {
  id: string;
  email: string;
  name: string;
  profile_image?: string;
}

interface UserContextValue {
  user: User | null;
  isReady: boolean;
  register: (
    name: string,
    email: string,
    password: string,
    remember?: boolean,
  ) => Promise<boolean>;
  login: (
    email: string,
    password: string,
    remember?: boolean,
  ) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextValue | null>(null);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const STORAGE_KEY = "byteforge:user";
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    profile_image?: string;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsReady(true);
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    remember = false,
  ) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setUser(data.user);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      }
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      throw new Error(message);
    }
  };

  const login = async (email: string, password: string, remember = false) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider
      value={{ user, isReady, register, login, logout, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};

export default UserProvider;
