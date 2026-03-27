import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useData } from '../../store/DataContext';
import { ArrowLeft, Users, FileText, Newspaper, Shield } from 'lucide-react';
import { AIGeneratedImage } from '../../components/AIGeneratedImage';

const departmentInfo: Record<string, { title: string, description: string, icon: any, color: string, prompt: string }> = {
  'ketua-wakil': {
    title: 'Ketua & Wakil Ketua',
    description: 'Pucuk pimpinan organisasi yang bertanggung jawab atas seluruh jalannya roda organisasi HIMARS.',
    icon: Shield,
    color: 'bg-[#1a1a1a]',
    prompt: 'Indonesian university student leader wearing olive green uniform shirt, giving a speech at a podium. High quality, cinematic lighting, realistic, photography.'
  },
  'sekretaris': {
    title: 'Sekretaris',
    description: 'Bertanggung jawab atas administrasi, persuratan, dan pengarsipan dokumen organisasi.',
    icon: FileText,
    color: 'bg-emerald-500',
    prompt: 'Indonesian university student wearing olive green uniform shirt, typing on a laptop and organizing documents. High quality, cinematic lighting, realistic, photography.'
  },
  'bendahara': {
    title: 'Bendahara',
    description: 'Mengelola keuangan organisasi, termasuk pemasukan, pengeluaran, dan kas anggota.',
    icon: Shield,
    color: 'bg-orange-500',
    prompt: 'Indonesian university student wearing olive green uniform shirt, calculating finances with a calculator and laptop. High quality, cinematic lighting, realistic, photography.'
  },
  'paik': {
    title: 'PENAK',
    description: 'Bidang Pengkaderan, Pendidikan Agama Islam, dan Kemuhammadiyahan.',
    icon: Users,
    color: 'bg-orange-600',
    prompt: 'Indonesian university students wearing olive green uniform shirts, having a religious study group discussion. High quality, cinematic lighting, realistic, photography.'
  },
  'litbang': {
    title: 'Litbang',
    description: 'Bidang Penelitian dan Pengembangan Intelektual mahasiswa.',
    icon: Newspaper,
    color: 'bg-orange-600',
    prompt: 'Indonesian university students wearing olive green uniform shirts, conducting research in a modern lab or library. High quality, cinematic lighting, realistic, photography.'
  },
  'pengmas': {
    title: 'PENGAPMAS',
    description: 'Bidang Pengabdian Masyarakat dan aksi sosial.',
    icon: Users,
    color: 'bg-purple-600',
    prompt: 'Indonesian university students wearing olive green uniform shirts, doing social work and helping the community outdoor. High quality, cinematic lighting, realistic, photography.'
  },
  'medkom': {
    title: 'Medkom',
    description: 'Bidang Media Komunikasi dan publikasi informasi.',
    icon: Newspaper,
    color: 'bg-red-600',
    prompt: 'Indonesian university student wearing olive green uniform shirt, holding a camera and taking photos for media publication. High quality, cinematic lighting, realistic, photography.'
  }
};

export default function DepartmentDetail() {
  const { id } = useParams();
  const { data } = useData();
  const info = id ? departmentInfo[id] : null;

  if (!info) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-900">
        <h1 className="text-2xl font-black text-slate-900 uppercase">Departemen Tidak Ditemukan</h1>
        <Link to="/struktur" className="mt-4 text-orange-500 font-bold uppercase tracking-widest text-xs hover:text-orange-400">&larr; Kembali ke Struktur</Link>
      </div>
    );
  }

  const Icon = info.icon;

  return (
    <div className="bg-slate-50 min-h-screen py-24 px-4 text-slate-900 selection:bg-orange-500/30">
      <div className="max-w-5xl mx-auto">
        <Link to="/struktur" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors uppercase tracking-widest font-black text-xs mb-12">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Struktur</span>
        </Link>

        <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-xl">
          <div className={`${info.color} p-12 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 z-0">
              <AIGeneratedImage 
                prompt={info.prompt}
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 border border-white/20">
                <Icon className="w-12 h-12 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">{info.title}</h1>
                <p className="text-white/80 text-lg font-medium max-w-2xl">{info.description}</p>
              </div>
            </div>
          </div>

          <div className="p-12">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Program Kerja & Fokus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-3">Visi Bidang</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Mewujudkan tata kelola {info.title.toLowerCase()} yang transparan, inovatif, dan berdampak bagi seluruh mahasiswa Administrasi Rumah Sakit.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-3">Misi Utama</h3>
                <ul className="text-slate-600 text-sm space-y-2 list-disc list-inside">
                  <li>Optimalisasi peran {info.title} dalam organisasi.</li>
                  <li>Pengembangan potensi anggota melalui program kerja terukur.</li>
                  <li>Kolaborasi aktif dengan pihak internal dan eksternal.</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-200 text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Himpunan Mahasiswa Administrasi Rumah Sakit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
