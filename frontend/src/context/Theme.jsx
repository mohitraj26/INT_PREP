import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          background: {
            default: '#f4f6f8', // Light background
            paper: '#ffffff',
          },
          primary: {
            main: '#1976d2',
          },
          text: {
            primary: '#000000',
          },
        }
      : {
          background: {
            default: '#111827', // Tailwind bg-gray-900
            paper: '#1f2937',   // Tailwind bg-gray-800
          },
          primary: {
            main: '#60a5fa', // Tailwind blue-400
          },
          text: {
            primary: '#ffffff',
          },
        }),
  },
});


export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setMode(saved);
  }, []);

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem('theme', next);
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, isDarkMode: mode === 'dark' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

