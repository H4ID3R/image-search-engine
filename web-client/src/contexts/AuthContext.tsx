import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface Image {
  image_url: string;
  filename: string;
  uploaded_at: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
  images: Image[];
  setImages: (newImages: Image[]) => void;
  addImages: (newImages: Image[]) => void;
  loading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading state

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    setLoading(false); // Set loading to false after checking localStorage
  }, []);

  const login = (token: string) => {
    setIsAuthenticated(true);
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setImages([]); // Clear images on logout
    localStorage.removeItem('token');
  };

  const addImages = (newImages: Image[]) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, images, setImages, addImages, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
