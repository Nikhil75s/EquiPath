import React, { createContext, useContext, useState, useEffect } from 'react';

const A11yContext = createContext();

export function A11yProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('equipath_a11y');
    return saved ? JSON.parse(saved) : {
      highContrast: false,
      largeText: false,
      dyslexicFont: false,
      reducedMotion: false,
    };
  });

  const updatePref = (key, value) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('equipath_a11y', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.highContrast) root.setAttribute('data-theme', 'high-contrast');
    else root.removeAttribute('data-theme');

    if (prefs.largeText) root.setAttribute('data-text', 'large');
    else root.removeAttribute('data-text');

    if (prefs.dyslexicFont) root.setAttribute('data-font', 'dyslexic');
    else root.removeAttribute('data-font');

    if (prefs.reducedMotion) root.setAttribute('data-motion', 'reduced');
    else root.removeAttribute('data-motion');
  }, [prefs]);

  return (
    <A11yContext.Provider value={{ prefs, updatePref }}>
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y() {
  return useContext(A11yContext);
}
