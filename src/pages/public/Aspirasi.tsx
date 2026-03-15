import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { MessageSquare, Send, CheckCircle, AlertCircle, Clock, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { kirimKeSheet } from '../../utils/kirimKeSheet';

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

    // Sync to Google Sheets
    await kirimKeSheet(aspirasiData, 'Kotak Aspirasi');

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nama: '', nim: '', kategori: 'Akademik', pesan: '' });
      setIsAnonim(false);
    }, 3000);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-liquid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 bg-himars-peach/20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3"
          >
            <MessageSquare className="w-10 h-10 text-himars-peach" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-himars-dark uppercase tracking-tight mb-6"
          >
            Kotak Aspirasi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-medium"
          >
            Sampaikan kritik, saran, dan keluhan Anda untuk HIMARS dan Prodi ARS UMLA yang lebih baik.
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Form Aspirasi */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-ios rounded-[3rem] p-8 md:p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-himars-peach/10 rounded-bl-full -z-10"></div>
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-2">Aspirasi Terkirim!</h3>
                <p className="text-slate-600">Terima kasih atas masukan Anda. Aspirasi Anda akan segera diproses oleh pengurus HIMARS.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-himars-dark uppercase tracking-tight">Tulis Aspirasi</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isAnonim} onChange={(e) => setIsAnonim(e.target.checked)} className="rounded border-slate-300 text-himars-peach focus:ring-himars-peach" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kirim Anonim</span>
                  </label>
                </div>

                <AnimatePresence>
                  {!isAnonim && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Lengkap</label>
                        <input type="text" required={!isAnonim} value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 bg-white/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">NIM</label>
                        <input type="text" required={!isAnonim} value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} className="w-full px-4 py-3 bg-white/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kategori</label>
                  <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value as any})} className="w-full px-4 py-3 bg-white/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm">
                    <option value="Akademik">Akademik & Perkuliahan</option>
                    <option value="Fasilitas">Fasilitas Kampus</option>
                    <option value="Organisasi">Kegiatan Organisasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pesan Aspirasi</label>
                  <textarea required value={formData.pesan} onChange={e => setFormData({...formData, pesan: e.target.value})} className="w-full px-4 py-3 bg-white/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm min-h-[150px]" placeholder="Sampaikan aspirasi Anda secara jelas dan sopan..." />
                </div>

                <button type="submit" className="w-full py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Kirim Aspirasi
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
