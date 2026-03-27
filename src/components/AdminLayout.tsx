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
  Inbox,
  Search,
  Image as ImageIcon,
  BookOpen,
  Database,
  QrCode
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import OnboardingTour from './OnboardingTour';
import ReportBugModal from './ReportBugModal';
import { Bug } from 'lucide-react';

export default function AdminLayout() {
  const { data, addActivityLog } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const now = new Date();
  const jadwal = data.jadwalPendaftaran;
  let isClosingSoon = false;
  let closingMessage = '';

  if (jadwal?.tutupPendaftaran) {
    const tutup = new Date(jadwal.tutupPendaftaran);
    const diffHours = (tutup.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours > 0 && diffHours <= 24) {
      isClosingSoon = true;
      closingMessage = `Pendaftaran akan ditutup dalam ${Math.floor(diffHours)} jam.`;
    }
  }

  // Calculate notifications
  const notifications = [
    ...(isClosingSoon ? [{
      id: 'pend-closing-soon',
      title: 'Pendaftaran Segera Ditutup',
      message: closingMessage,
      type: 'pendaftaran',
      path: '/admin/pendaftaran',
      icon: AlertTriangle,
      color: 'text-amber-500'
    }] : []),
    ...(data.pendaftaran || []).filter(p => p.status === 'Menunggu Berkas').map(p => ({
      id: `pend-${p.id}`,
      title: 'Pendaftaran Baru',
      message: `${p.namaLengkap} mendaftar`,
      type: 'pendaftaran',
      path: '/admin/pendaftaran',
      icon: UserPlus,
      color: 'text-emerald-500'
    })),
    ...(data.aspirasi || []).filter(a => a.status === 'Menunggu').map(a => ({
      id: `asp-${a.id}`,
      title: 'Aspirasi Baru',
      message: a.subjek,
      type: 'aspiration',
      path: '/admin/aspirasi',
      icon: MessageSquare,
      color: 'text-amber-500'
    })),
    ...(data.proker || []).filter(p => p.status === 'Overdue').map(p => ({
      id: `pro-${p.id}`,
      title: 'Proker Overdue',
      message: p.namaProker,
      type: 'proker',
      path: '/admin/proker',
      icon: AlertTriangle,
      color: 'text-red-500'
    })),
    ...(data.users || []).filter(u => u.status === 'pending').map(u => ({
      id: `user-${u.id}`,
      title: 'Persetujuan User',
      message: `${u.nama} menunggu persetujuan`,
      type: 'user',
      path: '/admin/users',
      icon: UserPlus,
      color: 'text-blue-500'
    })),
    ...(data.surat || []).filter(s => s.jenis === 'Masuk' && s.status === 'Diproses').map(s => ({
      id: `surat-${s.id}`,
      title: 'Surat Masuk Baru',
      message: s.perihal,
      type: 'surat',
      path: '/admin/surat',
      icon: Inbox,
      color: 'text-indigo-500'
    })),
    ...(data.kasWajib || []).filter(k => k.status === 'belum').length > 0 ? [{
      id: 'kas-wajib-overdue',
      title: 'Kas Wajib Belum Lunas',
      message: `${(data.kasWajib || []).filter(k => k.status === 'belum').length} tagihan kas wajib belum dibayar`,
      type: 'kasWajib',
      path: '/admin/keuangan',
      icon: Wallet,
      color: 'text-rose-500'
    }] : []
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

  const navGroups = [
    {
      label: 'UTAMA',
      items: [
        { name: 'Dasbor', path: '/admin/dashboard', icon: LayoutDashboard, depts: ['all'] },
        { name: 'Presensi QR', path: '/admin/presensi-qr', icon: QrCode, depts: ['all'] },
        { name: 'Data Anggota', path: '/admin/anggota', icon: Users, depts: ['sekretaris'] },
        { name: 'Keuangan', path: '/admin/keuangan', icon: Wallet, depts: ['bendahara'] },
        { name: 'Tracking Proker', path: '/admin/proker', icon: Target, depts: ['all'] },
      ]
    },
    {
      label: 'KONTEN & KOMUNIKASI',
      items: [
        { name: 'Berita & Blog', path: '/admin/news', icon: Newspaper, depts: ['medkom'] },
        { name: 'Kotak Aspirasi', path: '/admin/aspirasi', icon: MessageSquare, depts: ['all'] },
        { name: 'Forum Internal', path: '/admin/forum', icon: MessageSquare, depts: ['all'] },
      ]
    },
    {
      label: 'ADMINISTRASI',
      items: [
        { name: 'E-Arsip Surat', path: '/admin/surat', icon: Mail, depts: ['sekretaris'] },
        { name: 'Laporan Otomatis', path: '/admin/reports', icon: FileText, depts: ['sekretaris', 'bendahara'] },
        { name: 'Inventaris & Aset', path: '/admin/inventaris', icon: Box, depts: ['all'] },
        { name: 'Database Alumni', path: '/admin/alumni', icon: GraduationCap, depts: ['sekretaris'] },
        { name: 'Pendaftaran', path: '/admin/pendaftaran', icon: UserPlus, depts: ['sekretaris'] },
      ]
    },
    {
      label: 'LAINNYA',
      items: [
        { name: 'Sistem E-Voting', path: '/admin/voting', icon: Vote, depts: ['sekretaris', 'litbang'] },
        { name: 'Dokumen', path: '/admin/dokumen', icon: FileText, depts: ['all'] },
        { name: 'Drive', path: '/admin/drive', icon: HardDrive, depts: ['all'] },
      ]
    },
    {
      label: 'SISTEM',
      items: [
        { name: 'Panduan', path: '/admin/panduan', icon: BookOpen, depts: ['all'] },
        { name: 'Backup & Restore', path: '/admin/backup', icon: Database, depts: [] },
        { name: 'Pengaturan', path: '/admin/settings', icon: SettingsIcon, depts: [] },
        { name: 'Manajemen Pengguna', path: '/admin/users', icon: Shield, depts: [] },
      ]
    }
  ];

  const hasFullAccess = 
    currentUser.department === 'ketua-wakil' || 
    currentUser.role === 'admin' || 
    currentUser.role === 'superadmin';

  // Helper to filter items based on access
  const filterItems = (items: any[]) => items.filter(item => 
    item.depts.includes('all') || 
    hasFullAccess || 
    (currentUser.department && item.depts.includes(currentUser.department))
  );

  // Global Search Logic
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: { id: string; title: string; subtitle: string; type: string; path: string; icon: any }[] = [];

    // Search Anggota
    (data.anggota || []).forEach(a => {
      if (a.nama.toLowerCase().includes(query) || a.nim.toLowerCase().includes(query)) {
        results.push({
          id: `anggota-${a.id}`,
          title: a.nama,
          subtitle: `Anggota - ${a.nim}`,
          type: 'anggota',
          path: '/admin/anggota',
          icon: Users
        });
      }
    });

    // Search Proker
    (data.proker || []).forEach(p => {
      if (p.namaProker.toLowerCase().includes(query)) {
        results.push({
          id: `proker-${p.id}`,
          title: p.namaProker,
          subtitle: `Proker - ${p.departemen}`,
          type: 'proker',
          path: '/admin/proker',
          icon: Target
        });
      }
    });

    // Search Surat
    (data.surat || []).forEach(s => {
      if (s.perihal.toLowerCase().includes(query) || s.nomorSurat.toLowerCase().includes(query)) {
        results.push({
          id: `surat-${s.id}`,
          title: s.perihal,
          subtitle: `Surat ${s.jenis} - ${s.nomorSurat}`,
          type: 'surat',
          path: '/admin/surat',
          icon: Mail
        });
      }
    });

    // Search Event
    (data.events || []).forEach(e => {
      if (e.title.toLowerCase().includes(query)) {
        results.push({
          id: `event-${e.id}`,
          title: e.title,
          subtitle: `Event - ${e.date}`,
          type: 'event',
          path: `/admin/presensi-qr?event=${encodeURIComponent(e.title)}`,
          icon: Calendar
        });
      }
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [searchQuery, data]);

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-liquid flex items-center justify-center font-sans">
      <OnboardingTour />
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main App Container */}
      <div className="w-full h-screen bg-white flex overflow-hidden relative">
        
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

          <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar pb-6">
            {navGroups.map((group, groupIdx) => {
              const filteredItems = filterItems(group.items);
              if (filteredItems.length === 0) return null;

              return (
                <div key={groupIdx} className="space-y-1.5">
                  <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    {group.label}
                  </h3>
                  {filteredItems.map((item) => {
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
                            ? 'bg-himars-peach text-white shadow-md shadow-himars-peach/20' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`mr-3.5 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="tracking-wide">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Bottom Sidebar Elements */}
          <div className="p-4 border-t border-slate-100 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-600">Online</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">v1.0.0</span>
            </div>
            <Link 
              to="/" 
              className="flex items-center justify-center text-xs font-bold text-slate-500 hover:text-himars-dark transition-colors uppercase tracking-widest bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"
            >
              Lihat Website <ArrowUpRight className="w-3 h-3 ml-1.5" />
            </Link>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
          {/* Top header */}
          <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-6 shrink-0 sticky top-0 z-30 justify-between">
            <div className="flex items-center">
              <button
                className="text-slate-400 hover:text-slate-600 focus:outline-none bg-slate-50 p-2 rounded-xl border border-slate-100"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-xl mx-4 relative search-container">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari anggota, proker, surat..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-himars-peach/20 focus:border-himars-peach/50 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hasil Pencarian</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.map((result) => (
                            <Link
                              key={result.id}
                              to={result.path}
                              onClick={() => {
                                setShowSearchResults(false);
                                setSearchQuery('');
                              }}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                <result.icon className="w-4 h-4 text-slate-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">{result.title}</p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider truncate mt-0.5">{result.subtitle}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                          <p className="text-sm font-bold text-slate-400">Tidak ada hasil ditemukan</p>
                          <p className="text-xs text-slate-400 mt-1">Coba kata kunci lain</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-3">
              {/* Settings Icon */}
              <Link
                to="/admin/settings"
                className="hidden md:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-himars-dark hover:bg-slate-100 transition-all"
                title="Pengaturan Web"
              >
                <SettingsIcon className="w-5 h-5" />
              </Link>
              
              <button
                onClick={() => setShowBugModal(true)}
                className="hidden md:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                title="Lapor Bug"
              >
                <Bug className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all border border-slate-100 relative"
                >
                  <Bell className="h-5 w-5 pointer-events-none" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white pointer-events-none">
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

              {/* User Account Info */}
              <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-himars-peach/20 text-himars-peach flex items-center justify-center font-black text-xs">
                  {currentUser.nama ? currentUser.nama.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-900 leading-none">{currentUser.nama || 'Admin'}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{currentUser.department || 'Administrator'}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
            <div className="w-full mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <ReportBugModal isOpen={showBugModal} onClose={() => setShowBugModal(false)} />
    </div>
  );
}
