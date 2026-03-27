import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { QRCodeCanvas } from 'qrcode.react';
import { Plus, Trash2, QrCode, X, Printer, Download, UserPlus, Search, MessageCircle, Edit2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../../components/ConfirmModal';

export default function Anggota() {
  const { data, addAnggota, deleteAnggota, updateAnggota } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [selectedAnggota, setSelectedAnggota] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [actionStatus, setActionStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    id: 0,
    nama: '',
    nim: '',
    jabatan: 'Anggota',
    departemen: '',
    angkatan: new Date().getFullYear().toString(),
    divisi: '',
    noHp: '',
    status: 'Aktif' as const,
    foto: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalDepartemen = formData.departemen;
    const bphRoles = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara'];
    if (bphRoles.includes(formData.jabatan)) {
      finalDepartemen = 'Badan Pengurus Harian (BPH)';
    }

    const anggotaData = { ...formData, departemen: finalDepartemen };

    if (isEditModalOpen) {
      updateAnggota(anggotaData);
      setIsEditModalOpen(false);
      setActionStatus({ message: 'Data anggota diperbarui', type: 'success' });
    } else {
      addAnggota(anggotaData);
      setIsAddModalOpen(false);
      setActionStatus({ message: 'Anggota baru ditambahkan', type: 'success' });
    }

    setTimeout(() => setActionStatus(null), 3000);
    setFormData({ 
      id: 0,
      nama: '', 
      nim: '', 
      jabatan: 'Anggota', 
      departemen: '',
      angkatan: new Date().getFullYear().toString(),
      divisi: '',
      noHp: '',
      status: 'Aktif',
      foto: ''
    });
  };

  const handleEdit = (anggota: any) => {
    setFormData({
      id: anggota.id,
      nama: anggota.nama,
      nim: anggota.nim,
      jabatan: anggota.jabatan,
      departemen: anggota.departemen,
      angkatan: anggota.angkatan,
      divisi: anggota.divisi || '',
      noHp: anggota.noHp || '',
      status: anggota.status,
      foto: anggota.foto || ''
    });
    setIsEditModalOpen(true);
  };

  const bphRoles = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara'];
  const isBph = bphRoles.includes(formData.jabatan);

  const showQR = (anggota: any) => {
    setSelectedAnggota(anggota);
    setIsQRModalOpen(true);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR-${selectedAnggota.nama}.png`;
      a.click();
    }
  };

  const printCard = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // Standard ID card size
    });

    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    const qrImage = canvas.toDataURL('image/png');

    // Background
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, 85.6, 54, 'F');

    // Accent
    doc.setFillColor(249, 168, 117); // himars-peach
    doc.rect(0, 0, 2, 54, 'F');

    // Logo Placeholder (Text for now)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('HIMARS UMLA', 6, 8);
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('ADMINISTRASI RUMAH SAKIT', 6, 11);

    // QR Code
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(55, 12, 25, 25, 2, 2, 'F');
    doc.addImage(qrImage, 'PNG', 56, 13, 23, 23);

    // Member Info
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(selectedAnggota.nama.toUpperCase(), 6, 25);

    doc.setTextColor(249, 168, 117);
    doc.setFontSize(8);
    doc.text(selectedAnggota.nim, 6, 30);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(selectedAnggota.jabatan, 6, 35);

    // Footer
    doc.setFontSize(5);
    doc.setTextColor(100, 100, 100);
    doc.text('KARTU ANGGOTA RESMI HIMARS UMLA', 6, 50);

    doc.save(`KARTU-${selectedAnggota.nim}.pdf`);
  };

  const getJabatanWeight = (jabatan: string) => {
    const j = jabatan.toLowerCase();
    if (j === 'ketua') return 1;
    if (j === 'wakil ketua') return 2;
    if (j === 'sekretaris') return 3;
    if (j === 'bendahara') return 4;
    if (j === 'kepala departemen' || j === 'ketua departemen') return 5;
    if (j === 'sekretaris departemen') return 6;
    if (j === 'bendahara departemen') return 7;
    return 8; // Anggota
  };

  const sortedAnggota = [...data.anggota].sort((a, b) => {
    const weightA = getJabatanWeight(a.jabatan);
    const weightB = getJabatanWeight(b.jabatan);
    
    if (weightA !== weightB) {
      return weightA - weightB;
    }
    
    const depA = a.departemen || '';
    const depB = b.departemen || '';
    if (depA !== depB) {
      return depA.localeCompare(depB);
    }
    
    return b.id - a.id;
  });

  const filteredAnggota = sortedAnggota.filter(a => 
    a.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.nim.includes(searchQuery) ||
    a.jabatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendWhatsApp = (noHp: string, nama: string) => {
    const message = encodeURIComponent(`Halo ${nama}, ada informasi penting dari HIMARS UMLA...`);
    window.open(`https://wa.me/${noHp.replace(/^0/, '62')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Database Anggota</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manajemen Sumber Daya Organisasi</p>
        </div>
        <div className="flex items-center gap-4 relative">
          <AnimatePresence>
            {actionStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute -top-12 right-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-xl z-50 ${
                  actionStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                }`}
              >
                {actionStatus.message}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari anggota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 glass-ios border border-white/40 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-himars-peach shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-himars-dark text-white rounded-2xl hover:bg-slate-800 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-slate-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            ANGGOTA
          </button>
        </div>
      </div>

      <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Lengkap</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">NIM</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Angkatan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jabatan / Divisi</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No. HP</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnggota.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-slate-200 mb-4" />
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Tidak ada data ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAnggota.map((anggota) => (
                  <tr key={anggota.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {anggota.foto ? (
                          <img src={anggota.foto} alt={anggota.nama} className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-himars-dark group-hover:bg-himars-peach group-hover:text-white transition-colors">
                            {anggota.nama.charAt(0)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-black text-himars-dark uppercase tracking-tight">{anggota.nama}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-mono text-slate-400">{anggota.nim}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{anggota.angkatan}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-himars-peach/10 text-himars-peach w-fit">
                          {anggota.jabatan}
                        </span>
                        {(anggota.divisi || anggota.departemen) && (
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            {anggota.divisi || anggota.departemen}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-600">{anggota.noHp || '-'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        anggota.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {anggota.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button
                        onClick={() => sendWhatsApp(anggota.noHp, anggota.nama)}
                        className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(anggota)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => showQR(anggota)}
                        className="p-2.5 text-slate-400 hover:text-himars-green hover:bg-himars-green/10 rounded-xl transition-all"
                        title="Lihat QR & Cetak Kartu"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(anggota.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <div>
                  <h3 className="text-xl font-black text-himars-dark uppercase tracking-tight">
                    {isEditModalOpen ? 'Edit Anggota' : 'Tambah Anggota'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                    {isEditModalOpen ? 'Perbarui Data Mahasiswa' : 'Input Data Mahasiswa Baru'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }} 
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={e => setFormData({...formData, nama: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">NIM</label>
                    <input
                      type="text"
                      required
                      value={formData.nim}
                      onChange={e => setFormData({...formData, nim: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Angkatan</label>
                    <input
                      type="text"
                      required
                      value={formData.angkatan}
                      onChange={e => setFormData({...formData, angkatan: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">No. HP / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={formData.noHp}
                      onChange={e => setFormData({...formData, noHp: e.target.value})}
                      placeholder="0812..."
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Jabatan</label>
                    <select
                      value={formData.jabatan}
                      onChange={e => setFormData({...formData, jabatan: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm appearance-none"
                    >
                      <option value="Ketua">Ketua</option>
                      <option value="Wakil Ketua">Wakil Ketua</option>
                      <option value="Sekretaris">Sekretaris</option>
                      <option value="Bendahara">Bendahara</option>
                      <option value="Kepala Departemen">Kepala Departemen</option>
                      <option value="Sekretaris Departemen">Sekretaris Departemen</option>
                      <option value="Bendahara Departemen">Bendahara Departemen</option>
                      <option value="Anggota">Anggota</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm appearance-none"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non-aktif">Non-aktif</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Departemen (BPH)</label>
                    <input
                      type="text"
                      required={!isBph}
                      disabled={isBph}
                      value={isBph ? 'Badan Pengurus Harian (BPH)' : formData.departemen}
                      onChange={e => setFormData({...formData, departemen: e.target.value})}
                      placeholder="Contoh: PENAK, Litbang, dll"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Divisi (Opsional)</label>
                    <input
                      type="text"
                      value={formData.divisi}
                      onChange={e => setFormData({...formData, divisi: e.target.value})}
                      placeholder="Contoh: Humas, Kreatif, dll"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Foto Profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({...formData, foto: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-himars-peach file:text-white hover:file:bg-orange-600"
                  />
                  {formData.foto && (
                    <div className="mt-2">
                      <img src={formData.foto} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    {isEditModalOpen ? 'Simpan Perubahan' : 'Simpan & Generate QR'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {isQRModalOpen && selectedAnggota && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-ios rounded-[3rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 w-full max-w-sm overflow-hidden text-center"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-black text-himars-dark uppercase tracking-tight">Kartu Anggota</h3>
                <button onClick={() => setIsQRModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="p-10 flex flex-col items-center">
                <div className="glass-ios p-6 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 mb-8 inline-block relative group">
                  <QRCodeCanvas 
                    id="qr-canvas"
                    value={selectedAnggota.qrCode} 
                    size={200}
                    level="H"
                    fgColor="#1a1a1a"
                  />
                  <div className="absolute inset-0 bg-himars-peach/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-himars-peach animate-pulse" />
                  </div>
                </div>
                <h4 className="font-black text-himars-dark text-2xl uppercase tracking-tight">{selectedAnggota.nama}</h4>
                <p className="text-himars-peach font-bold uppercase tracking-widest text-xs mt-1 mb-8">{selectedAnggota.nim}</p>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    onClick={downloadQR}
                    className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                  >
                    <Download className="w-4 h-4" /> PNG
                  </button>
                  <button
                    onClick={printCard}
                    className="flex items-center justify-center gap-2 py-4 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    <Printer className="w-4 h-4" /> Cetak PDF
                  </button>
                </div>
              </div>
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
            deleteAnggota(itemToDelete);
            setActionStatus({ message: 'Anggota berhasil dihapus', type: 'success' });
            setTimeout(() => setActionStatus(null), 3000);
          }
        }}
        title="Hapus Anggota"
        message="Apakah Anda yakin ingin menghapus anggota ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
