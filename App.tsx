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
      // Prevent duplicate logging on reload (Session based)
      if (sessionStorage.getItem('session_visit_logged')) return;

      let visitorId = localStorage.getItem('v_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('v_id', visitorId);
      }

      try {
        const { supabase } = await import('./lib/supabase');

        // 1. Get Basic Info
        const ua = navigator.userAgent;
        let os = 'Unknown';

        // More accurate OS detection
        if (ua.indexOf("Win") !== -1) os = "Windows";
        else if (ua.indexOf("Android") !== -1) os = "Android";
        else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPod") !== -1) os = "iOS";
        else if (ua.indexOf("Mac") !== -1) {
          // Check for iPad/touch devices masquerading as Mac
          if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
            os = "iPadOS";
          } else {
            os = "MacOS";
          }
        }
        else if (ua.indexOf("Linux") !== -1) os = "Linux";

        // 2. Get Geolocation (with fallback)
        let geo: any = {};
        try {
          // Try ipapi.co first (usually accurate)
          const res = await fetch('https://ipapi.co/json/');
          if (res.ok) {
            geo = await res.json();
          } else {
            throw new Error('ipapi failed');
          }
        } catch (e) {
          try {
            // Fallback to ipwho.is
            const res = await fetch('https://ipwho.is/');
            if (res.ok) {
              geo = await res.json();
            }
          } catch (err) {
            console.warn('Geo fetch failed', err);
          }
        }

        // 3. Log to DB
        await supabase.from('site_visits').insert([{
          visitor_id: visitorId,
          page: window.location.pathname,
          user_agent: ua,
          os: os,
          country: geo.country || 'Unknown',
          city: geo.city || 'Unknown',
          region: geo.region || 'Unknown',
          ip: geo.ip || 'Unknown'
        }]);

        sessionStorage.setItem('session_visit_logged', 'true');
      } catch (e) {
        console.warn('Analytics error', e);
      }
    };

    logVisit();

    // Console Signature
    // Console Signature
    const styleTitle = 'color: #e0f2fe; font-size: 60px; font-weight: 900; font-family: sans-serif; text-shadow: 1px 1px 0 #0ea5e9, 2px 2px 0 #0284c7, 3px 3px 0 #0369a1, 4px 4px 0 #075985, 5px 5px 0 #0c4a6e; margin-bottom: 10px;';
    const styleSubtitle = 'color: #94a3b8; font-size: 14px; font-family: "Courier New", monospace; letter-spacing: 2px; padding: 4px 0; font-weight: bold;';
    const styleWarning = 'background: #0f172a; color: #fbbf24; border: 1px solid #fbbf24; padding: 12px; border-radius: 4px; font-family: sans-serif; font-size: 12px; margin-top: 16px;';

    console.clear();
    console.log('%cBENZ SIANGCO', styleTitle);
    console.log('%cCREATIVE EDITOR & FULL STACK DEVELOPER', styleSubtitle);
    console.log('%c⚠️ NOTE: This console is intended for developers. Pasting unknown code here may compromise your data.', styleWarning);


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