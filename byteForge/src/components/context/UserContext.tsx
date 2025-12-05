import { createContext, useContext, useState, type ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface UserContextValue {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const UserContext = createContext<UserContextValue | null>(null);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("http://192.168.1.105:3000/auth/register", {
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
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      throw new Error(message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://192.168.1.105:3000/auth/login", {
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
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, register, login, logout }}>
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
