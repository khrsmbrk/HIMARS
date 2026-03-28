import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { UserPlus, User, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const { data, addUser, addActivityLog } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nama: '',
    department: ''
  });
  const [error, setError] = useState('');

  const departments = [
    { id: 'pembina', title: 'Pembina' },
    { id: 'ketua-wakil', title: 'Ketua & Wakil' },
    { id: 'sekretaris', title: 'Sekretaris' },
    { id: 'bendahara', title: 'Bendahara' },
    { id: 'penak', title: 'PENAK' },
    { id: 'litbang', title: 'Litbang' },
    { id: 'pengmas', title: 'PENGAPMAS' },
    { id: 'medkom', title: 'Medkom' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password / NIM tidak cocok');
      return;
    }

    if (!formData.department) {
      setError('Pilih departemen / jabatan Anda');
      return;
    }

    if (data.users.find(u => u.username === formData.username)) {
      setError('Username / Email sudah digunakan');
      return;
    }

    addUser({
      username: formData.username,
      password: formData.password,
      nama: formData.nama,
      department: formData.department,
      role: 'member' // Default role is member
    });

    // Record activity log
    addActivityLog({
      userId: 0, // System/New User
      username: formData.username,
      nama: formData.nama,
      action: 'Register',
      details: `Pendaftaran akun baru oleh ${formData.nama} (${formData.username}). Menunggu persetujuan.`
    });

    setSuccess('Pendaftaran berhasil! Akun Anda perlu disetujui oleh Admin sebelum dapat mengakses dashboard.');
    setTimeout(() => navigate('/login'), 4000);
  };

  const [success, setSuccess] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6 text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-widest font-black text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
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
          Daftar Akun Admin
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          Pendaftaran khusus untuk Pengurus / Administrator {data.settings.siteName}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-lg text-sm font-medium">
                {success}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Nama Lengkap</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  placeholder="Nama Lengkap"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Departemen / Jabatan</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPlus className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all appearance-none"
                >
                  <option value="">Pilih Departemen</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Username / Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  placeholder="Username atau email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Password / NIM</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  placeholder="Masukkan password atau NIM"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Konfirmasi Password / NIM</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
                  placeholder="Ulangi password atau NIM"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-emerald-500/20 text-sm font-black text-white bg-emerald-500 hover:bg-emerald-500/90 transition-all active:scale-95 uppercase tracking-widest"
              >
                Daftar Sekarang
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 font-medium">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-black text-emerald-600 hover:text-emerald-600/80">
                Masuk di sini
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
