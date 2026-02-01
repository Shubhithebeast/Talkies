import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const lightTheme = {
  name: 'light',
  background: '#e8eaed',
  containerBg: '#f0f2f5',
  text: '#111827',
  textSecondary: '#6b7280',
  primary: '#7c3aed',
  primaryLight: '#a78bfa',
  secondary: '#10b981',
  chatBg: '#ebedef',
  messageSent: '#7c3aed',
  messageReceived: '#dfe1e5',
  messageSentText: '#ffffff',
  messageReceivedText: '#111827',
  border: '#c4c7cc',
  hover: '#dcdee1',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  name: 'dark',
  background: '#0f0f23',
  containerBg: '#1a1a2e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  primary: '#7c3aed',
  primaryLight: '#a78bfa',
  secondary: '#10b981',
  chatBg: '#16213e',
  messageSent: '#7c3aed',
  messageReceived: '#2a2a4e',
  messageSentText: '#ffffff',
  messageReceivedText: '#ffffff',
  border: '#2a2a4e',
  hover: '#252547',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('chat-app-theme');
    return savedTheme === 'light' ? lightTheme : darkTheme;
  });

  const toggleTheme = () => {
    const newTheme = theme.name === 'dark' ? lightTheme : darkTheme;
    setTheme(newTheme);
    localStorage.setItem('chat-app-theme', newTheme.name);
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
