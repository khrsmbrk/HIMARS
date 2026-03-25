import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../store/DataContext';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Wallet, 
  FileText, 
  Newspaper, 
  LogOut,
  Menu,
  X,
  Settings as SettingsIcon,
  Shield,
  FolderOpen,
  HardDrive,
  Calendar,
  Box,
  Mail,
  Target,
  MessageSquare,
  GraduationCap,
  Vote,
  ArrowUpRight,
  Bell,
  AlertTriangle,
  UserPlus,
  Inbox
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function AdminLayout() {
  const { data, addActivityLog } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Calculate notifications
  const notifications = [
    ...data.aspirasi.filter(a => a.status === 'Menunggu').map(a => ({
      id: `asp-${a.id}`,
      title: 'Aspirasi Baru',
      message: a.subjek,
      type: 'aspiration',
      path: '/admin/aspirasi',
      icon: MessageSquare,
      color: 'text-amber-500'
    })),
    ...data.proker.filter(p => p.status === 'Overdue').map(p => ({
      id: `pro-${p.id}`,
      title: 'Proker Overdue',
      message: p.namaProker,
      type: 'proker',
      path: '/admin/proker',
      icon: AlertTriangle,
      color: 'text-red-500'
    })),
    ...data.users.filter(u => u.status === 'pending').map(u => ({
      id: `user-${u.id}`,
      title: 'Persetujuan User',
      message: `${u.nama} menunggu persetujuan`,
      type: 'user',
      path: '/admin/users',
      icon: UserPlus,
      color: 'text-blue-500'
    })),
    ...data.surat.filter(s => s.jenis === 'Masuk' && s.status === 'Diproses').map(s => ({
      id: `surat-${s.id}`,
      title: 'Surat Masuk Baru',
      message: s.perihal,
      type: 'surat',
      path: '/admin/surat',
      icon: Inbox,
      color: 'text-indigo-500'
    }))
  ];

  const unreadCount = notifications.length;

  // Initialize sidebar state based on screen size after mount to avoid hydration mismatch
  React.useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  const handleLogout = () => {
    // Record activity log
    if (currentUser && currentUser.id) {
      addActivityLog({
        userId: currentUser.id,
        username: currentUser.username,
        nama: currentUser.nama,
        action: 'Logout',
        details: `Admin ${currentUser.nama} telah keluar dari dashboard.`
      });
    }

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const allNavItems = [
    { name: 'Dasbor', path: '/admin/dashboard', icon: LayoutDashboard, depts: ['all'] },
    { name: 'Manajemen Pengguna', path: '/admin/users', icon: Shield, depts: [] },
    { name: 'Manajemen Acara', path: '/admin/events', icon: Calendar, depts: ['all'] },
    { name: 'Presensi QR', path: '/admin/kehadiran', icon: CheckSquare, depts: ['sekretaris'] },
    { name: 'Keuangan', path: '/admin/keuangan', icon: Wallet, depts: ['bendahara'] },
    { name: 'Inventaris & Aset', path: '/admin/inventaris', icon: Box, depts: ['all'] },
    { name: 'E-Arsip Surat', path: '/admin/surat', icon: Mail, depts: ['sekretaris'] },
    { name: 'Drive', path: '/admin/drive', icon: HardDrive, depts: ['all'] },
    { name: 'Laporan Otomatis', path: '/admin/reports', icon: FileText, depts: ['sekretaris', 'bendahara'] },
    { name: 'Forum Internal', path: '/admin/forum', icon: MessageSquare, depts: ['all'] },
    { name: 'Kotak Aspirasi', path: '/admin/aspirasi', icon: MessageSquare, depts: ['all'] },
    { name: 'Sistem E-Voting', path: '/admin/voting', icon: Vote, depts: ['sekretaris', 'litbang'] },
    { name: 'Pengaturan', path: '/admin/settings', icon: SettingsIcon, depts: [] },
    { name: 'Berita & Blog', path: '/admin/news', icon: Newspaper, depts: ['medkom'] },
    { name: 'Data Anggota', path: '/admin/anggota', icon: Users, depts: ['sekretaris'] },
    { name: 'Tracking Proker', path: '/admin/proker', icon: Target, depts: ['all'] },
    { name: 'Database Alumni', path: '/admin/alumni', icon: GraduationCap, depts: ['sekretaris'] },
    { name: 'Dokumen', path: '/admin/dokumen', icon: FileText, depts: ['all'] },
  ];

  const hasFullAccess = 
    currentUser.department === 'ketua-wakil' || 
    currentUser.role === 'admin' || 
    currentUser.role === 'superadmin';

  const navItems = allNavItems.filter(item => 
    item.depts.includes('all') || 
    hasFullAccess || 
    (currentUser.department && item.depts.includes(currentUser.department))
  );

  return (
    <div className="min-h-screen bg-liquid p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main App Container */}
      <div className="w-full max-w-[1600px] h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex overflow-hidden relative">
        
        {/* Sidebar */}
        <aside 
          className={`absolute lg:relative inset-y-0 left-0 z-50 w-56 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out flex flex-col ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-14 flex items-center px-6 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden">
                <img 
                  src={data.settings.logoUrl || undefined} 
                  alt={`${data.settings.siteName} Logo`} 
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-slate-900 leading-none tracking-tight">{data.settings.siteName}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Workspace</span>
              </div>
            </div>
            <button 
              className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pb-2">
            {/* Menu label removed as requested */}
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-himars-dark text-white shadow-md shadow-slate-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`mr-3.5 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
          {/* Top header */}
          <header className="h-12 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-8 shrink-0 sticky top-0 z-30">
            <button
              className="text-slate-400 hover:text-slate-600 focus:outline-none lg:hidden mr-4 bg-slate-50 p-2 rounded-xl border border-slate-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            
            <div className="hidden sm:block">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">
                {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>

            <div className="ml-auto flex items-center space-x-4">
              {/* User Account Info */}
              <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-himars-peach/20 text-himars-peach flex items-center justify-center font-black text-xs">
                  {currentUser.nama ? currentUser.nama.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-900 leading-none">{currentUser.nama || 'Admin'}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{currentUser.department || 'Administrator'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all border border-slate-100 relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden"
                      >
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Notifikasi Internal</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {unreadCount} Perlu Tindakan
                          </p>
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                              <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tidak ada notifikasi</p>
                            </div>
                          ) : (
                            notifications.map((notif) => {
                              const Icon = notif.icon;
                              return (
                                <Link
                                  key={notif.id}
                                  to={notif.path}
                                  onClick={() => setShowNotifications(false)}
                                  className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                >
                                  <div className={`p-2 rounded-xl bg-slate-50 ${notif.color}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{notif.title}</p>
                                    <p className="text-[10px] font-bold text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                                  </div>
                                </Link>
                              );
                            })
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <button 
                              className="text-[10px] font-black text-himars-peach uppercase tracking-widest hover:text-himars-peach/80 transition-colors"
                              onClick={() => setShowNotifications(false)}
                            >
                              Tutup Panel
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                to="/" 
                className="hidden sm:flex items-center text-xs font-bold text-slate-500 hover:text-himars-dark transition-colors uppercase tracking-widest bg-slate-50 px-4 py-2.5 rounded-full border border-slate-100"
              >
                Lihat Website <ArrowUpRight className="w-3 h-3 ml-1.5" />
              </Link>
              
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
