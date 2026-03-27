import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { MessageSquare, Search, Trash2, CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../../components/ConfirmModal';

export default function AspirasiAdmin() {
  const { data, updateAspirasiStatus, deleteAspirasi } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTanggapanModal, setShowTanggapanModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [selectedAspirasi, setSelectedAspirasi] = useState<number | null>(null);
  const [tanggapan, setTanggapan] = useState('');

  const filteredAspirasi = data.aspirasi.filter(item => 
    item.pesan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.nama && item.nama.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTanggapanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAspirasi !== null) {
      updateAspirasiStatus(selectedAspirasi, 'Selesai', tanggapan);
      setShowTanggapanModal(false);
      setSelectedAspirasi(null);
      setTanggapan('');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    updateAspirasiStatus(id, status as any);
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Kotak Aspirasi</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Kelola Kritik, Saran, dan Keluhan Mahasiswa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-ios p-6 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menunggu</p>
            <p className="text-3xl font-black text-himars-dark">{data.aspirasi.filter(a => a.status === 'Menunggu').length}</p>
          </div>
        </div>
        <div className="glass-ios p-6 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diproses</p>
            <p className="text-3xl font-black text-himars-dark">{data.aspirasi.filter(a => a.status === 'Diproses').length}</p>
          </div>
        </div>
        <div className="glass-ios p-6 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selesai</p>
            <p className="text-3xl font-black text-himars-dark">{data.aspirasi.filter(a => a.status === 'Selesai').length}</p>
          </div>
        </div>
      </div>

      <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-8 mb-8">
        <div className="mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aspirasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAspirasi.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 font-bold">Belum ada data aspirasi</div>
          ) : (
            filteredAspirasi.map((item) => (
              <div key={item.id} className="bg-white/50 rounded-[2rem] border border-white/60 p-6 hover:shadow-lg transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-himars-peach/10 text-himars-peach mb-2 inline-block">
                      {item.kategori}
                    </span>
                    <h3 className="text-lg font-bold text-himars-dark">{item.nama || 'Anonim'}</h3>
                    <p className="text-xs text-slate-500">{item.tanggal}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0 ${
                    item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'Diproses' ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status === 'Menunggu' && <AlertCircle className="w-3 h-3" />}
                    {item.status === 'Diproses' && <Clock className="w-3 h-3" />}
                    {item.status === 'Selesai' && <CheckCircle className="w-3 h-3" />}
                    {item.status}
                  </span>
                </div>

                <div className="mb-4 flex-1">
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">"{item.pesan}"</p>
                </div>

                {item.tanggapan && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> Tanggapan Admin
                    </p>
                    <p className="text-sm text-emerald-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 leading-relaxed">{item.tanggapan}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-auto">
                  {item.status === 'Menunggu' && (
                    <button onClick={() => handleUpdateStatus(item.id, 'Diproses')} className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Proses
                    </button>
                  )}
                  {item.status !== 'Selesai' && (
                    <button onClick={() => { setSelectedAspirasi(item.id); setShowTanggapanModal(true); }} className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Tanggapi & Selesai
                    </button>
                  )}
                  <button 
                    onClick={() => { 
                      setItemToDelete(item.id);
                      setIsDeleteModalOpen(true);
                    }} 
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tanggapan */}
      <AnimatePresence>
        {showTanggapanModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowTanggapanModal(false); setSelectedAspirasi(null); setTanggapan(''); }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-ios rounded-[3rem] p-10 max-w-md w-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Berikan Tanggapan</h3>
              <form onSubmit={handleTanggapanSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tanggapan / Solusi</label>
                  <textarea required value={tanggapan} onChange={e => setTanggapan(e.target.value)} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm min-h-[120px]" placeholder="Tuliskan tanggapan resmi dari himpunan..." />
                </div>
                <button type="submit" className="w-full py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all mt-4">Kirim & Selesaikan</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={async () => {
          if (itemToDelete) {
            deleteAspirasi(itemToDelete);
          }
        }}
        title="Hapus Aspirasi"
        message="Apakah Anda yakin ingin menghapus aspirasi ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
