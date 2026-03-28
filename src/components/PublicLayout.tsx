import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useData } from '../store/DataContext';

export default function PublicLayout() {
  const { data } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStrukturOpen, setIsStrukturOpen] = useState(false);
  const [isFiturOpen, setIsFiturOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Profil Prodi', path: '/profil' },
    { name: 'Struktur', path: '/struktur' },
    { name: 'Berita', path: '/blog' },
    { name: 'Dokumen', path: '/dokumen' },
    { name: 'Fitur', path: '#' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-liquid text-slate-900 font-sans">
      {/* Navbar */}
      <header className="glass-ios sticky top-0 z-50 border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-4 group">
                <div className="w-12 h-12 glass-ios rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden transition-transform group-hover:scale-110">
                  <img 
                    src={data.settings.logoUrl || undefined} 
                    alt={`${data.settings.siteName} Logo`} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl sm:text-2xl text-himars-dark leading-none tracking-tighter group-hover:text-himars-peach transition-colors uppercase">{data.settings.siteName}</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">UMLA</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                if (link.name === 'Struktur') {
                  return (
                    <div key={link.name} className="relative">
                      <button
                        onClick={() => setIsStrukturOpen(!isStrukturOpen)}
                        className={`text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1 ${
                          location.pathname.startsWith(link.path)
                            ? 'text-himars-peach'
                            : 'text-slate-500 hover:text-himars-peach'
                        }`}
                      >
                        {link.name}
                        <svg className={`w-4 h-4 transition-transform ${isStrukturOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {isStrukturOpen && (
                        <div className="absolute left-0 mt-2 w-56 z-50 pt-2">
                          <div className="glass-ios rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden py-2">
                            {[
                              { id: 'ketua-wakil', title: 'Ketua & Wakil' },
                              { id: 'sekretaris', title: 'Sekretaris' },
                              { id: 'bendahara', title: 'Bendahara' },
                              { id: 'penak', title: 'PENAK' },
                              { id: 'litbang', title: 'Litbang' },
                              { id: 'pengmas', title: 'PENGAPMAS' },
                              { id: 'medkom', title: 'Medkom' },
                            ].map(dept => (
                              <Link
                                key={dept.id}
                                to={`/struktur/${dept.id}`}
                                onClick={() => setIsStrukturOpen(false)}
                                className="block px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-himars-peach hover:bg-slate-50 transition-colors"
                              >
                                {dept.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                if (link.name === 'Fitur') {
                  return (
                    <div key={link.name} className="relative">
                      <button
                        onClick={() => setIsFiturOpen(!isFiturOpen)}
                        className={`text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1 ${
                          ['/presensi', '/aspirasi', '/voting', '/calendar', '/pendaftaran'].includes(location.pathname)
                            ? 'text-himars-peach'
                            : 'text-slate-500 hover:text-himars-peach'
                        }`}
                      >
                        {link.name}
                        <svg className={`w-4 h-4 transition-transform ${isFiturOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {isFiturOpen && (
                        <div className="absolute left-0 mt-2 w-56 z-50 pt-2">
                          <div className="glass-ios rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden py-2">
                            {[
                              { id: 'presensi', title: 'Presensi QR', path: '/presensi' },
                              { id: 'aspirasi', title: 'Kotak Aspirasi', path: '/aspirasi' },
                              { id: 'voting', title: 'E-Voting', path: '/voting' },
                              { id: 'calendar', title: 'Kalender', path: '/calendar' },
                              { id: 'pendaftaran', title: 'Pendaftaran', path: '/pendaftaran' },
                            ].map(item => (
                              <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => setIsFiturOpen(false)}
                                className="block px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-himars-peach hover:bg-slate-50 transition-colors"
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs font-black uppercase tracking-widest transition-all ${
                      location.pathname === link.path
                        ? 'text-himars-peach'
                        : 'text-slate-500 hover:text-himars-peach'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {isLoggedIn ? (
                <Link
                  to={currentUser.role === 'admin' || currentUser.role === 'superadmin' ? '/admin/dashboard' : '/anggota/profil'}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-himars-peach bg-himars-peach/10 hover:bg-himars-peach/20 transition-all active:scale-95 border border-himars-peach/20"
                >
                  {currentUser.role === 'admin' || currentUser.role === 'superadmin' ? 'Dashboard' : 'Profil'}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-himars-peach bg-himars-peach/10 hover:bg-himars-peach/20 transition-all active:scale-95 border border-himars-peach/20"
                >
                  Masuk
                </Link>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              >
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden glass-ios border-t border-white/40 max-h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
            <div className="pt-2 pb-6 space-y-1 px-4">
              {navLinks.map((link) => {
                if (link.name === 'Struktur') {
                  return (
                    <div key={link.name} className="space-y-1">
                      <Link
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          location.pathname === link.path
                            ? 'bg-orange-50 text-orange-600'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-orange-600'
                        }`}
                      >
                        {link.name}
                      </Link>
                      <div className="pl-6 space-y-1">
                        {[
                          { id: 'ketua-wakil', title: 'Ketua & Wakil' },
                          { id: 'sekretaris', title: 'Sekretaris' },
                          { id: 'bendahara', title: 'Bendahara' },
                          { id: 'penak', title: 'PENAK' },
                          { id: 'litbang', title: 'Litbang' },
                          { id: 'pengmas', title: 'PENGAPMAS' },
                          { id: 'medkom', title: 'Medkom' },
                        ].map(dept => (
                          <Link
                            key={dept.id}
                            to={`/struktur/${dept.id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-orange-600"
                          >
                            {dept.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (link.name === 'Fitur') {
                  return (
                    <div key={link.name} className="space-y-1">
                      <div
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          ['/presensi', '/aspirasi', '/voting', '/calendar', '/pendaftaran'].includes(location.pathname)
                            ? 'bg-orange-50 text-orange-600'
                            : 'text-slate-700'
                        }`}
                      >
                        {link.name}
                      </div>
                      <div className="pl-6 space-y-1">
                        {[
                          { id: 'presensi', title: 'Presensi QR', path: '/presensi' },
                          { id: 'aspirasi', title: 'Kotak Aspirasi', path: '/aspirasi' },
                          { id: 'voting', title: 'E-Voting', path: '/voting' },
                          { id: 'calendar', title: 'Kalender', path: '/calendar' },
                          { id: 'pendaftaran', title: 'Pendaftaran', path: '/pendaftaran' },
                        ].map(item => (
                          <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-orange-600"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === link.path
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-orange-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {isLoggedIn ? (
                <Link
                  to={currentUser.role === 'admin' || currentUser.role === 'superadmin' ? '/admin/dashboard' : '/anggota/profil'}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 hover:bg-orange-50"
                >
                  {currentUser.role === 'admin' || currentUser.role === 'superadmin' ? 'Dashboard' : 'Profil'}
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 hover:bg-orange-50"
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="glass-ios pt-24 pb-12 border-t border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={data.settings.logoUrl || "https://picsum.photos/seed/logo/200/200"} alt="Logo" className="w-10 h-10 object-contain" />
                <h3 className="text-xl font-black text-himars-peach uppercase tracking-tighter">HIMARS UMLA</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Himpunan Mahasiswa Program Studi S1 Administrasi Rumah Sakit Universitas Muhammadiyah Lamongan. Mewujudkan administrator kesehatan yang profesional, inovatif, dan Islami.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-black text-himars-dark uppercase tracking-widest mb-6">Tautan Cepat</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Profil Prodi', path: '/profil' },
                  { name: 'Struktur Organisasi', path: '/struktur' },
                  { name: 'Berita & Blog', path: '/blog' },
                  { name: 'Dokumen', path: '/dokumen' },
                  { name: 'Presensi QR', path: '/presensi' },
                  { name: 'Kotak Aspirasi', path: '/aspirasi' },
                  { name: 'E-Voting', path: '/voting' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-slate-500 hover:text-himars-peach transition-colors text-sm font-bold">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-black text-himars-dark uppercase tracking-widest mb-6">Kontak</h3>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li>Jl. Raya Plalangan Plosowahyu Km 2, Lamongan</li>
                <li>Email: himars@umla.ac.id</li>
                <li>
                  <a href="https://www.instagram.com/himars_umla" className="text-himars-peach hover:underline">@himars_umla</a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@himarsumla3924" className="text-himars-peach italic hover:underline">HIMARS Official YouTube</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} {data.settings.siteName}. Hak Cipta Dilindungi.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-himars-peach transition-colors">Kebijakan Privasi</Link>
              <Link to="/terms" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-himars-peach transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
