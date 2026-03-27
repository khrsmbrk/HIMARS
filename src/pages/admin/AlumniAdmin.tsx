import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { GraduationCap, Search, Trash2, Edit2, Plus, Linkedin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../../components/ConfirmModal';

export default function AlumniAdmin() {
  const { data, addAlumni, updateAlumni, deleteAlumni } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    angkatan: '',
    tahunLulus: '',
    tahunJabatan: '',
    jabatanTerakhir: '',
    kontak: '',
    pekerjaanSekarang: '',
    linkedin: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAlumni({ ...formData, id: editingId });
    } else {
      addAlumni(formData);
    }
    setShowAdd(false);
    setEditingId(null);
    setFormData({
      nama: '',
      nim: '',
      angkatan: '',
      tahunLulus: '',
      tahunJabatan: '',
      jabatanTerakhir: '',
      kontak: '',
      pekerjaanSekarang: '',
      linkedin: ''
    });
  };

  const handleEdit = (item: any) => {
    setFormData({
      nama: item.nama,
      nim: item.nim,
      angkatan: item.angkatan || '',
      tahunLulus: item.tahunLulus || '',
      tahunJabatan: item.tahunJabatan,
      jabatanTerakhir: item.jabatanTerakhir,
      kontak: item.kontak,
      pekerjaanSekarang: item.pekerjaanSekarang,
      linkedin: item.linkedin || ''
    });
    setEditingId(item.id);
    setShowAdd(true);
  };

  const filteredAlumni = data.alumni.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tahunJabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jabatanTerakhir.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.angkatan && item.angkatan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Database Alumni</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Direktori Alumni Pengurus HIMARS</p>
        </div>
      </div>

      <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, angkatan, tahun, atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
            />
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ nama: '', nim: '', angkatan: '', tahunLulus: '', tahunJabatan: '', jabatanTerakhir: '', kontak: '', pekerjaanSekarang: '', linkedin: '' });
              setShowAdd(true);
            }}
            className="w-full md:w-auto px-6 py-3 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-himars-dark/90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> ALUMNI
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 font-bold">Belum ada data alumni pengurus</div>
          ) : (
            filteredAlumni.map((item) => (
              <div key={item.id} className="bg-white/50 rounded-[2rem] border border-white/60 p-6 hover:shadow-lg transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-himars-peach/10 rounded-bl-[4rem] -z-10 transition-transform group-hover:scale-110"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-himars-peach/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-himars-peach" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                    {item.tahunJabatan}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-black text-himars-dark uppercase tracking-tight line-clamp-1">{item.nama}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs font-bold text-slate-500">{item.nim}</p>
                    {item.angkatan && (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                        Angkatan {item.angkatan}
                      </span>
                    )}
                    {item.tahunLulus && (
                      <span className="text-[10px] font-black text-himars-peach uppercase tracking-widest bg-himars-peach/10 px-2 py-0.5 rounded-md">
                        Lulus {item.tahunLulus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jabatan Terakhir</p>
                    <p className="text-sm font-bold text-himars-dark">{item.jabatanTerakhir}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pekerjaan Saat Ini</p>
                    <p className="text-sm font-bold text-himars-green">{item.pekerjaanSekarang}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  {item.kontak && (
                    <a href={`https://wa.me/${item.kontak.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all" title="WhatsApp">
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {item.linkedin && (
                    <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all" title="LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowAdd(false); setEditingId(null); }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-ios rounded-[3rem] p-10 max-w-md w-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">{editingId ? 'Edit Alumni' : 'Tambah Alumni'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Lengkap</label>
                  <input type="text" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">NIM</label>
                    <input type="text" required value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tahun Jabatan</label>
                    <input type="text" required value={formData.tahunJabatan} onChange={e => setFormData({...formData, tahunJabatan: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="2022/2023" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Angkatan</label>
                    <input type="text" value={formData.angkatan} onChange={e => setFormData({...formData, angkatan: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="2019" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tahun Lulus</label>
                    <input type="text" value={formData.tahunLulus} onChange={e => setFormData({...formData, tahunLulus: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="2023" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Jabatan Terakhir</label>
                  <input type="text" required value={formData.jabatanTerakhir} onChange={e => setFormData({...formData, jabatanTerakhir: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="Ketua Umum" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pekerjaan Saat Ini</label>
                  <input type="text" required value={formData.pekerjaanSekarang} onChange={e => setFormData({...formData, pekerjaanSekarang: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="Staff RSUD / Wirausaha" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kontak (WA)</label>
                    <input type="text" required value={formData.kontak} onChange={e => setFormData({...formData, kontak: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">LinkedIn URL</label>
                    <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all mt-4">Simpan Data Alumni</button>
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
        onConfirm={() => {
          if (itemToDelete) {
            deleteAlumni(itemToDelete);
          }
        }}
        title="Hapus Alumni"
        message="Apakah Anda yakin ingin menghapus data alumni ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
