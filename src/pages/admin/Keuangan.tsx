import React, { useState } from 'react';
import { useData, KasWajib } from '../../store/DataContext';
import { Plus, Download, TrendingUp, TrendingDown, Wallet, CheckCircle2, XCircle, Calendar, Users, Trash2, ImageIcon, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ConfirmModal from '../../components/ConfirmModal';
import { kirimKeSheet } from '../../utils/kirimKeSheet';

export default function Keuangan() {
  const { data, addKeuangan, updateKasWajib, generateMonthlyKas, deleteMonthlyKas, deleteKeuangan } = useData();
  const [activeTab, setActiveTab] = useState<'transaksi' | 'kas-wajib'>('transaksi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBukti, setSelectedBukti] = useState<string | null>(null);
  
  const [actionStatus, setActionStatus] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    jenis: 'pemasukan' as 'pemasukan' | 'pengeluaran',
    kategori: 'kampus',
    programKerja: '',
    keterangan: '',
    nominal: '',
    bukti: ''
  });

  const [kasConfig, setKasConfig] = useState({
    bulan: '',
    nominal: '10000'
  });

  const totalPemasukan = data.keuangan
    .filter(k => k.jenis === 'pemasukan')
    .reduce((sum, k) => sum + k.nominal, 0);

  const totalPengeluaran = data.keuangan
    .filter(k => k.jenis === 'pengeluaran')
    .reduce((sum, k) => sum + k.nominal, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number | string, type: 'transaksi' | 'kas-bulan' } | null>(null);

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'transaksi') {
      const transactionToDelete = data.keuangan.find(k => k.id === deleteConfirm.id);
      if (transactionToDelete) {
        await kirimKeSheet({
          keterangan: transactionToDelete.keterangan,
          nominal: transactionToDelete.nominal,
          aksi: 'Hapus Transaksi'
        }, 'Keuangan');

        if (transactionToDelete.keterangan.startsWith('Bayar Kas: ')) {
          const match = transactionToDelete.keterangan.match(/Bayar Kas: (.*) \((.*)\)/);
          if (match) {
            const nama = match[1];
            const bulan = match[2];
            const anggota = data.anggota.find(a => a.nama === nama);
            if (anggota) {
              const kas = data.kasWajib.find(k => k.anggotaId === anggota.id && k.bulan === bulan);
              if (kas) {
                updateKasWajib({
                  ...kas,
                  status: 'belum',
                  tanggalBayar: undefined
                });
              }
            }
          }
        }
      }
      deleteKeuangan(deleteConfirm.id as number);
      setActionStatus({ message: 'Transaksi berhasil dihapus', type: 'success' });
    } else if (deleteConfirm.type === 'kas-bulan') {
      await kirimKeSheet({
        bulan: deleteConfirm.id,
        aksi: 'Hapus Kas Bulanan'
      }, 'Keuangan');
      deleteMonthlyKas(deleteConfirm.id as string);
      setActionStatus({ message: `Data bulan ${deleteConfirm.id} berhasil dihapus`, type: 'success' });
    }

    setDeleteConfirm(null);
    setTimeout(() => setActionStatus(null), 3000);
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keterangan || !formData.nominal) {
      setActionStatus({ message: 'Keterangan dan nominal harus diisi', type: 'error' });
      setTimeout(() => setActionStatus(null), 3000);
      return;
    }

    const nominalValue = parseFloat(formData.nominal);

    // Sync to Google Sheets
    await kirimKeSheet({
      jenis: formData.jenis,
      kategori: formData.kategori,
      keterangan: formData.keterangan,
      nominal: nominalValue,
      program_kerja: formData.programKerja
    }, 'Keuangan');

    addKeuangan({
      ...formData,
      nominal: nominalValue
    });

    setIsModalOpen(false);
    setFormData({
      jenis: 'pemasukan',
      kategori: 'kampus',
      programKerja: '',
      keterangan: '',
      nominal: '',
      bukti: ''
    });
  };

  const handleBuktiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, bukti: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    const bulan = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    doc.setFontSize(18);
    doc.text('Laporan Keuangan Bulanan', 14, 20);
    doc.setFontSize(12);
    doc.text(`HMPS ARS - ${bulan}`, 14, 28);

    doc.setFontSize(11);
    doc.text(`Total Pemasukan: ${formatRupiah(totalPemasukan)}`, 14, 40);
    doc.text(`Total Pengeluaran: ${formatRupiah(totalPengeluaran)}`, 14, 48);
    doc.text(`Saldo Akhir: ${formatRupiah(saldo)}`, 14, 56);

    let y = 70;
    doc.setFontSize(14);
    doc.text('Rincian Transaksi:', 14, y);
    y += 10;

    doc.setFontSize(10);
    data.keuangan.forEach((k, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const jenis = k.jenis === 'pemasukan' ? '+' : '-';
      doc.text(`${i + 1}. ${k.tanggal} - ${k.keterangan} - ${jenis}${formatRupiah(k.nominal)}`, 14, y);
      y += 8;
    });

    doc.save(`laporan-keuangan-${bulan}.pdf`);
  };

  const chartData = [
    {
      name: 'Keuangan',
      Pemasukan: totalPemasukan,
      Pengeluaran: totalPengeluaran,
      Saldo: saldo,
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Manajemen Keuangan</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Transparansi & Akuntabilitas Organisasi</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl relative">
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
            <button
              onClick={() => setActiveTab('transaksi')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'transaksi' ? 'glass-ios text-himars-dark shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Transaksi
            </button>
            <button
              onClick={() => setActiveTab('kas-wajib')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'kas-wajib' ? 'glass-ios text-himars-dark shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Kas Wajib
            </button>
          </div>
          {activeTab === 'transaksi' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-himars-dark text-white rounded-2xl hover:bg-slate-800 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-slate-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Transaksi
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'transaksi' ? (
          <motion.div
            key="transaksi"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-ios rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pemasukan</h3>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-600 tracking-tight">{formatRupiah(totalPemasukan)}</div>
              </div>

              <div className="glass-ios rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pengeluaran</h3>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-red-600">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-red-600 tracking-tight">{formatRupiah(totalPengeluaran)}</div>
              </div>

              <div className="glass-ios rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Akhir</h3>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-himars-peach/10 text-himars-peach">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-himars-dark tracking-tight">{formatRupiah(saldo)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">Grafik Keuangan</h2>
                  <button
                    onClick={exportPDF}
                    className="inline-flex items-center px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Ekspor PDF
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 'bold'}}
                        tickFormatter={(value) => `Rp ${value / 1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        formatter={(value: number) => formatRupiah(value)}
                      />
                      <Legend />
                      <Bar dataKey="Pemasukan" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[8, 8, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Saldo" fill="#f9a875" radius={[8, 8, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Add Transaction Modal */}
            <AnimatePresence>
              {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 w-full max-w-md overflow-hidden"
                  >
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div>
                        <h3 className="text-xl font-black text-himars-dark uppercase tracking-tight">Tambah Transaksi</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Catat Pemasukan atau Pengeluaran</p>
                      </div>
                      <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <XCircle className="w-6 h-6 text-slate-400" />
                      </button>
                    </div>
                    <form onSubmit={(e) => { handleSubmit(e); setIsAddModalOpen(false); }} className="p-8 space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Jenis</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, jenis: 'pemasukan'})}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              formData.jenis === 'pemasukan' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            Pemasukan
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, jenis: 'pengeluaran'})}
                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              formData.jenis === 'pengeluaran' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            Pengeluaran
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kategori</label>
                        <select
                          value={formData.kategori}
                          onChange={e => setFormData({...formData, kategori: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                        >
                          <option value="kampus">Dana Kampus</option>
                          <option value="sponsor">Sponsor</option>
                          <option value="sumbangan">Sumbangan / Donasi</option>
                          <option value="kaswajib">Kas Wajib Anggota</option>
                          <option value="programkerja">Program Kerja</option>
                          <option value="operasional">Operasional</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Keterangan</label>
                        <input
                          type="text"
                          required
                          value={formData.keterangan}
                          onChange={e => setFormData({...formData, keterangan: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                          placeholder="Detail transaksi"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nominal (Rp)</label>
                        <input
                          type="number"
                          required
                          value={formData.nominal}
                          onChange={e => setFormData({...formData, nominal: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bukti Transaksi (Opsional)</label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-500">Upload Gambar</span>
                            <input type="file" accept="image/*" onChange={handleBuktiUpload} className="hidden" />
                          </label>
                          {formData.bukti && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200">
                              <img src={formData.bukti || undefined} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                      >
                        Simpan Transaksi
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">Riwayat Transaksi</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Keterangan</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Nominal</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Bukti</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.keuangan.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                          Belum ada transaksi keuangan
                        </td>
                      </tr>
                    ) : (
                      data.keuangan.map((k) => (
                        <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5 text-sm font-bold text-slate-500">{k.tanggal}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              k.jenis === 'pemasukan' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {k.kategori === 'kampus' ? 'Dana Kampus' : 
                               k.kategori === 'sponsor' ? 'Sponsor' :
                               k.kategori === 'sumbangan' ? 'Donasi' :
                               k.kategori === 'kaswajib' ? 'Kas Wajib' :
                               k.kategori === 'programkerja' ? 'Proker' :
                               k.kategori === 'operasional' ? 'Operasional' : k.kategori}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-black text-himars-dark uppercase tracking-tight">{k.keterangan}</td>
                          <td className={`px-8 py-5 text-sm font-black text-right ${
                            k.jenis === 'pemasukan' ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {k.jenis === 'pemasukan' ? '+' : '-'}{formatRupiah(k.nominal)}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {k.bukti ? (
                                <button 
                                  onClick={() => setSelectedBukti(k.bukti || null)}
                                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                  title="Lihat Bukti"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              ) : (
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Tidak ada</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteConfirm({ id: k.id, type: 'transaksi' });
                              }}
                              className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors relative z-20"
                              title="Hapus Transaksi"
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
            </div>

            {/* Bukti Modal */}
            <AnimatePresence>
              {selectedBukti && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedBukti(null)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative max-w-2xl w-full glass-ios rounded-[2.5rem] p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-4 px-2">
                      <h3 className="text-sm font-black text-himars-dark uppercase tracking-widest">Bukti Transaksi</h3>
                      <div className="flex gap-2">
                        <a 
                          href={selectedBukti} 
                          download="bukti-transaksi.png"
                          className="p-2 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors"
                          title="Download Bukti"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                        <button 
                          onClick={() => setSelectedBukti(null)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center min-h-[300px]">
                      <img src={selectedBukti || undefined} alt="Bukti Transaksi" className="max-w-full max-h-[70vh] object-contain" />
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="kas-wajib"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="glass-ios rounded-[2.5rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">Generate Tagihan Masal</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Buat tagihan untuk semua anggota sekaligus</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Bulan & Tahun</label>
                    <input
                      type="text"
                      value={kasConfig.bulan}
                      onChange={e => setKasConfig({...kasConfig, bulan: e.target.value})}
                      placeholder="Januari 2024"
                      className="px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-xs w-40"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Nominal (Rp)</label>
                    <input
                      type="number"
                      value={kasConfig.nominal}
                      onChange={e => setKasConfig({...kasConfig, nominal: e.target.value})}
                      className="px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-xs w-32"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!kasConfig.bulan) {
                        setActionStatus({ message: 'Tentukan bulan terlebih dahulu', type: 'error' });
                        setTimeout(() => setActionStatus(null), 3000);
                        return;
                      }
                      generateMonthlyKas(kasConfig.bulan, parseFloat(kasConfig.nominal));
                      setActionStatus({ message: `Tagihan ${kasConfig.bulan} berhasil dibuat!`, type: 'success' });
                      setTimeout(() => setActionStatus(null), 3000);
                    }}
                    className="mt-4 md:mt-0 px-6 py-3 bg-himars-peach text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all active:scale-95"
                  >
                    Generate Sekarang
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div>
                  <h2 className="text-xl font-black text-himars-dark uppercase tracking-tight">Matrix Pembayaran Kas</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Klik kotak untuk mengubah status pembayaran</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lunas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-slate-200"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Belum</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="sticky left-0 z-10 bg-slate-50 px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 min-w-[250px]">Anggota & Jabatan</th>
                      {Array.from(new Set(data.kasWajib.map(k => k.bulan))).sort((a, b) => {
                        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                        const [monthA] = (a as string).split(' ');
                        const [monthB] = (b as string).split(' ');
                        return months.indexOf(monthA) - months.indexOf(monthB);
                      }).map(bulan => (
                        <th key={bulan} className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center min-w-[120px] group/header border-l border-slate-100/50">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span>{bulan}</span>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteConfirm({ id: bulan, type: 'kas-bulan' });
                              }}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md z-20"
                              title="Hapus Bulan"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.anggota.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-8 py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                          Belum ada data anggota.
                        </td>
                      </tr>
                    ) : (
                      data.anggota.map((anggota) => {
                        const uniqueMonths = Array.from(new Set(data.kasWajib.map(k => k.bulan))).sort((a, b) => {
                          const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                          const [monthA] = (a as string).split(' ');
                          const [monthB] = (b as string).split(' ');
                          return months.indexOf(monthA) - months.indexOf(monthB);
                        });
                        return (
                          <tr key={anggota.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="sticky left-0 z-10 glass-ios group-hover:bg-slate-50/50 px-8 py-5 border-r border-white/40">
                              <div className="font-black text-himars-dark uppercase tracking-tight text-sm">{anggota.nama}</div>
                              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                <span className="text-[10px] text-himars-green font-black uppercase tracking-widest">{anggota.jabatan}</span>
                                {anggota.departemen && (
                                  <>
                                    <span className="text-[10px] text-slate-300">•</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{anggota.departemen}</span>
                                  </>
                                )}
                              </div>
                              <div className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{anggota.nim}</div>
                            </td>
                            {uniqueMonths.map(bulan => {
                              const kas = data.kasWajib.find(k => k.anggotaId === anggota.id && k.bulan === bulan);
                              if (!kas) return <td key={bulan} className="px-4 py-5 text-center text-slate-200">-</td>;
                              
                              return (
                                <td key={bulan} className="px-4 py-5 text-center">
                                  <button
                                    onClick={async () => {
                                      const newStatus = kas.status === 'lunas' ? 'belum' : 'lunas';
                                      
                                      await kirimKeSheet({
                                        nama: anggota.nama,
                                        bulan: bulan,
                                        status: newStatus,
                                        aksi: 'Update Kas Wajib'
                                      }, 'Keuangan');

                                      updateKasWajib({ 
                                        ...kas, 
                                        status: newStatus, 
                                        tanggalBayar: newStatus === 'lunas' ? new Date().toLocaleDateString('id-ID') : undefined 
                                      });
                                      
                                      if (newStatus === 'lunas') {
                                        const alreadyExists = data.keuangan.some(k => 
                                          k.keterangan === `Bayar Kas: ${anggota.nama} (${bulan})`
                                        );
                                        
                                        if (!alreadyExists) {
                                          addKeuangan({
                                            jenis: 'pemasukan',
                                            kategori: 'kaswajib',
                                            programKerja: 'Kas Wajib',
                                            keterangan: `Bayar Kas: ${anggota.nama} (${bulan})`,
                                            nominal: kas.nominal
                                          });
                                        }
                                      } else {
                                        const existingTransaction = data.keuangan.find(k => 
                                          k.keterangan === `Bayar Kas: ${anggota.nama} (${bulan})`
                                        );
                                        if (existingTransaction) {
                                          deleteKeuangan(existingTransaction.id);
                                        }
                                      }
                                    }}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all active:scale-90 ${
                                      kas.status === 'lunas' 
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                                        : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                                    }`}
                                    title={kas.status === 'lunas' ? `Lunas pada ${kas.tanggalBayar}` : 'Klik untuk lunasi'}
                                  >
                                    {kas.status === 'lunas' ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                                  </button>
                                  <div className="mt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {formatRupiah(kas.nominal)}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus ${deleteConfirm?.type === 'transaksi' ? 'transaksi ini' : `semua data untuk bulan ${deleteConfirm?.id}`}? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
