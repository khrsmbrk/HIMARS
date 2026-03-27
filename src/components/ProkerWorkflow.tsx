import React, { useState } from 'react';
import { Proker } from '../store/DataContext';
import { CheckCircle, Circle, Play, Check, FileText, QrCode, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProkerStepper, { ProkerStage } from './ProkerStepper';

interface ProkerWorkflowProps {
  proker: Proker;
  onUpdateTahap: (id: number, tahap: ProkerStage, evaluasi?: any) => void;
}

const TAHAP_LIST: Array<ProkerStage> = [ProkerStage.PENGAJUAN, ProkerStage.DISETUJUI, ProkerStage.BERJALAN, ProkerStage.SELESAI];

export default function ProkerWorkflow({ proker, onUpdateTahap }: ProkerWorkflowProps) {
  const currentTahap = proker.tahapSaatIni || ProkerStage.PENGAJUAN;
  const currentIndex = TAHAP_LIST.indexOf(currentTahap);
  const [showEvaluasiForm, setShowEvaluasiForm] = useState(false);
  const [evaluasi, setEvaluasi] = useState({
    apaYangBerhasil: '',
    yangPerluDiperbaiki: '',
    rekomendasiTahunDepan: ''
  });

  const handleNextTahap = () => {
    if (currentIndex < TAHAP_LIST.length - 1) {
      const nextTahap = TAHAP_LIST[currentIndex + 1];
      if (nextTahap === ProkerStage.SELESAI) {
        setShowEvaluasiForm(true);
      } else {
        onUpdateTahap(proker.id, nextTahap);
      }
    }
  };

  const submitEvaluasi = () => {
    onUpdateTahap(proker.id, ProkerStage.SELESAI, evaluasi);
    setShowEvaluasiForm(false);
  };

  const handleStageChange = (stage: ProkerStage) => {
    if (stage === ProkerStage.SELESAI) {
      setShowEvaluasiForm(true);
    } else {
      onUpdateTahap(proker.id, stage);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="mb-6">
        <ProkerStepper currentStage={currentTahap} onChangeStage={handleStageChange} />
      </div>

      {currentTahap === ProkerStage.BERJALAN && (
        <div className="flex gap-2 mb-4">
          <Link to="/admin/presensi" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
            <QrCode className="w-4 h-4" /> Presensi QR
          </Link>
          <Link to="/admin/keuangan" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
            <DollarSign className="w-4 h-4" /> Keuangan
          </Link>
        </div>
      )}

      {showEvaluasiForm ? (
        <div className="bg-slate-50 p-3 rounded-lg flex flex-col gap-3">
          <h5 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Form Evaluasi</h5>
          <textarea
            placeholder="Apa yang berhasil?"
            className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={evaluasi.apaYangBerhasil}
            onChange={e => setEvaluasi({...evaluasi, apaYangBerhasil: e.target.value})}
          />
          <textarea
            placeholder="Yang perlu diperbaiki?"
            className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={evaluasi.yangPerluDiperbaiki}
            onChange={e => setEvaluasi({...evaluasi, yangPerluDiperbaiki: e.target.value})}
          />
          <textarea
            placeholder="Rekomendasi tahun depan?"
            className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={evaluasi.rekomendasiTahunDepan}
            onChange={e => setEvaluasi({...evaluasi, rekomendasiTahunDepan: e.target.value})}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setShowEvaluasiForm(false)} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
            <button onClick={submitEvaluasi} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors">Simpan</button>
          </div>
        </div>
      ) : (
        currentIndex < TAHAP_LIST.length - 1 && (
          <button
            onClick={handleNextTahap}
            className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
          >
            Lanjut ke {TAHAP_LIST[currentIndex + 1]}
          </button>
        )
      )}
    </div>
  );
}
