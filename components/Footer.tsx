import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 py-8 border-t border-slate-900">
      <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
        <p>&copy; 2025 Benz Siangco. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-50">Built with React, Tailwind, and Gemini AI.</p>
      </div>
    </footer>
  );
};