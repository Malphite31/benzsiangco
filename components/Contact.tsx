import React, { useState, useEffect, useRef } from 'react';
import { Send, Mail, Clock } from 'lucide-react';
import { Button } from './Button';
import { PORTFOLIO_DATA } from '../constants';
import { supabase } from '../lib/supabase';

export const Contact: React.FC = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const paralaxRef = useRef<HTMLDivElement>(null);

    // Profile State (with defaults)
    const [profile, setProfile] = useState({
        email: PORTFOLIO_DATA.socials.email,
        social_upwork: PORTFOLIO_DATA.socials.upwork,
        social_linkedin: PORTFOLIO_DATA.socials.linkedin,
        social_tiktok: PORTFOLIO_DATA.socials.tiktok,
        social_onlinejobs: PORTFOLIO_DATA.socials.onlinejobs,
        social_github: PORTFOLIO_DATA.socials.github,
        contact_subtext: "Ready to elevate your content? Reach out for collaboration. I respond within 24 hours.",
        rush_available: true
    });

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-in-right');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const container = document.querySelector('.contact-container');
        if (container) observer.observe(container);

        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .eq('id', 1)
                .single();

            if (data && !error) {
                setProfile(data);
            }
        };
        fetchProfile();

        const handleMouseMove = (e: MouseEvent) => {
            if (!paralaxRef.current) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            paralaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormState({ name: '', email: '', message: '' });
        }, 1500);
    };

    const socials = [
        { name: 'Upwork', url: profile.social_upwork },
        { name: 'LinkedIn', url: profile.social_linkedin },
        { name: 'TikTok', url: profile.social_tiktok },
        { name: 'OnlineJobs', url: profile.social_onlinejobs },
        { name: 'GitHub', url: profile.social_github }
    ];

    return (
        <section id="contact" className="py-12 md:py-24 bg-[#020617] relative">
            <div ref={paralaxRef} className="parallax-bg opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-[1200px] h-64 md:h-[1200px] bg-blue-600/[0.03] rounded-full blur-[80px] md:blur-[150px]"></div>
            </div>

            <div className="container mx-auto px-4 md:px-5 relative z-10 flex items-center justify-center">
                <div className="contact-container opacity-0 bg-[#0a101f]/80 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] p-4 md:p-16 border border-white/5 relative overflow-hidden shadow-3xl w-full">

                    <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
                        <div className="max-w-xl text-center lg:text-left">
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-600/10 flex items-center justify-center mb-4 md:mb-8 border border-blue-500/10 mx-auto lg:mx-0">
                                <Mail className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
                            </div>
                            <h2 className="text-3xl md:text-8xl font-bold text-white mb-4 md:mb-8 leading-[1.1] md:leading-[0.9] tracking-tighter uppercase">
                                Let's <span className="instrument-serif text-blue-500 italic font-normal normal-case">Connect</span>
                            </h2>
                            <p className="hidden md:block text-slate-400 text-sm md:text-lg font-medium mb-8 md:mb-12 opacity-70 leading-relaxed max-w-md mx-auto lg:mx-0">
                                {profile.contact_subtext}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-4 text-left">
                                <div className="p-4 md:p-6 rounded-[1.2rem] md:rounded-[1.8rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                                    <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Direct Email</p>
                                    <p className="text-white font-bold text-[10px] md:text-xs md:text-sm truncate uppercase tracking-tight">{profile.email}</p>
                                </div>
                                <div className="p-4 md:p-6 rounded-[1.2rem] md:rounded-[1.8rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                                    <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Professional</p>
                                    <div className="flex gap-3 md:gap-4">
                                        <a href={profile.social_upwork} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Upwork</a>
                                        <a href={profile.social_linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors text-[9px] md:text-[10px] font-bold uppercase tracking-widest">LinkedIn</a>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                                {socials.slice(2).map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 md:p-5 rounded-[1rem] md:rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all text-center"
                                    >
                                        <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">{link.name}</p>
                                    </a>
                                ))}
                            </div>

                            {profile.rush_available && (
                                <div className="hidden md:flex p-4 md:p-6 rounded-[1.5rem] border border-blue-500/10 bg-blue-500/[0.02] items-center gap-3 md:gap-4 text-left md:max-w-xs mx-auto lg:mx-0">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                        <Clock className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-[10px] md:text-xs">Rush Turnaround Available</p>
                                        <p className="text-slate-500 text-[8px] uppercase tracking-widest mt-0.5">24-hour delivery delivery.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative w-full">
                            <form onSubmit={handleSubmit} className="p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-[#020617]/80 border border-white/10 space-y-3 md:space-y-6">

                                {submitted ? (
                                    <div className="py-12 md:py-20 text-center animate-fade-in-up">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl">
                                            <Send className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4 uppercase tracking-tight">Sent</h3>
                                        <p className="text-slate-500 text-[8px] md:text-xs uppercase tracking-widest">Talk soon.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3 md:space-y-6 text-left">
                                            <div className="group">
                                                <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2 block">Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-white/5 border border-white/5 rounded-lg md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold text-[10px] md:text-xs"
                                                    placeholder="Your Name"
                                                    value={formState.name}
                                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="group">
                                                <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2 block">Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-white/5 border border-white/5 rounded-lg md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold text-[10px] md:text-xs"
                                                    placeholder="Your Email"
                                                    value={formState.email}
                                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="group">
                                                <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2 block">Details</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    className="w-full bg-white/5 border border-white/5 rounded-lg md:rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold text-[10px] md:text-xs resize-none"
                                                    placeholder="Project brief..."
                                                    value={formState.message}
                                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <Button type="submit" isLoading={isSubmitting} variant="secondary" className="w-full py-3 md:py-5 text-[9px] md:text-sm uppercase tracking-[0.2em] font-black">Send Proposal</Button>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};