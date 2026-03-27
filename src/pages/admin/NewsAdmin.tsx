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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'pengumuman',
    isi: '',
    coverImage: '',
    tanggal: '',
    waktu: ''
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

    const newsData = { ...formData };
    if (!newsData.tanggal) {
      newsData.tanggal = new Date().toLocaleDateString('id-ID');
    } else {
      // Convert YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = newsData.tanggal.split('-');
      newsData.tanggal = `${day}/${month}/${year}`;
    }
    
    if (!newsData.waktu) {
      newsData.waktu = new Date().toLocaleTimeString('id-ID');
    }

    addNews(newsData);
    setActionStatus({ message: 'Berita berhasil dipublikasikan', type: 'success' });
    setTimeout(() => setActionStatus(null), 3000);
    setFormData({ 
      judul: '', 
      kategori: 'pengumuman', 
      isi: '', 
      coverImage: '',
      tanggal: '',
      waktu: ''
    });
  };

  const newsList = data.news.filter(n => n.kategori !== 'kegiatan');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Berita & Blog</h1>
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Masukkan judul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Foto Thumbnail / Sampul (Horizontal)</label>
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
                    <span className="text-xs text-slate-500">Upload Thumbnail / Cover</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jadwal Publish (Tanggal)</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Kosongkan untuk publish sekarang</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jadwal Publish (Waktu)</label>
                  <input
                    type="time"
                    value={formData.waktu}
                    onChange={(e) => setFormData({...formData, waktu: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="w-1/3 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
              >
                Preview
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-500/90 font-medium transition-colors"
              >
                Publikasikan
              </button>
            </div>
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
                <div key={news.id} className="bg-slate-50 rounded-xl border border-slate-100 p-5 hover:border-emerald-500/30 transition-colors">
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
                    <span className="capitalize bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-medium">
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

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900">Preview Berita</h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                      {formData.kategori || 'Kategori'}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
                      {formData.judul || 'Judul Berita'}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formData.tanggal || new Date().toLocaleDateString('id-ID')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formData.waktu || new Date().toLocaleTimeString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {formData.coverImage && (
                    <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
                      <img 
                        src={formData.coverImage} 
                        alt={formData.judul}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div 
                    className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-emerald-500 hover:prose-a:text-emerald-500/80 prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: formData.isi || '<p class="text-slate-400 italic">Isi berita akan tampil di sini...</p>' }}
                  />
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                >
                  Tutup Preview
                </button>
                <button
                  onClick={(e) => {
                    setIsPreviewOpen(false);
                    handleSubmit(e);
                  }}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-500/90 transition-colors"
                >
                  Publikasikan Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
