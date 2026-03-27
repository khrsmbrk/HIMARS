import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Upload, Trash2, Download, File, Image as ImageIcon, FileVideo, FileText } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';

export default function DokumenAdmin() {
  const { data, addDokumen, deleteDokumen, toggleDokumenPublic } = useData();
  const [kategori, setKategori] = useState('umum');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        addDokumen({
          nama: file.name,
          tipe: file.type,
          ukuran: file.size,
          kategori,
          url: event.target?.result as string
        });
      };
      
      reader.readAsDataURL(file);
    }
    
    e.target.value = '';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-orange-500" />;
    if (type.startsWith('video/')) return <FileVideo className="w-8 h-8 text-purple-500" />;
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dokumen</h1>
        <p className="text-slate-500 mt-1">Kelola dokumen dan file organisasi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-ios rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-6 lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Upload Dokumen</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="umum">Umum</option>
                <option value="laporan">Laporan</option>
                <option value="proposal">Proposal</option>
                <option value="notulen">Notulen</option>
                <option value="media">Media</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="flex justify-center w-full h-32 px-4 transition glass-ios border-2 border-slate-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-emerald-500 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="font-medium text-slate-600">
                    Pilih file atau drag & drop
                  </span>
                </span>
                <input 
                  type="file" 
                  name="file_upload" 
                  className="hidden" 
                  multiple
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls,.doc,.docx,.pdf,.jpg,.jpeg,.png,.mp4,.mov"
                />
              </label>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Mendukung PDF, Word, Excel, Gambar, dan Video
              </p>
            </div>
          </div>
        </div>

        <div className="glass-ios rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Daftar Dokumen</h2>
          
          {data.dokumen.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <File className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Belum ada dokumen yang diupload</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.dokumen.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-500/30 transition-colors group">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="p-2 glass-ios rounded-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 shrink-0">
                      {getFileIcon(doc.tipe)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{doc.nama}</h3>
                      <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                        <span className="capitalize bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                          {doc.kategori}
                        </span>
                        <span>•</span>
                        <span>{(doc.ukuran / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{doc.tanggal}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleDokumenPublic(doc.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        doc.isPublic 
                          ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' 
                          : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                      title={doc.isPublic ? "Jadikan Internal" : "Publikasikan ke Website"}
                    >
                      {doc.isPublic ? <FileText className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    </button>
                    <a 
                      href={doc.url} 
                      download={doc.nama}
                      className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => {
                        setItemToDelete(doc.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
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
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          if (itemToDelete) {
            deleteDokumen(itemToDelete);
          }
        }}
        title="Hapus Dokumen"
        message="Apakah Anda yakin ingin menghapus dokumen ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
