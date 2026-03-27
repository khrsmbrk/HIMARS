import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, GraduationCap, Target, Calendar, CheckCircle, XCircle, LogOut, Edit, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profil() {
  const { data, resetUserPassword, addActivityLog } = useData();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Redirect if not logged in or not anggota
  React.useEffect(() => {
    if (!localStorage.getItem('isLoggedIn') || currentUser.role !== 'anggota') {
      navigate('/login');
    }
  }, [navigate, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!currentUser.id) return null;

  const anggotaData = data.anggota.find(a => a.nim === currentUser.nim) || currentUser;
  const userAccount = data.users.find(u => u.username === currentUser.username) || currentUser;

  const kehadiranUser = data.kehadiran.filter(k => k.nim === currentUser.nim);
  const totalKehadiran = kehadiranUser.filter(k => k.keterangan === 'Hadir').length;
  const persentaseKehadiran = kehadiranUser.length > 0 ? Math.round((totalKehadiran / kehadiranUser.length) * 100) : 0;

  const kasUser = data.kasWajib.filter(k => k.anggotaId === anggotaData.id);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.oldPassword !== userAccount.password) {
      setPasswordError('Password lama salah');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password baru minimal 8 karakter');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok');
      return;
    }

    resetUserPassword(userAccount.id, passwordForm.newPassword);
    
    // Update local storage
    const updatedUser = { ...currentUser, password: passwordForm.newPassword };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    addActivityLog({
      userId: currentUser.id,
      username: currentUser.username,
      nama: currentUser.nama,
      action: 'Change Password',
      details: `Anggota ${currentUser.nama} mengganti password.`
    });

    setPasswordSuccess('Password berhasil diubah!');
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5"></div>
          
          <div className="relative z-10">
            {anggotaData.foto ? (
              <img src={anggotaData.foto} alt={anggotaData.nama} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-12 h-12 text-slate-400" />
              </div>
            )}
          </div>
          
          <div className="relative z-10 flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{anggotaData.nama}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-sm font-bold rounded-full">
                    {anggotaData.divisi || anggotaData.departemen || 'Anggota'}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                    NIM: {anggotaData.nim}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                    Angkatan: {anggotaData.angkatan}
                  </span>
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${anggotaData.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {anggotaData.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors" 
                  title="Ganti Password"
                >
                  <KeyRound className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors" title="Edit Profil">
                  <Edit className="w-5 h-5" />
                </button>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Keluar">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Pribadi */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:col-span-1"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" /> Informasi Pribadi
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email / Username</p>
                  <p className="text-sm font-semibold text-slate-800">{userAccount.username}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">No. WhatsApp</p>
                  <p className="text-sm font-semibold text-slate-800">{anggotaData.noHp || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Semester</p>
                  <p className="text-sm font-semibold text-slate-800">{anggotaData.semester || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Divisi</p>
                  <p className="text-sm font-semibold text-slate-800">{anggotaData.divisi || anggotaData.departemen || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Tanggal Bergabung</p>
                  <p className="text-sm font-semibold text-slate-800">{userAccount.createdAt || '-'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Riwayat Presensi & Kas */}
          <div className="lg:col-span-2 space-y-8">
            {/* Presensi */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> Riwayat Kehadiran
                </h2>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Persentase Kehadiran</p>
                  <p className="text-xl font-black text-emerald-500">{persentaseKehadiran}%</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Kegiatan</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {kehadiranUser.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">Belum ada riwayat kehadiran</td>
                      </tr>
                    ) : (
                      kehadiranUser.map(k => (
                        <tr key={k.id}>
                          <td className="px-4 py-3 text-sm text-slate-600">{k.tanggal}</td>
                          <td className="px-4 py-3 text-sm text-slate-800 font-medium">{k.kegiatan}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                              k.keterangan === 'Hadir' ? 'bg-emerald-100 text-emerald-700' :
                              k.keterangan === 'Izin' ? 'bg-amber-100 text-amber-700' :
                              k.keterangan === 'Sakit' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {k.keterangan}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Kas Wajib */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6"
            >
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" /> Status Kas Wajib
              </h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {months.map(month => {
                  const kas = kasUser.find(k => k.bulan === month);
                  return (
                    <div key={month} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                      kas?.status === 'lunas' ? 'bg-emerald-50 border-emerald-100' :
                      kas?.status === 'belum' ? 'bg-red-50 border-red-100' :
                      'bg-slate-50 border-slate-100'
                    }`}>
                      <span className="text-xs font-bold text-slate-600 mb-1">{month.substring(0, 3)}</span>
                      {kas?.status === 'lunas' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : kas?.status === 'belum' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-500" />
                  Ganti Password
                </h3>
                <button
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-emerald-100">
                    {passwordSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Password Lama</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Minimal 8 karakter</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                    minLength={8}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-500/90 rounded-xl transition-colors shadow-sm shadow-emerald-500/20"
                  >
                    Simpan Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
