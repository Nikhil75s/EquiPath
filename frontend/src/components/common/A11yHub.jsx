import React, { useState } from 'react';
import { useA11y } from '../../context/A11yContext';

export default function A11yHub() {
  const [isOpen, setIsOpen] = useState(false);
  const { prefs, updatePref } = useA11y();

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 p-5 w-64 animate-[fade-in_0.2s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-surface-900 border-b-2 border-primary-500 pb-1 w-full text-center">Accessibility Hub</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-medium text-surface-700 group-hover:text-primary-600">High Contrast</span>
              <input type="checkbox" className="sr-only" checked={prefs.highContrast} onChange={(e) => updatePref('highContrast', e.target.checked)} />
              <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${prefs.highContrast ? 'bg-primary-600' : 'bg-surface-300'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${prefs.highContrast ? 'translate-x-4 bg-white' : 'bg-white'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-medium text-surface-700 group-hover:text-primary-600">Larger Text (+25%)</span>
              <input type="checkbox" className="sr-only" checked={prefs.largeText} onChange={(e) => updatePref('largeText', e.target.checked)} />
              <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${prefs.largeText ? 'bg-primary-600' : 'bg-surface-300'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${prefs.largeText ? 'translate-x-4 bg-white' : 'bg-white'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-medium text-surface-700 group-hover:text-primary-600">Dyslexic Font</span>
              <input type="checkbox" className="sr-only" checked={prefs.dyslexicFont} onChange={(e) => updatePref('dyslexicFont', e.target.checked)} />
              <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${prefs.dyslexicFont ? 'bg-primary-600' : 'bg-surface-300'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${prefs.dyslexicFont ? 'translate-x-4 bg-white' : 'bg-white'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-medium text-surface-700 group-hover:text-primary-600">Reduced Motion</span>
              <input type="checkbox" className="sr-only" checked={prefs.reducedMotion} onChange={(e) => updatePref('reducedMotion', e.target.checked)} />
              <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${prefs.reducedMotion ? 'bg-primary-600' : 'bg-surface-300'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${prefs.reducedMotion ? 'translate-x-4 bg-white' : 'bg-white'}`} />
              </div>
            </label>
          </div>
          
          <button onClick={() => setIsOpen(false)} className="mt-5 w-full py-2 text-sm text-surface-500 hover:bg-surface-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
            Close Panel
          </button>
        </div>
      )}

      <button
        onClick={toggleOpen}
        className="h-14 w-14 rounded-full bg-primary-600 text-white shadow-xl hover:bg-primary-700 hover:scale-105 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-offset-2"
        aria-label={isOpen ? "Close Accessibility Options" : "Open Accessibility Options"}
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
        </svg>
      </button>
    </div>
  );
}
