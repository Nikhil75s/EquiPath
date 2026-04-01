import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AnnouncerContext = createContext();

export function AriaLiveRegion({ children }) {
  const [announcements, setAnnouncements] = useState([]);

  const announce = useCallback((message, politeness = 'polite') => {
    const id = Date.now() + Math.random().toString();
    setAnnouncements(prev => [...prev, { id, message, politeness }]);
    
    // Clean up after it's announced (SRs usually read it immediately)
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 5000);
  }, []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      {/* Visually Hidden Live Regions for Screen Readers */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}
      >
        {announcements.filter(a => a.politeness === 'polite').map(a => (
          <div key={a.id}>{a.message}</div>
        ))}
      </div>
      <div 
        className="sr-only" 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}
      >
        {announcements.filter(a => a.politeness === 'assertive').map(a => (
          <div key={a.id}>{a.message}</div>
        ))}
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useAnnouncer() {
  return useContext(AnnouncerContext);
}
