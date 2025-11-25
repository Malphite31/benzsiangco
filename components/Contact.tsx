import React, { useState } from 'react';
import { Send, Mail, Clock } from 'lucide-react';
import { Button } from './Button';
import { PORTFOLIO_DATA } from '../constants';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12">
                
                <div>
                    <h2 className="text-3xl font-bold text-white mb-6">Let's Work Together</h2>
                    <p className="text-slate-400 mb-8 font-light">
                        Have a project in mind? Let's create something amazing. The best way to reach me is by email.
                    </p>
                    
                    <div className="space-y-6 mb-8">
                        <div className="flex items-center gap-4 text-slate-300 group">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span>{PORTFOLIO_DATA.socials.email}</span>
                        </div>
                    </div>

                    {/* Social Links Grid */}
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Connect on Platforms</h3>
                    <div className="flex flex-wrap gap-3 mb-8">
                         <a href={PORTFOLIO_DATA.socials.linkedin} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 transition-colors text-sm font-medium">
                             LinkedIn
                         </a>
                         <a href={PORTFOLIO_DATA.socials.tiktok} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 transition-colors text-sm font-medium">
                             TikTok
                         </a>
                         <a href={PORTFOLIO_DATA.socials.upwork} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 transition-colors text-sm font-medium">
                             Upwork
                         </a>
                         <a href={PORTFOLIO_DATA.socials.onlinejobs} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white text-slate-300 transition-colors text-sm font-medium">
                             OnlineJobs.ph
                         </a>
                    </div>

                    {/* Rush Fee Info Box */}
                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="text-white font-semibold text-sm">Need it fast?</h4>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                Rush turnaround (24-48h) is available for urgent deadlines with a <span className="text-blue-200">20-30% priority fee</span>.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {submitted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
                            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                                <Send className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                            <p className="text-slate-400 mt-2 text-sm">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                            <button onClick={() => setSubmitted(false)} className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium">Send another message</button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                    placeholder="John Doe"
                                    value={formState.name}
                                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                    placeholder="john@example.com"
                                    value={formState.email}
                                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1.5">Message</label>
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none placeholder:text-slate-600"
                                    placeholder="Tell me about your project..."
                                    value={formState.message}
                                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                                ></textarea>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full" 
                                isLoading={isSubmitting}
                                icon={<Send className="w-4 h-4" />}
                            >
                                Send an Email
                            </Button>
                        </>
                    )}
                </form>
            </div>
        </div>
      </div>
    </section>
  );
};