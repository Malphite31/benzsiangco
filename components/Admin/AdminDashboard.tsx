import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { r2Client, R2_BUCKET, R2_PUBLIC_URL } from '../../lib/r2';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { X, Upload, Save, Trash2, Plus, GripVertical, LogOut, Image, Video, FileText, Users, TrendingUp, BarChart2, Activity } from 'lucide-react';
import { Button } from '../Button';

interface Project {
    id?: number;
    title: string;
    category: string;
    thumbnail_url: string;
    video_url: string;
    description: string;
    sort_order: number;
}

export const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // State
    const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills'>('overview');
    const [navVisible, setNavVisible] = useState(true);

    // Data State
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<any[]>([]); // New Skills State
    const [stats, setStats] = useState({
        visitors: 0,
        views: 0,
        uniqueVisitors: 0,
        todayVisits: 0,
        chartData: [] as { day: string, count: number, height: number }[],
        topProjects: [] as any[]
    });

    // Edit State
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingSkill, setEditingSkill] = useState<any | null>(null); // New Skill Edit State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState('');
    const [uploadEta, setUploadEta] = useState('');
    const uploadXhrRef = useRef<XMLHttpRequest | null>(null);

    // Feedback & Confirm State
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ message: string, onConfirm: () => void } | null>(null);

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 4000);
    };

    useEffect(() => {
        // Initial fetch
        fetchProjects();
        fetchSkills();
        fetchStats();

        // Responsive Sidebar: Auto-hide on mobile
        if (window.innerWidth < 1024) setNavVisible(false);
    }, []);

    const fetchProjects = async () => {
        const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
        if (error) console.error('Error fetching projects:', error);
        else setProjects(data || []);
    };

    const fetchSkills = async () => {
        const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
        if (error) console.error('Error fetching skills:', error);
        else setSkills(data || []);
    };

    const fetchStats = async () => {
        try {
            // 1. Total Counts
            const { count: visitors } = await supabase.from('site_visits').select('*', { count: 'exact', head: true });
            const { count: views } = await supabase.from('project_views').select('*', { count: 'exact', head: true });

            // 2. Trend Data (Last 7 Days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { data: visitsData } = await supabase
                .from('site_visits')
                .select('visitor_id, created_at')
                .gte('created_at', sevenDaysAgo.toISOString());

            // Process Visits
            const uniqueSet = new Set();
            let todayCount = 0;
            const daysMap: Record<string, number> = {};
            const todayStr = new Date().toDateString();

            // Init last 7 days keys
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                daysMap[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
            }

            visitsData?.forEach(v => {
                uniqueSet.add(v.visitor_id);
                if (new Date(v.created_at).toDateString() === todayStr) todayCount++;

                const dayName = new Date(v.created_at).toLocaleDateString('en-US', { weekday: 'short' });
                if (daysMap[dayName] !== undefined) daysMap[dayName]++;
            });

            // Format Chart Data
            const maxVal = Math.max(...Object.values(daysMap), 1);
            const chartData = Object.entries(daysMap).reverse().map(([day, count]) => ({
                day,
                count,
                height: Math.round((count / maxVal) * 100)
            }));

            // 3. Top Projects
            const { data: projectStats } = await supabase
                .from('projects')
                .select('id, title, thumbnail_url, project_views(count)');

            const topProjects = projectStats?.map((p: any) => ({
                ...p,
                views: p.project_views?.[0]?.count || 0
            })).sort((a: any, b: any) => b.views - a.views).slice(0, 5) || [];

            setStats({
                visitors: visitors || 0,
                views: views || 0,
                uniqueVisitors: uniqueSet.size,
                todayVisits: todayCount,
                chartData,
                topProjects
            });
        } catch (e) {
            console.error('Error fetching stats:', e);
        }
    };

    const handleFileUpload = async (file: File): Promise<string> => {
        setUploadProgress(1);
        setUploadSpeed('Starting...');
        setUploadEta('...');

        try {
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

            // 1. Prepare Command
            const command = new PutObjectCommand({
                Bucket: R2_BUCKET,
                Key: fileName,
                ContentType: file.type,
            });

            // 2. Generate Pre-Signed URL
            const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
            const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 600 });

            // 3. Route through Local Proxy
            const urlObj = new URL(signedUrl);
            const proxyUrl = `/r2-proxy${urlObj.pathname}${urlObj.search}`;

            // 4. Perform Upload via XHR
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                uploadXhrRef.current = xhr;

                xhr.open('PUT', proxyUrl, true);
                xhr.setRequestHeader('Content-Type', file.type);

                const startTime = Date.now();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(percentComplete);

                        // Calculate Speed & ETA
                        const now = Date.now();
                        const elapsed = (now - startTime) / 1000; // seconds

                        if (elapsed > 0.5) {
                            const speed = event.loaded / elapsed; // bytes/sec
                            const remaining = event.total - event.loaded;
                            const eta = remaining / speed;

                            // Format Speed
                            let speedStr = '';
                            if (speed > 1024 * 1024) speedStr = `${(speed / (1024 * 1024)).toFixed(1)} MB/s`;
                            else speedStr = `${(speed / 1024).toFixed(1)} KB/s`;
                            setUploadSpeed(speedStr);

                            // Format ETA
                            if (eta < 60) setUploadEta(`${Math.ceil(eta)}s remaining`);
                            else setUploadEta(`${Math.ceil(eta / 60)}m remaining`);
                        }
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`Upload failed: ${xhr.statusText}`));
                    }
                };

                xhr.onabort = () => reject(new Error('Cancelled by user'));
                xhr.onerror = () => reject(new Error('Network upload failed'));
                xhr.send(file);
            });

            const url = `${R2_PUBLIC_URL}/${fileName}`;
            setUploadProgress(100);
            setTimeout(() => {
                setUploadProgress(0);
                setUploadSpeed('');
                setUploadEta('');
            }, 500);
            uploadXhrRef.current = null;
            return url;
        } catch (error: any) {
            console.error('Upload failed:', error);
            if (error.message !== 'Cancelled by user') {
                showFeedback('error', 'Upload failed: ' + error.message);
            }
            setUploadProgress(0);
            setUploadSpeed('');
            setUploadEta('');
            uploadXhrRef.current = null;
            return '';
        }
    };

    const generateVideoThumbnail = (file: File): Promise<File | null> => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.muted = true;
            video.playsInline = true;
            video.crossOrigin = "anonymous";
            video.autoplay = true; // helps force loading in some browsers

            video.onloadeddata = () => {
                video.currentTime = 1; // Seek to 1s
            };

            video.onseeked = () => {
                // Add a small delay to ensure the frame is actually rendered
                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const thumbFile = new File([blob], `thumb_${Date.now()}.jpg`, { type: 'image/jpeg' });
                            resolve(thumbFile);
                        } else {
                            resolve(null);
                        }
                        // Cleanup
                        video.pause();
                        video.removeAttribute('src');
                        video.load();
                        URL.revokeObjectURL(video.src);
                    }, 'image/jpeg', 0.85);
                }, 300); // 300ms delay to prevent black frame
            };

            video.onerror = () => {
                URL.revokeObjectURL(video.src);
                resolve(null);
            };
        });
    };

    const handleDrop = async (e: React.DragEvent, type: 'thumbnail' | 'video' | 'skill_icon') => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (file) {
            const url = await handleFileUpload(file);
            if (!url) return;

            if (type === 'thumbnail') {
                setEditingProject(prev => prev ? ({ ...prev, thumbnail_url: url }) : null);
            } else if (type === 'video') {
                setEditingProject(prev => prev ? ({ ...prev, video_url: url }) : null);

                // Auto-generate thumbnail for video
                generateVideoThumbnail(file).then(async (thumbFile) => {
                    if (thumbFile) {
                        const thumbUrl = await handleFileUpload(thumbFile);
                        if (thumbUrl) setEditingProject(prev => prev ? ({ ...prev, thumbnail_url: thumbUrl }) : null);
                    }
                });

            } else if (type === 'skill_icon') {
                setEditingSkill((prev: any) => prev ? ({ ...prev, icon_url: url }) : null);
            }
        }
    };

    // Helper for dragover to prevent browser open
    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

    const saveProject = async () => {
        if (!editingProject) return;

        try {
            const projectData = {
                title: editingProject.title,
                category: editingProject.category,
                thumbnail_url: editingProject.thumbnail_url,
                video_url: editingProject.video_url,
                description: editingProject.description,
                sort_order: editingProject.sort_order || projects.length
            };

            if (editingProject.id) {
                const { error } = await supabase.from('projects').update(projectData).eq('id', editingProject.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('projects').insert([projectData]);
                if (error) throw error;
            }

            setEditingProject(null);
            fetchProjects();
            showFeedback('success', 'Project saved successfully');
        } catch (error: any) {
            showFeedback('error', 'Error saving: ' + error.message);
        }
    };

    const confirmDelete = (id: number) => {
        setConfirmDialog({
            message: 'Are you sure you want to delete this project? This will permanently remove the project and its associated files.',
            onConfirm: async () => {
                try {
                    // 1. Get Project Details to find files
                    const projectToDelete = projects.find(p => p.id === id);
                    if (projectToDelete) {
                        // Helper to delete from R2
                        const deleteFromR2 = async (url: string) => {
                            if (url && url.includes(R2_PUBLIC_URL)) {
                                try {
                                    const key = url.replace(`${R2_PUBLIC_URL}/`, '');
                                    const command = new DeleteObjectCommand({
                                        Bucket: R2_BUCKET,
                                        Key: key,
                                    });
                                    await r2Client.send(command);
                                    console.log('Deleted R2 file:', key);
                                } catch (err) {
                                    console.error('Failed to delete R2 file:', err);
                                }
                            }
                        };

                        // Delete Video & Thumbnail
                        await deleteFromR2(projectToDelete.video_url);
                        await deleteFromR2(projectToDelete.thumbnail_url);
                    }

                    // 2. Delete from DB
                    const { error } = await supabase.from('projects').delete().eq('id', id);
                    if (error) throw error;

                    fetchProjects();
                    showFeedback('success', 'Project and files deleted');
                } catch (error: any) {
                    showFeedback('error', error.message);
                }
                setConfirmDialog(null);
            }
        });
    };

    const confirmImport = () => {
        setConfirmDialog({
            message: 'Import default projects from code? This maps your local constants to the database.',
            onConfirm: async () => {
                try {
                    const { PROJECTS } = await import('../../constants');
                    const formatted = PROJECTS.map((p: any) => ({
                        title: p.title,
                        description: p.description,
                        category: p.category,
                        thumbnail_url: p.thumbnail,
                        video_url: p.videoUrl,
                        sort_order: parseFloat(p.id)
                    }));

                    const { error } = await supabase.from('projects').insert(formatted);
                    if (error) throw error;

                    fetchProjects();
                    showFeedback('success', 'Projects imported successfully');
                } catch (err: any) {
                    showFeedback('error', err.message);
                }
                setConfirmDialog(null);
            }
        });
    };

    const confirmImportSkills = () => {
        setConfirmDialog({
            message: 'Import default skills from code?',
            onConfirm: async () => {
                try {
                    const { SKILLS } = await import('../../constants');
                    const formatted = SKILLS.map((s: any, i: number) => ({
                        name: s.name,
                        category: s.category,
                        proficiency: s.level,
                        sort_order: i
                    }));

                    const { error } = await supabase.from('skills').insert(formatted);
                    if (error) throw error;

                    fetchSkills();
                    showFeedback('success', 'Skills imported successfully');
                } catch (err: any) {
                    showFeedback('error', err.message);
                }
                setConfirmDialog(null);
            }
        });
    };

    // Helper to save Skills
    const saveSkill = async () => {
        if (!editingSkill) return;
        try {
            const skillData = {
                name: editingSkill.name,
                category: editingSkill.category,
                proficiency: editingSkill.proficiency,
                icon_url: editingSkill.icon_url,
                sort_order: editingSkill.sort_order || skills.length
            };

            if (editingSkill.id) {
                const { error } = await supabase.from('skills').update(skillData).eq('id', editingSkill.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('skills').insert([skillData]);
                if (error) throw error;
            }

            setEditingSkill(null);
            fetchSkills();
            showFeedback('success', 'Skill saved');
        } catch (e: any) {
            showFeedback('error', e.message);
        }
    };

    const confirmDeleteSkill = (id: number) => {
        setConfirmDialog({
            message: 'Delete this skill?',
            onConfirm: async () => {
                const { error } = await supabase.from('skills').delete().eq('id', id);
                if (error) showFeedback('error', error.message);
                else {
                    fetchSkills();
                    showFeedback('success', 'Skill deleted');
                }
                setConfirmDialog(null);
            }
        });
    };


    return (
        <div className="fixed inset-0 z-[100] bg-[#020617] text-white flex animate-fade-in overflow-hidden font-sans">
            {/* Sidebar */}
            <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/5 flex flex-col p-4 transition-transform duration-300 z-30 ${navVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex items-center justify-between mb-8">
                    <div className="w-32 h-8 flex items-center justify-center">
                        <img src="/benzsiangco.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <button onClick={() => setNavVisible(false)} className="lg:hidden"><X size={18} /></button>
                </div>

                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}>
                        <div className="w-5"><FileText size={18} /></div> Overview
                    </button>
                    <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}>
                        <div className="w-5"><Video size={18} /></div> Projects
                    </button>
                    <button onClick={() => setActiveTab('skills')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'skills' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}>
                        <div className="w-5"><GripVertical size={18} /></div> Skills
                    </button>
                </nav>
            </div>

            {/* Mobile Overlay for Sidebar */}
            {navVisible && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setNavVisible(false)}></div>}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-slate-900/30 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setNavVisible(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg"><GripVertical size={20} /></button>
                        <h2 className="font-bold text-lg capitalize">{activeTab}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors"><X size={20} /></button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">

                    {activeTab === 'overview' && (
                        <div className="max-w-6xl mx-auto space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex flex-col">
                                    <div className="flex items-center gap-3 mb-2 text-blue-400">
                                        <Users size={18} />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Total Users</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-white mt-auto">{stats.visitors}</p>
                                </div>
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex flex-col">
                                    <div className="flex items-center gap-3 mb-2 text-purple-400">
                                        <Activity size={18} />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Project Views</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-white mt-auto">{stats.views}</p>
                                </div>
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex flex-col">
                                    <div className="flex items-center gap-3 mb-2 text-green-400">
                                        <TrendingUp size={18} />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Unique (7d)</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-white mt-auto">{stats.uniqueVisitors}</p>
                                </div>
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex flex-col">
                                    <div className="flex items-center gap-3 mb-2 text-orange-400">
                                        <BarChart2 size={18} />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Today</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-white mt-auto">{stats.todayVisits}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Activity Chart */}
                                <div className="lg:col-span-2 bg-slate-800/40 p-6 rounded-3xl border border-white/5">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Activity size={20} className="text-blue-500" /> Traffic Trend (Last 7 Days)</h3>
                                    <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
                                        {stats.chartData.map((d, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="relative w-full bg-slate-700/30 rounded-t-lg overflow-hidden flex items-end transition-all hover:bg-slate-700/50" style={{ height: '100%' }}>
                                                    <div
                                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out group-hover:to-blue-300"
                                                        style={{ height: `${d.height}%`, minHeight: '4px' }}
                                                    ></div>
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-10">
                                                        {d.count} visits
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-500 font-bold uppercase">{d.day}</span>
                                            </div>
                                        ))}
                                        {stats.chartData.length === 0 && <div className="w-full text-center text-slate-500">No recent data</div>}
                                    </div>
                                </div>

                                {/* Top Projects */}
                                <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-yellow-500" /> Top Projects</h3>
                                    <div className="space-y-4">
                                        {stats.topProjects.map((p, i) => (
                                            <div key={p.id} className="flex items-center gap-3 group translate-y-0 hover:-translate-y-1 transition-transform duration-300">
                                                <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-white/5">
                                                    <img src={p.thumbnail_url} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-bold text-sm truncate">{p.title}</span>
                                                        <span className="text-xs font-mono text-blue-400">{p.views}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                            style={{ width: `${Math.min((p.views / (stats.topProjects[0]?.views || 1)) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {stats.topProjects.length === 0 && <p className="text-slate-500 text-center py-4">No project data yet.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="max-w-5xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Portfolio Items</h3>
                                <Button variant="primary" onClick={() => setEditingProject({ title: '', category: 'Short Form', thumbnail_url: '', video_url: '', description: '', sort_order: 0 })} icon={<Plus size={16} />}>Add New</Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map(project => (
                                    <div key={project.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                                        <div className="w-20 h-14 md:w-24 md:h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={project.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white truncate text-sm md:text-base">{project.title}</h4>
                                            <p className="text-xs text-slate-400">{project.category}</p>
                                        </div>
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <button onClick={() => setEditingProject(project)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"><FileText size={18} /></button>
                                            <button onClick={() => project.id && confirmDelete(project.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && (
                                    <div className="text-center py-10">
                                        <Button variant="outline" onClick={confirmImport}>Import Defaults</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="max-w-5xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Skills</h3>
                                <Button variant="primary" onClick={() => setEditingSkill({ name: '', category: 'Software', proficiency: 50 })} icon={<Plus size={16} />}>Add Skill</Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {skills.map(skill => (
                                    <div key={skill.id} className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:border-blue-500/30 transition-all">
                                        {skill.icon_url ? (
                                            <div className="w-10 h-10 bg-slate-900 rounded-lg p-2 flex-shrink-0">
                                                <img src={skill.icon_url} className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-500 font-bold">
                                                {skill.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white truncate">{skill.name}</h4>
                                            <p className="text-xs text-slate-400">{skill.category} • {skill.proficiency}%</p>
                                        </div>
                                        <button onClick={() => setEditingSkill(skill)} className="p-2 text-slate-400 hover:text-white"><FileText size={16} /></button>
                                        <button onClick={() => skill.id && confirmDeleteSkill(skill.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                {skills.length === 0 && (
                                    <div className="col-span-full text-center py-10">
                                        <p className="text-slate-500 mb-4">No skills found.</p>
                                        <Button variant="outline" onClick={confirmImportSkills}>Import Default Skills</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Project Modal */}
            {editingProject && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingProject.id ? 'Edit' : 'New'} Project</h3>
                            <button onClick={() => setEditingProject(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-6 relative">

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thumbnail</label>
                                    <div className="aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden group"
                                        onClick={() => document.getElementById('thumb-upload')?.click()}
                                        onDrop={(e) => handleDrop(e, 'thumbnail')}
                                        onDragOver={onDragOver}>
                                        {editingProject.thumbnail_url ? <img src={editingProject.thumbnail_url} className="w-full h-full object-cover" /> : <div className="text-center p-4">
                                            <Image className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                            <span className="text-xs text-slate-500">Click or Drag to upload</span>
                                        </div>}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Upload className="text-white" />
                                        </div>
                                    </div>
                                    <input
                                        id="thumb-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            if (e.target.files?.[0]) {
                                                const url = await handleFileUpload(e.target.files[0]);
                                                if (url) setEditingProject({ ...editingProject, thumbnail_url: url });
                                            }
                                        }}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Title</label>
                                        <input type="text" placeholder="Project Title" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:border-blue-500 outline-none" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
                                        <select className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:border-blue-500 outline-none" value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}>
                                            <option>Short Form</option><option>Long Form</option><option>Commercial</option><option>Motion Graphics</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Video Source</label>
                                        <input type="text" placeholder="YouTube URL or R2 URL" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:border-blue-500 outline-none" value={editingProject.video_url} onChange={e => setEditingProject({ ...editingProject, video_url: e.target.value })} />
                                        <div className="border-2 border-dashed border-white/10 p-4 rounded-xl text-center cursor-pointer bg-black/20 mt-3" onClick={() => document.getElementById('video-upload')?.click()} onDrop={(e) => handleDrop(e, 'video')} onDragOver={onDragOver}>
                                            <Upload size={20} className="text-slate-400 mx-auto mb-2" />
                                            <span className="text-xs text-slate-500 font-bold uppercase">Drag Video Here or Click</span>
                                        </div>
                                        <input
                                            id="video-upload"
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                if (e.target.files?.[0]) {
                                                    const file = e.target.files[0];
                                                    const url = await handleFileUpload(file);
                                                    if (url) {
                                                        setEditingProject(prev => prev ? ({ ...prev, video_url: url }) : null);

                                                        // Auto-generate thumbnail
                                                        const thumbFile = await generateVideoThumbnail(file);
                                                        if (thumbFile) {
                                                            const thumbUrl = await handleFileUpload(thumbFile);
                                                            if (thumbUrl) setEditingProject(prev => prev ? ({ ...prev, thumbnail_url: thumbUrl }) : null);
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
                                <textarea placeholder="Description" rows={3} className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:border-blue-500 outline-none resize-none" value={editingProject.description} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                                <Button variant="primary" onClick={saveProject} icon={<Save size={16} />}>Save Project</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Editing Skill Modal */}
            {editingSkill && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="w-full max-w-sm bg-[#0f172a] border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">{editingSkill.id ? 'Edit' : 'Add'} Skill</h3>

                        <div className="flex justify-center mb-6">
                            <div
                                className="w-24 h-24 bg-slate-900 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors relative group overflow-hidden"
                                onClick={() => document.getElementById('skill-icon-upload')?.click()}
                                onDrop={(e) => handleDrop(e, 'skill_icon')}
                                onDragOver={onDragOver}
                            >
                                {editingSkill.icon_url ? (
                                    <img src={editingSkill.icon_url} className="w-full h-full object-cover p-2" />
                                ) : (
                                    <div className="text-center">
                                        <Image size={24} className="mx-auto text-slate-500 mb-1" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">Icon</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Upload size={20} className="text-white" />
                                </div>
                            </div>
                            <input
                                id="skill-icon-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        const url = await handleFileUpload(e.target.files[0]);
                                        if (url) setEditingSkill({ ...editingSkill, icon_url: url });
                                    }
                                }}
                            />
                        </div>

                        {/* Recent Icons Selector */}
                        {skills.some(s => s.icon_url) && (
                            <div className="mb-6">
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-wider">Recently Used Icons</label>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(new Set(skills.map(s => s.icon_url).filter(Boolean))).map((url: any, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setEditingSkill({ ...editingSkill, icon_url: url })}
                                            className={`w-10 h-10 rounded-xl p-2 border ${editingSkill.icon_url === url ? 'border-blue-500 bg-blue-500/20' : 'border-white/10 bg-slate-900 hover:border-white/30'} transition-all`}
                                            title="Use this icon"
                                        >
                                            <img src={url} className="w-full h-full object-contain" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Name</label>
                                <input type="text" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:border-blue-500 outline-none" value={editingSkill.name} onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })} autoFocus />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Category</label>
                                <select className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white focus:border-blue-500 outline-none" value={editingSkill.category} onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value })}>
                                    <option>Software</option><option>Language</option><option>Creative</option><option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Proficiency ({editingSkill.proficiency}%)</label>
                                <input type="range" min="0" max="100" className="w-full accent-blue-600" value={editingSkill.proficiency} onChange={e => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <Button variant="outline" onClick={() => setEditingSkill(null)}>Cancel</Button>
                                <Button variant="primary" onClick={saveSkill} icon={<Save size={16} />}>Save Skill</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="w-full max-w-sm p-6 bg-slate-900 border border-white/10 rounded-3xl relative text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Confirmation Needed</h3>
                        <p className="text-slate-400 mb-6">{confirmDialog.message}</p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cancel</Button>
                            <Button variant="primary" onClick={confirmDialog.onConfirm}>Confirm</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Upload Overlay */}
            {uploadProgress > 0 && (
                <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center text-white flex-col animate-in fade-in duration-300">
                    <div className="w-64 space-y-4 text-center">
                        <div className="relative w-24 h-24 mx-auto">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={`${uploadProgress}, 100`} className="transition-all duration-300 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">{uploadProgress}%</div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-1">Uploading...</h4>
                            <div className="text-xs text-slate-400 flex items-center justify-center gap-2 font-mono">
                                <span>{uploadSpeed}</span>
                                <span>•</span>
                                <span>{uploadEta}</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={() => uploadXhrRef.current?.abort()}>
                            Cancel Upload
                        </Button>
                    </div>
                </div>
            )}

            {/* Feedback Notifications */}
            {feedback && (
                <div className="fixed bottom-6 right-6 z-[200] animate-bounce-in">
                    <div className={`px-6 py-4 rounded-2xl border ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} backdrop-blur-xl shadow-2xl flex items-center gap-3`}>
                        <div className={`w-2 h-2 rounded-full ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-bold">{feedback.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
