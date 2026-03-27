import React from 'react';
import { BookOpen, CheckCircle, Target, Users, Wallet, Calendar, Shield } from 'lucide-react';

export default function Panduan() {
  const sections = [
    {
      title: 'Dasbor & Ringkasan',
      icon: Target,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      content: 'Dasbor memberikan ringkasan eksekutif dari seluruh aktivitas organisasi. Anda dapat melihat total anggota, presensi hari ini, saldo kas, dan status program kerja secara real-time.'
    },
    {
      title: 'Manajemen Anggota & Presensi',
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      content: 'Kelola data anggota aktif dan alumni. Fitur Presensi QR memungkinkan pencatatan kehadiran yang cepat dan akurat untuk setiap acara atau rapat rutin.'
    },
    {
      title: 'Tracking Program Kerja (Proker)',
      icon: Calendar,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      content: 'Pantau proker dari tahap Pengajuan hingga Evaluasi. Setiap proker memiliki alur kerja yang jelas: Pengajuan -> Disetujui -> Berjalan -> Selesai -> Dievaluasi.'
    },
    {
      title: 'Manajemen Keuangan',
      icon: Wallet,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      content: 'Catat setiap pemasukan dan pengeluaran organisasi. Sistem akan otomatis menghitung saldo kas dan menyediakan laporan keuangan yang transparan.'
    },
    {
      title: 'Keamanan & Hak Akses',
      icon: Shield,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      content: 'Sistem menggunakan Role-Based Access Control (RBAC). Hanya pengguna dengan peran Admin yang dapat mengubah data krusial, sementara Anggota biasa memiliki akses terbatas.'
    }
  ];

  return (
    <div className="w-full mx-auto space-y-8">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-4">Panduan HIMARS Workspace</h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Selamat datang di pusat dokumentasi HIMARS Workspace. Di sini Anda dapat mempelajari cara menggunakan berbagai fitur yang tersedia untuk mengoptimalkan kinerja organisasi.
        </p>
      </div>

      <div className="grid gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex gap-6">
              <div className={`w-14 h-14 rounded-2xl ${section.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-7 h-7 ${section.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-3">{section.title}</h3>
                <p className="text-slate-600 leading-relaxed">{section.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-center text-white shadow-xl">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
        <h2 className="text-2xl font-black tracking-tight mb-4">Siap Memulai?</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
          Anda sudah memahami dasar-dasar penggunaan HIMARS Workspace. Mulailah dengan menjelajahi Dasbor atau menambahkan data proker baru.
        </p>
      </div>
    </div>
  );
}
