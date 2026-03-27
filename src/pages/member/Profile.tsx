import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { motion } from 'motion/react';
import { User, Calendar, CheckCircle, XCircle, LogOut, ArrowLeft, CreditCard, Clock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function MemberProfile() {
  const { data } = useData();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  if (!currentUser || !currentUser.id) {
    navigate('/login');
    return null;
  }

  // Find member details from anggota list
  const memberDetails = data.anggota.find(a => a.nim === currentUser.password || a.nama === currentUser.nama);

  // Get attendance history
  const attendanceHistory = data.kehadiran.filter(k => k.nim === currentUser.password || k.nama === currentUser.nama);

  // Get kas wajib history
  const kasWajibHistory = data.kasWajib.filter(k => k.anggotaId === memberDetails?.id);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-emerald-500 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" /> Keluar
          </button>
        </div>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-ios rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 flex flex-col md:flex-row gap-8 items-center md:items-start"
        >
          <div className="w-32 h-32 rounded-full bg-emerald-500/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl shrink-0">
            {memberDetails?.foto ? (
              <img src={memberDetails.foto} alt={currentUser.nama} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-emerald-500" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">{currentUser.nama}</h1>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest">
                {currentUser.password} {/* Assuming NIM is used as password */}
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-widest">
                {memberDetails?.jabatan || 'Anggota'}
              </span>
              <span className="px-3 py-1 bg-emerald-600/10 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest">
                {memberDetails?.departemen || '-'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Email</p>
                <p className="font-medium">{currentUser.username}</p>
              </div>
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">No. HP</p>
                <p className="font-medium">{memberDetails?.noHp || '-'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Attendance History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-ios rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-2 bg-emerald-600/10 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Riwayat Presensi</h2>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {attendanceHistory.length === 0 ? (
                <p className="text-center text-slate-500 py-4 text-sm">Belum ada riwayat presensi.</p>
              ) : (
                attendanceHistory.map((k, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{k.kegiatan}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {k.waktu}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Hadir</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Kas Wajib Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-ios rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <CreditCard className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Status Kas Wajib</h2>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {kasWajibHistory.length === 0 ? (
                <p className="text-center text-slate-500 py-4 text-sm">Belum ada riwayat pembayaran kas.</p>
              ) : (
                kasWajibHistory.map((k, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{k.bulan}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {k.tanggalBayar}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-500">Rp {k.jumlah.toLocaleString('id-ID')}</p>
                      <div className="flex items-center gap-1 text-emerald-600 justify-end mt-1">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Lunas</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
