import React, { useState, useRef, useMemo } from 'react';
import { useData } from '../../store/DataContext';
import { Trash2, Calendar, Clock, Image as ImageIcon, Plus as PlusIcon, X, QrCode, Download, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import JoditEditor from 'jodit-react';
import ConfirmModal from '../../components/ConfirmModal';

export default function NewsAdmin() {
  const { data, addNews, deleteNews } = useData();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Isi berita...',
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
    kategori: 'pengumuman',
    isi: '',
    coverImage: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.isi) {
      setActionStatus({ message: 'Judul dan isi berita harus diisi', type: 'error' });
      setTimeout(() => setActionStatus(null), 3000);
      return;
    }

    addNews(formData);
    setActionStatus({ message: 'Berita berhasil dipublikasikan', type: 'success' });
    setTimeout(() => setActionStatus(null), 3000);
    setFormData({ 
      judul: '', 
      kategori: 'pengumuman', 
      isi: '', 
      coverImage: ''
    });
  };

  const newsList = data.news.filter(n => n.kategori !== 'kegiatan');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Berita & Blog</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Kelola publikasi berita dan artikel organisasi</p>
        </div>
        <AnimatePresence>
          {actionStatus && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-xl ${
                actionStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
              }`}
            >
              {actionStatus.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-ios rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-6 lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Posting Berita Baru</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Berita</label>
              <input
                type="text"
                required
                value={formData.judul}
                onChange={(e) => setFormData({...formData, judul: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-himars-peach focus:border-himars-peach"
                placeholder="Masukkan judul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-himars-peach focus:border-himars-peach"
              >
                <option value="kegiatan">Kegiatan</option>
                <option value="pengumuman">Pengumuman</option>
                <option value="prestasi">Prestasi</option>
                <option value="info">Info Umum</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Isi Berita</label>
              <div className="glass-ios">
                <JoditEditor
                  ref={editor}
                  value={formData.isi}
                  config={config}
                  onBlur={newContent => setFormData({...formData, isi: newContent})}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Foto Sampul (Horizontal)</label>
                {formData.coverImage ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video mb-2 border border-slate-200">
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
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500">Upload Cover</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-himars-peach text-white rounded-lg hover:bg-himars-peach/90 font-medium transition-colors mt-2"
            >
              Publikasikan
            </button>
          </form>
        </div>

        <div className="glass-ios rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Daftar Berita</h2>
          
          {newsList.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-500">Belum ada berita yang dipublikasikan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newsList.map((news) => (
                <div key={news.id} className="bg-slate-50 rounded-xl border border-slate-100 p-5 hover:border-himars-peach/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{news.judul}</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setItemToDelete(news.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-slate-500 mb-3 space-x-4">
                    <span className="capitalize bg-himars-peach/10 text-himars-peach px-2 py-0.5 rounded font-medium">
                      {news.kategori}
                    </span>
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {news.tanggal}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {news.waktu}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {news.isi.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          if (itemToDelete) {
            deleteNews(itemToDelete);
            setActionStatus({ message: 'Berita berhasil dihapus', type: 'success' });
            setTimeout(() => setActionStatus(null), 3000);
          }
        }}
        title="Hapus Berita"
        message="Apakah Anda yakin ingin menghapus berita ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
