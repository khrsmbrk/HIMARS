import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Mail, Plus, Search, Trash2, FileText, Download, CheckCircle, Clock, Archive, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GenerateSuratModal from '../../components/GenerateSuratModal';
import ConfirmModal from '../../components/ConfirmModal';

export default function SuratAdmin() {
  const { data, addSurat, updateSuratStatus, deleteSurat } = useData();
  const [activeTab, setActiveTab] = useState<'Masuk' | 'Keluar'>('Masuk');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nomorSurat: '',
    jenis: 'Masuk' as 'Masuk' | 'Keluar',
    tanggalSurat: new Date().toISOString().split('T')[0],
    tanggalDiterima: new Date().toISOString().split('T')[0],
    pengirimPenerima: '',
    perihal: '',
    status: 'Diproses' as 'Diproses' | 'Selesai' | 'Diarsipkan'
  });

  const getRomanMonth = (month: number) => {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return roman[month];
  };

  const generateNomorSurat = () => {
    const count = data.surat.filter(s => s.jenis === 'Keluar').length + 1;
    const now = new Date();
    const month = getRomanMonth(now.getMonth());
    const year = now.getFullYear();
    return `${count.toString().padStart(3, '0')}/HIMARS/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalFormData = {
      ...formData,
      nomorSurat: formData.jenis === 'Keluar' && !formData.nomorSurat ? generateNomorSurat() : formData.nomorSurat
    };

    addSurat(finalFormData);
    setShowAdd(false);
    setFormData({
      nomorSurat: '',
      jenis: activeTab,
      tanggalSurat: new Date().toISOString().split('T')[0],
      tanggalDiterima: new Date().toISOString().split('T')[0],
      pengirimPenerima: '',
      perihal: '',
      status: 'Diproses'
    });
  };

  const filteredSurat = data.surat.filter(item => 
    item.jenis === activeTab &&
    (item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pengirimPenerima.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">E-Arsip Surat</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manajemen Surat Masuk & Keluar</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('Masuk'); setFormData({...formData, jenis: 'Masuk'}); }}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'Masuk' ? 'bg-himars-peach text-white shadow-lg shadow-himars-peach/20' : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Mail className="w-4 h-4" /> Surat Masuk
          </button>
          <button
            onClick={() => { setActiveTab('Keluar'); setFormData({...formData, jenis: 'Keluar'}); }}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'Keluar' ? 'bg-himars-peach text-white shadow-lg shadow-himars-peach/20' : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Surat Keluar
          </button>
        </div>
      </div>

      <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={`Cari Surat ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowGenerate(true)}
              className="w-full sm:w-auto px-6 py-3 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-himars-peach/90 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Generate AI
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="w-full sm:w-auto px-4 py-2 bg-himars-dark text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-himars-dark/90 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> SURAT {activeTab.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor Surat</th>
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Perihal</th>
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeTab === 'Masuk' ? 'Pengirim' : 'Tujuan'}</th>
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-bold">Belum ada data surat {activeTab.toLowerCase()}</td>
                </tr>
              ) : (
                filteredSurat.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-bold text-slate-500">{item.nomorSurat}</td>
                    <td className="py-4 px-4 font-bold text-himars-dark">{item.perihal}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{item.pengirimPenerima}</td>
                    <td className="py-4 px-4">
                      <div className="text-xs text-slate-600"><span className="font-bold">Surat:</span> {item.tanggalSurat}</div>
                      {activeTab === 'Masuk' && <div className="text-xs text-slate-600"><span className="font-bold">Terima:</span> {item.tanggalDiterima}</div>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${
                        item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Diarsipkan' ? 'bg-slate-200 text-slate-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status === 'Diproses' && <Clock className="w-3 h-3" />}
                        {item.status === 'Selesai' && <CheckCircle className="w-3 h-3" />}
                        {item.status === 'Diarsipkan' && <Archive className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === 'Diproses' && (
                          <button 
                            onClick={async () => {
                              updateSuratStatus(item.id, 'Selesai');
                            }} 
                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" 
                            title="Tandai Selesai"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {item.status === 'Selesai' && (
                          <button 
                            onClick={async () => {
                              updateSuratStatus(item.id, 'Diarsipkan');
                            }} 
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all" 
                            title="Arsipkan"
                          >
                            <Archive className="w-4 h-4" />
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Surat */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-ios rounded-[3rem] p-10 max-w-2xl w-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Tambah Surat {activeTab}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nomor Surat</label>
                  <input 
                    type="text" 
                    required={activeTab === 'Masuk'} 
                    value={formData.nomorSurat} 
                    onChange={e => setFormData({...formData, nomorSurat: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" 
                    placeholder={activeTab === 'Keluar' ? 'Otomatis digenerate jika kosong' : 'Contoh: 001/HIMARS/III/2026'} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Perihal</label>
                  <input type="text" required value={formData.perihal} onChange={e => setFormData({...formData, perihal: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="Contoh: Undangan Rapat" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{activeTab === 'Masuk' ? 'Pengirim' : 'Tujuan / Penerima'}</label>
                  <input type="text" required value={formData.pengirimPenerima} onChange={e => setFormData({...formData, pengirimPenerima: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tgl Surat</label>
                    <input type="date" required value={formData.tanggalSurat} onChange={e => setFormData({...formData, tanggalSurat: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                  </div>
                  {activeTab === 'Masuk' && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tgl Diterima</label>
                      <input type="date" required value={formData.tanggalDiterima} onChange={e => setFormData({...formData, tanggalDiterima: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all mt-4">Simpan Surat</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <GenerateSuratModal 
        isOpen={showGenerate} 
        onClose={() => setShowGenerate(false)} 
      />
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={async () => {
          if (itemToDelete) {
            deleteSurat(itemToDelete);
          }
        }}
        title="Hapus Surat"
        message="Apakah Anda yakin ingin menghapus surat ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
