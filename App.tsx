import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { MouseEffects } from './components/MouseEffects';
import { AdminDashboard } from './components/Admin/AdminDashboard'; // Import the dashboard

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    let buffer = '';
    const secret = 'benzZmc1!@';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow user to type the secret code to toggle admin
      if (e.key.length === 1) {
        buffer += e.key;
        if (buffer.length > secret.length) {
          buffer = buffer.slice(-secret.length);
        }

        if (buffer === secret) {
          setShowAdmin(prev => !prev);
          buffer = ''; // Reset after triggering
        }
      } else if (e.key === 'Backspace') {
        buffer = buffer.slice(0, -1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Track Site Visit
    const logVisit = async () => {
      // Simple visitor tracking
      let visitorId = localStorage.getItem('v_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('v_id', visitorId);
      }

      try {
        // Optional: Get rough location from public IP API (client-side only demo) or just log
        // For now, simpler is better to avoid blocking
        const { supabase } = await import('./lib/supabase');
        await supabase.from('site_visits').insert([{
          visitor_id: visitorId,
          page: window.location.pathname,
          user_agent: navigator.userAgent
        }]);
      } catch (e) {
        console.warn('Analytics error', e);
      }
    };

    logVisit();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-[#020617] text-slate-200">
      <Header />
      <div className="fixed top-0 left-0 w-full h-1 z-[9999]" onDoubleClick={() => setShowAdmin(true)}></div> {/* Hidden trigger just in case */}

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}

      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;