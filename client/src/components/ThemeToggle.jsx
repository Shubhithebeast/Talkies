import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} title={`Switch to ${theme.name === 'dark' ? 'light' : 'dark'} mode`}>
      {theme.name === 'dark' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </ToggleButton>
  );
};

const ToggleButton = styled.button`
  background: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.primaryLight};
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  
  &:hover {
    background: ${props => props.theme.primaryLight};
    transform: rotate(15deg) scale(1.05);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }
  
  svg {
    stroke-width: 2.5;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
  }
`;

export default ThemeToggle;
