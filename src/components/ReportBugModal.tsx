import React, { useState } from 'react';
import { Bug, X, Send, CheckCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import { useData } from '../store/DataContext';

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportBugModal({ isOpen, onClose }: ReportBugModalProps) {
  const { addActivityLog } = useData();
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentUser = storage.get('currentUser', { nama: 'Unknown', id: 'unknown', username: 'unknown' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const bugReport = {
        id: Date.now().toString(),
        judul,
        deskripsi,
        pelapor: currentUser.nama,
        tanggal: new Date().toISOString(),
        status: 'Open'
      };

      const existingBugs = storage.get<any[]>('himars_bug_reports', []);
      storage.set('himars_bug_reports', [...existingBugs, bugReport]);

      addActivityLog({
        userId: currentUser.id,
        username: currentUser.username,
        nama: currentUser.nama,
        action: 'Lapor Bug',
        details: `Melaporkan bug: ${judul}`
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setJudul('');
        setDeskripsi('');
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <Bug className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Lapor Bug</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bantu Kami Meningkatkan Sistem</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="text-lg font-black text-slate-800 tracking-tight mb-2">Laporan Terkirim!</h4>
            <p className="text-sm text-slate-500">Terima kasih atas laporan Anda. Tim teknis kami akan segera menindaklanjutinya.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Judul Masalah</label>
              <input 
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Tombol simpan tidak berfungsi"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi Detail</label>
              <textarea 
                required
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan langkah-langkah untuk mereproduksi masalah ini..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Kirim Laporan
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
