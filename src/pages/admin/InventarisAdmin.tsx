import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Box, Plus, Search, Trash2, Edit2, Package, ArrowLeftRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../../components/ConfirmModal';

export default function InventarisAdmin() {
  const { data, addInventaris, updateInventaris, deleteInventaris, addPeminjaman, updatePeminjamanStatus } = useData();
  const [activeTab, setActiveTab] = useState<'aset' | 'peminjaman'>('aset');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAset, setShowAddAset] = useState(false);
  const [showAddPinjam, setShowAddPinjam] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [asetForm, setAsetForm] = useState({
    kodeBarang: '',
    namaBarang: '',
    kategori: 'Elektronik',
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
    jumlah: 1,
    lokasi: 'Sekretariat',
    tanggalMasuk: new Date().toISOString().split('T')[0]
  });

  const [pinjamForm, setPinjamForm] = useState({
    inventarisId: 0,
    peminjam: '',
    kontak: '',
    instansi: '',
    tanggalPinjam: new Date().toISOString().split('T')[0],
    tanggalKembali: '',
    keterangan: ''
  });

  const handleAddAset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    addInventaris(asetForm);
    setShowAddAset(false);
    setAsetForm({
      kodeBarang: '',
      namaBarang: '',
      kategori: 'Elektronik',
      kondisi: 'Baik',
      jumlah: 1,
      lokasi: 'Sekretariat',
      tanggalMasuk: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddPinjam = async (e: React.FormEvent) => {
    e.preventDefault();
    const barang = data.inventaris.find(i => i.id === pinjamForm.inventarisId);
    
    if (!barang || barang.jumlah <= 0) {
      alert('Stok barang tidak mencukupi atau barang tidak ditemukan.');
      return;
    }

    addPeminjaman({
      ...pinjamForm,
      status: 'Dipinjam'
    });
    setShowAddPinjam(false);
    setPinjamForm({
      inventarisId: 0,
      peminjam: '',
      kontak: '',
      instansi: '',
      tanggalPinjam: new Date().toISOString().split('T')[0],
      tanggalKembali: '',
      keterangan: ''
    });
  };

  const handleReturn = async (id: number) => {
    updatePeminjamanStatus(id, 'Dikembalikan');
  };

  const filteredAset = data.inventaris.filter(item => 
    item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPeminjaman = data.peminjaman.filter(item => 
    item.peminjam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instansi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Inventaris & Aset</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Kelola Barang dan Peminjaman</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('aset')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'aset' ? 'bg-himars-peach text-white shadow-lg shadow-himars-peach/20' : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" /> Data Aset
          </button>
          <button
            onClick={() => setActiveTab('peminjaman')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === 'peminjaman' ? 'bg-himars-peach text-white shadow-lg shadow-himars-peach/20' : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" /> Peminjaman
          </button>
        </div>
      </div>

      <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={`Cari ${activeTab === 'aset' ? 'aset' : 'peminjaman'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
            />
          </div>
          <button
            onClick={() => activeTab === 'aset' ? setShowAddAset(true) : setShowAddPinjam(true)}
            className="w-full md:w-auto px-6 py-3 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-himars-dark/90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> {activeTab === 'aset' ? 'ASET' : 'PEMINJAMAN'}
          </button>
        </div>

        {activeTab === 'aset' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Barang</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kondisi</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAset.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500 font-bold">Belum ada data aset</td>
                  </tr>
                ) : (
                  filteredAset.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs font-bold text-slate-500">{item.kodeBarang}</td>
                      <td className="py-4 px-4 font-bold text-himars-dark">{item.namaBarang}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{item.kategori}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          item.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-700' :
                          item.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.kondisi}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-600">{item.jumlah}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">{item.lokasi}</td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => {
                            setItemToDelete(item.id);
                            setIsDeleteModalOpen(true);
                          }} 
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Barang</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Peminjam</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Instansi</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeminjaman.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 font-bold">Belum ada data peminjaman</td>
                  </tr>
                ) : (
                  filteredPeminjaman.map((item) => {
                    const barang = data.inventaris.find(i => i.id === item.inventarisId);
                    return (
                      <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-himars-dark">{barang?.namaBarang || 'Barang Dihapus'}</td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-700">{item.peminjam}</div>
                          <div className="text-xs text-slate-500">{item.kontak}</div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">{item.instansi}</td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-slate-600"><span className="font-bold">Pinjam:</span> {item.tanggalPinjam}</div>
                          <div className="text-xs text-slate-600"><span className="font-bold">Kembali:</span> {item.tanggalKembali}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            item.status === 'Dikembalikan' ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' :
                            item.status === 'Dipinjam' ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' :
                            'bg-red-500 text-white shadow-sm shadow-red-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {item.status === 'Dipinjam' && (
                            <button 
                              onClick={() => handleReturn(item.id)}
                              className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Tandai Dikembalikan"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Aset */}
      <AnimatePresence>
        {showAddAset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddAset(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-ios rounded-[3rem] p-10 max-w-md w-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Tambah Aset</h3>
              <form onSubmit={handleAddAset} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kode Barang</label>
                  <input type="text" required value={asetForm.kodeBarang} onChange={e => setAsetForm({...asetForm, kodeBarang: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="Contoh: INV-001" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Barang</label>
                  <input type="text" required value={asetForm.namaBarang} onChange={e => setAsetForm({...asetForm, namaBarang: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kategori</label>
                    <select value={asetForm.kategori} onChange={e => setAsetForm({...asetForm, kategori: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm">
                      <option value="Elektronik">Elektronik</option>
                      <option value="ATK">ATK</option>
                      <option value="Perlengkapan">Perlengkapan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Jumlah</label>
                    <input type="number" min="1" required value={asetForm.jumlah} onChange={e => setAsetForm({...asetForm, jumlah: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all mt-4">Simpan Aset</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Tambah Peminjaman */}
      <AnimatePresence>
        {showAddPinjam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddPinjam(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass-ios rounded-[3rem] p-10 max-w-md w-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Catat Peminjaman</h3>
              <form onSubmit={handleAddPinjam} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pilih Barang</label>
                  <select required value={pinjamForm.inventarisId} onChange={e => setPinjamForm({...pinjamForm, inventarisId: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm">
                    <option value={0} disabled>Pilih Barang...</option>
                    {data.inventaris.filter(i => i.kondisi === 'Baik').map(i => (
                      <option key={i.id} value={i.id} disabled={i.jumlah <= 0}>
                        {i.namaBarang} ({i.kodeBarang}) - Stok: {i.jumlah}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Peminjam</label>
                  <input type="text" required value={pinjamForm.peminjam} onChange={e => setPinjamForm({...pinjamForm, peminjam: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Instansi/Organisasi</label>
                    <input type="text" required value={pinjamForm.instansi} onChange={e => setPinjamForm({...pinjamForm, instansi: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kontak (WA)</label>
                    <input type="text" required value={pinjamForm.kontak} onChange={e => setPinjamForm({...pinjamForm, kontak: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tgl Pinjam</label>
                    <input type="date" required value={pinjamForm.tanggalPinjam} onChange={e => setPinjamForm({...pinjamForm, tanggalPinjam: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tgl Kembali</label>
                    <input type="date" required value={pinjamForm.tanggalKembali} onChange={e => setPinjamForm({...pinjamForm, tanggalKembali: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all mt-4">Simpan Peminjaman</button>
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
            deleteInventaris(itemToDelete);
          }
        }}
        title="Hapus Barang"
        message="Apakah Anda yakin ingin menghapus barang ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
