import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, ArrowLeft } from 'lucide-react';
import { useData } from '../../store/DataContext';

export default function Login() {
  const { data, addActivityLog } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check users
    const user = data.users.find(u => u.username === username && u.password === password);

    if (user) {
      if (user.role === 'member') {
        setError('Akun Anda belum disetujui. Silakan hubungi pengurus.');
        return;
      }
      
      // Record activity log
      addActivityLog({
        userId: user.id,
        username: user.username,
        nama: user.nama,
        action: 'Login',
        details: `${user.role === 'admin' ? 'Admin' : 'Anggota'} ${user.nama} berhasil masuk.`
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'anggota') {
        navigate('/anggota/profil');
      }
      return;
    }

    // Fallback for older members who might not have a user account yet
    // Check regular members (anggota) using NIM as username and password
    const anggota = data.anggota.find(a => a.nim === username && a.nim === password);
    if (anggota) {
      const memberUser = {
        id: anggota.id,
        username: anggota.nim,
        password: anggota.nim,
        nama: anggota.nama,
        role: 'anggota',
        department: anggota.departemen || 'Anggota',
      };

      addActivityLog({
        userId: anggota.id,
        username: anggota.nim,
        nama: anggota.nama,
        action: 'Login',
        details: `Anggota ${anggota.nama} berhasil masuk.`
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(memberUser));
      navigate('/anggota/profil');
      return;
    }

    setError('Username atau password salah!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-emerald-500 overflow-hidden p-2">
            <img 
              src={data.settings.logoUrl || undefined} 
              alt={`${data.settings.siteName} Logo`} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Masuk Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Dashboard Organisasi {data.settings.siteName}
        </p>
        <p className="mt-2 text-center text-xs text-slate-500">
          Anggota dapat masuk menggunakan NIM sebagai Username dan Password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-ios py-8 px-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] sm:rounded-2xl sm:px-10 border border-white/40"
        >
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Username / Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border"
                  placeholder="Masukkan username atau email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                Password / NIM
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-3 border"
                  placeholder="Masukkan password atau NIM"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-emerald-500/20 text-sm font-black text-white bg-emerald-500 hover:bg-emerald-500/90 transition-all active:scale-95 uppercase tracking-widest"
              >
                Masuk
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-600 font-medium">
              Anggota baru?{' '}
              <Link to="/pendaftaran" className="font-black text-emerald-600 hover:text-emerald-600/80">
                Cek status pendaftaran di sini →
              </Link>
            </p>
            <p className="text-sm text-slate-600 font-medium">
              Belum punya akun admin?{' '}
              <Link to="/register" className="font-black text-emerald-600 hover:text-emerald-600/80">
                Daftar di sini
              </Link>
            </p>
            <Link 
              to="/"
              className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
