import React from 'react';
import { useData } from '../store/DataContext';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function TugasProkerWidget() {
  const { data } = useData();

  const tugasHariIni = data.proker
    .filter(p => p.tahapSaatIni !== 'DIEVALUASI' && p.status !== 'Selesai')
    .sort((a, b) => new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime())
    .slice(0, 5);

  if (tugasHariIni.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          Tugas Proker Terdekat
        </h3>
        <Link to="/admin/proker" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-600 flex items-center gap-1">
          Lihat Semua <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {tugasHariIni.map(proker => (
          <div key={proker.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate">{proker.namaProker}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{proker.departemen}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{proker.tahapSaatIni || 'PENGAJUAN'}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-slate-600">{proker.tanggalMulai}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
