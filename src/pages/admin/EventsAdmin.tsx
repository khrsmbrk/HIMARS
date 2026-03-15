import React, { useState, useRef, useMemo } from 'react';
import { useData } from '../../store/DataContext';
import { Trash2, Calendar, Clock, Image as ImageIcon, Plus as PlusIcon, X, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JoditEditor from 'jodit-react';
import ConfirmModal from '../../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { kirimKeSheet } from '../../utils/kirimKeSheet';

export default function EventsAdmin() {
  const { data, addNews, deleteNews } = useData();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Detail acara...',
    height: 400,
    toolbarAdaptive: false,
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ]
  }), []);
  
  const [actionStatus, setActionStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'kegiatan',
    isi: '',
    coverImage: ''
  });

  const [selectedQR, setSelectedQR] = useState<any>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, coverImage: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.isi) {
      setActionStatus({ message: 'Judul dan deskripsi acara harus diisi', type: 'error' });
      setTimeout(() => setActionStatus(null), 3000);
      return;
    }

    // Sync to Google Sheets
    await kirimKeSheet({
      judul: formData.judul,
      kategori: formData.kategori,
      isi: formData.isi.replace(/<[^>]*>?/gm, ''), // strip html for sheet
      tanggal: new Date().toLocaleDateString('id-ID')
    }, 'Manajemen Acara');

    addNews(formData);
    setActionStatus({ message: 'Acara berhasil dipublikasikan', type: 'success' });
    setTimeout(() => setActionStatus(null), 3000);
    setFormData({ 
      judul: '', 
      kategori: 'kegiatan', 
      isi: '', 
      coverImage: ''
    });
  };

  const events = data.news.filter(n => n.kategori === 'kegiatan');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Manajemen Acara</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Kelola agenda dan QR Code presensi</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all active:scale-95"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Acara
          </button>
          <AnimatePresence>
          {actionStatus && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border shadow-xl ${
                actionStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
              }`}
            >
              {actionStatus.message}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-8">
          <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight mb-8">Daftar Acara Aktif</h2>
          
          {events.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-[2rem]">
              <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada acara yang terdaftar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-slate-50 rounded-[2rem] border border-slate-100 p-6 hover:border-himars-peach/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 glass-ios rounded-xl flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40">
                        <Calendar className="w-5 h-5 text-himars-peach" />
                      </div>
                      <div>
                        <h3 className="font-black text-himars-dark uppercase tracking-tight line-clamp-1">{event.judul}</h3>
                        <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                          <Clock className="w-3 h-3 mr-1" /> {event.tanggal}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <button 
                      onClick={() => navigate(`/admin/kehadiran?event=${encodeURIComponent(event.judul)}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 glass-ios text-himars-dark rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:bg-slate-50 transition-colors"
                    >
                      <QrCode className="w-4 h-4" /> Buat QR Presensi
                    </button>
                    <button 
                      onClick={() => {
                        setItemToDelete(event.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 w-full max-w-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-black text-himars-dark uppercase tracking-tight">Buat Acara Baru</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Generate QR Code Presensi Otomatis</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={(e) => { handleSubmit(e); setIsAddModalOpen(false); }} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Acara</label>
                  <input
                    type="text"
                    required
                    value={formData.judul}
                    onChange={(e) => setFormData({...formData, judul: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    placeholder="Contoh: Seminar Nasional"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Deskripsi Acara</label>
                  <div className="glass-ios overflow-hidden rounded-2xl border border-slate-100">
                    <JoditEditor
                      ref={editor}
                      value={formData.isi}
                      config={config}
                      onBlur={newContent => setFormData({...formData, isi: newContent})}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Poster / Cover</label>
                  {formData.coverImage ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-video mb-2 border border-slate-200">
                      <img src={formData.coverImage || undefined} className="w-full h-full object-cover" alt="Cover preview" />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Poster</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all"
                >
                  Simpan Acara
                </button>
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
            const event = data.news.find(n => n.id === itemToDelete);
            if (event) {
              await kirimKeSheet({
                judul: event.judul,
                kategori: event.kategori,
                aksi: 'Hapus Acara'
              }, 'Manajemen Acara');
            }
            deleteNews(itemToDelete);
            setActionStatus({ message: 'Acara berhasil dihapus', type: 'success' });
            setTimeout(() => setActionStatus(null), 3000);
          }
        }}
        title="Hapus Acara"
        message="Apakah Anda yakin ingin menghapus acara ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
