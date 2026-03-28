import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { MessageSquare, Send, CheckCircle, AlertCircle, Clock, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Aspirasi() {
  const { data, addAspirasi } = useData();
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    kategori: 'Akademik' as 'Akademik' | 'Fasilitas' | 'Organisasi' | 'Lainnya',
    pesan: ''
  });
  const [isAnonim, setIsAnonim] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const aspirasiData = {
      nama: isAnonim ? 'Anonim' : formData.nama,
      nim: isAnonim ? '' : formData.nim,
      kategori: formData.kategori,
      pesan: formData.pesan
    };

    // Save to local context
    addAspirasi(aspirasiData);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nama: '', nim: '', kategori: 'Akademik', pesan: '' });
      setIsAnonim(false);
    }, 3000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4"
          >
            Kotak Aspirasi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-light"
          >
            Sampaikan kritik, saran, dan keluhan Anda untuk HIMARS dan Prodi ARS UMLA yang lebih baik.
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Form Aspirasi */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-[3rem] p-8 md:p-10 border border-slate-200 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-bl-full -z-10"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Tulis Aspirasi</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isAnonim} onChange={(e) => setIsAnonim(e.target.checked)} className="rounded border-slate-300 bg-slate-50 text-orange-500 focus:ring-orange-500 focus:ring-offset-white" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Kirim Anonim</span>
                </label>
              </div>

              <AnimatePresence>
                {!isAnonim && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Nama Lengkap</label>
                      <input type="text" required={!isAnonim} value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-bold text-sm text-slate-900 placeholder-slate-400" placeholder="Nama Anda" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">NIM</label>
                      <input type="text" required={!isAnonim} value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-bold text-sm text-slate-900 placeholder-slate-400" placeholder="NIM Anda" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Kategori</label>
                <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-bold text-sm text-slate-900">
                  <option value="Akademik">Akademik & Perkuliahan</option>
                  <option value="Fasilitas">Fasilitas Kampus</option>
                  <option value="Organisasi">Kegiatan Organisasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Pesan Aspirasi</label>
                <textarea required value={formData.pesan} onChange={e => setFormData({...formData, pesan: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-bold text-sm text-slate-900 min-h-[150px] placeholder-slate-400" placeholder="Sampaikan aspirasi Anda secara jelas dan sopan..." />
              </div>

              <div className="flex flex-col items-center gap-4">
                <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Kirim Aspirasi
                </button>
                
                <AnimatePresence>
                  {submitted && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-bold"
                    >
                      <CheckCircle className="w-4 h-4" /> Terima kasih, aspirasi Anda telah terkirim!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
