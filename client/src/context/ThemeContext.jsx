import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const lightTheme = {
  name: 'light',
  background: '#b3d1ff',
  containerBg: '#99c2ff',
  text: '#003380',
  textSecondary: '#0047b3',
  primary: '#005ce6',
  primaryLight: '#1a75ff',
  secondary: '#3385ff',
  chatBg: '#80b3ff',
  messageSent: '#0052cc',
  messageReceived: '#99c2ff',
  messageSentText: '#ffffff',
  messageReceivedText: '#003380',
  border: '#66a3ff',
  hover: '#b3d1ff',
  shadow: 'rgba(0, 61, 153, 0.22)',
  inputBarBg: '#3385ff',
  inputInnerBg: '#80b3ff',
  inputText: '#003380',
  sendBtnBg: '#005ce6',
  sendBtnHover: '#0066ff',
  danger: '#0052cc',
};

export const darkTheme = {
  name: 'dark',
  background: '#05070d',
  containerBg: '#0a1120',
  text: '#eaf2ff',
  textSecondary: '#99c2ff',
  primary: '#4d94ff',
  primaryLight: '#66a3ff',
  secondary: '#3385ff',
  chatBg: '#0d1a33',
  messageSent: '#005ce6',
  messageReceived: '#101a2d',
  messageSentText: '#ffffff',
  messageReceivedText: '#eaf2ff',
  border: '#1a2a4d',
  hover: '#162441',
  shadow: 'rgba(0, 0, 0, 0.6)',
  inputBarBg: '#060b14',
  inputInnerBg: '#13203a',
  inputText: '#eaf2ff',
  sendBtnBg: '#4d94ff',
  sendBtnHover: '#66a3ff',
  danger: '#005ce6',
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
