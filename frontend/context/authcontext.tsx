// This is useless for now, but it keeps a global state of whether or not a user is logged in
// So it might be useful in the future

// lib/auth.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of context value
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

// Define the props expected by AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create a typed context (initial value set to null for now)
const AuthContext = createContext<AuthContextType | null>(null);

// Provider with children type
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook that throws if context is not found
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

