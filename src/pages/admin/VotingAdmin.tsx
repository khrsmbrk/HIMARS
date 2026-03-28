import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Vote, Plus, Search, Trash2, Edit2, Play, CheckCircle, Clock, Users, BarChart2, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import ConfirmModal from '../../components/ConfirmModal';

export default function VotingAdmin() {
  const { data, addVotingSession, updateVotingStatus, deleteVotingSession } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [liveChartSession, setLiveChartSession] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    judul: '',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date().toISOString().split('T')[0],
    status: 'Belum Mulai' as 'Belum Mulai' | 'Aktif' | 'Selesai',
    kodeAkses: '',
    nimTerdaftarInput: '',
    kandidat: [] as { id: number; nama: string; foto: string; visi: string; misi: string; jumlahSuara: number }[]
  });

  const [newKandidat, setNewKandidat] = useState({ nama: '', foto: '', visi: '', misi: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewKandidat({ ...newKandidat, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddKandidat = () => {
    if (newKandidat.nama && newKandidat.foto) {
      setFormData({
        ...formData,
        kandidat: [{ ...newKandidat, id: Date.now(), jumlahSuara: 0 }, ...formData.kandidat]
      });
      setNewKandidat({ nama: '', foto: '', visi: '', misi: '' });
    }
  };

  const handleRemoveKandidat = (id: number) => {
    setFormData({
      ...formData,
      kandidat: formData.kandidat.filter(k => k.id !== id)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.kandidat.length < 2) {
      alert('Minimal harus ada 2 kandidat untuk melakukan voting.');
      return;
    }

    const nimList = formData.nimTerdaftarInput
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    addVotingSession({
      ...formData,
      nimTerdaftar: nimList
    });
    setShowAdd(false);
    setFormData({
      judul: '',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: new Date().toISOString().split('T')[0],
      status: 'Belum Mulai',
      kodeAkses: '',
      nimTerdaftarInput: '',
      kandidat: []
    });
  };

  const filteredVoting = data.voting.filter(item => 
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const liveSession = liveChartSession ? data.voting.find(v => v.id === liveChartSession) : null;
  const CHART_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  
  const chartData = liveSession ? liveSession.kandidat.map((k, idx) => ({
    name: `Paslon ${idx + 1}`,
    kandidat: k.nama,
    foto: k.foto,
    suara: k.jumlahSuara,
    fill: CHART_COLORS[idx % CHART_COLORS.length]
  })) : [];

  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const kandidat = chartData.find(c => c.name === payload.value);
    const totalSuara = liveSession?.kandidat.reduce((sum, k) => sum + k.jumlahSuara, 0) || 0;
    const percentage = totalSuara > 0 ? Math.round((kandidat?.suara || 0) / totalSuara * 100) : 0;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x="-50" y="10" width="100" height="120">
          <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col items-center justify-center">
            {kandidat?.foto ? (
              <img src={kandidat.foto || undefined} alt={kandidat.kandidat} className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 mb-2" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-200 mb-2 flex items-center justify-center text-[10px] text-slate-400">Foto</div>
            )}
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center leading-tight">{payload.value}</span>
            <span className="text-sm font-black text-himars-dark mt-1">{percentage}%</span>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Sistem E-Voting</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Kelola Pemilihan Raya Ketua Himpunan</p>
        </div>
      </div>

      <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari sesi pemilihan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="w-full md:w-auto px-6 py-3 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-himars-dark/90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buat Sesi Pemilihan
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {filteredVoting.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-bold">Belum ada sesi pemilihan yang dibuat</div>
          ) : (
            filteredVoting.map((item) => {
              const totalSuara = item.kandidat.reduce((sum, k) => sum + k.jumlahSuara, 0);
              
              return (
                <div key={item.id} className="bg-white/50 rounded-[2rem] border border-white/60 p-8 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                    <div>
                      <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-2">{item.judul}</h3>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4" /> {item.tanggalMulai} s/d {item.tanggalSelesai}
                      </p>
                      {item.kodeAkses && (
                        <p className="text-xs font-bold text-himars-peach flex items-center gap-2">
                          Kode Akses Acara: <span className="font-mono bg-himars-peach/10 px-2 py-0.5 rounded">{item.kodeAkses}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Suara Masuk</p>
                        <p className="text-xl font-black text-himars-dark">{totalSuara} Suara</p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                        item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Aktif' ? 'bg-orange-100 text-orange-700 animate-pulse' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status === 'Belum Mulai' && <Clock className="w-4 h-4" />}
                        {item.status === 'Aktif' && <Play className="w-4 h-4" />}
                        {item.status === 'Selesai' && <CheckCircle className="w-4 h-4" />}
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {item.kandidat.map((k, idx) => {
                      const percentage = totalSuara > 0 ? Math.round((k.jumlahSuara / totalSuara) * 100) : 0;
                      return (
                        <div key={k.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-himars-peach/5 rounded-bl-full -z-10"></div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                              {k.foto && <img src={k.foto || undefined} alt={k.nama} className="w-12 h-12 rounded-full object-cover border border-slate-200" />}
                              <div>
                                <span className="text-[10px] font-black text-himars-peach uppercase tracking-widest mb-1 block">Paslon {idx + 1}</span>
                                <h4 className="text-lg font-black text-himars-dark uppercase">{k.nama}</h4>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-black text-himars-dark">{percentage}%</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{k.jumlahSuara} Suara</p>
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                            <div className="bg-himars-peach h-2.5 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-slate-600"><span className="font-bold">Visi:</span> {k.visi}</p>
                            <p className="text-xs text-slate-600"><span className="font-bold">Misi:</span> {k.misi}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button onClick={() => setLiveChartSession(item.id)} className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      <BarChart2 className="w-4 h-4" /> Live Chart
                    </button>
                    {item.status === 'Belum Mulai' && (
                      <button onClick={() => updateVotingStatus(item.id, 'Aktif')} className="flex items-center gap-2 px-6 py-3 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <Play className="w-4 h-4" /> Mulai Voting
                      </button>
                    )}
                    {item.status === 'Aktif' && (
                      <button onClick={() => updateVotingStatus(item.id, 'Selesai')} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <CheckCircle className="w-4 h-4" /> Hentikan Voting
                      </button>
                    )}
                    <button 
                      onClick={() => { 
                        setItemToDelete(item.id);
                        setIsDeleteModalOpen(true);
                      }} 
                      className="flex items-center gap-2 px-6 py-3 text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Tambah */}
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
              <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-6">Buat Sesi Pemilihan</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Judul Pemilihan</label>
                    <input type="text" required value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" placeholder="Contoh: Pemilihan Ketua HIMARS 2026/2027" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kode Akses Acara (Opsional)</label>
                    <input type="text" value={formData.kodeAkses} onChange={e => setFormData({...formData, kodeAkses: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-mono font-bold text-sm uppercase" placeholder="Contoh: HIMARS2026" />
                    <p className="text-[10px] text-slate-500 mt-1">Jika diisi, pemilih harus memasukkan kode ini sebelum bisa melihat kandidat dan memilih.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tgl Mulai</label>
                      <input type="date" required value={formData.tanggalMulai} onChange={e => setFormData({...formData, tanggalMulai: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tgl Selesai</label>
                      <input type="date" required value={formData.tanggalSelesai} onChange={e => setFormData({...formData, tanggalSelesai: e.target.value})} className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-black text-himars-dark uppercase tracking-widest mb-4">Daftar Pemilih (NIM)</h4>
                  <p className="text-[10px] text-slate-500 mb-2">Masukkan NIM mahasiswa yang berhak memilih. Pisahkan dengan koma atau baris baru. (Sistem One Vote One NIM)</p>
                  <textarea 
                    value={formData.nimTerdaftarInput} 
                    onChange={e => setFormData({...formData, nimTerdaftarInput: e.target.value})} 
                    className="w-full px-4 py-3 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-mono font-bold text-sm min-h-[120px]" 
                    placeholder="123456789&#10;987654321&#10;112233445" 
                  />
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-black text-himars-dark uppercase tracking-widest mb-4">Daftar Kandidat (Minimal 2)</h4>
                  
                  {formData.kandidat.map((k, idx) => (
                    <div key={k.id} className="bg-slate-50 p-4 rounded-2xl mb-4 relative pr-16">
                      <button type="button" onClick={() => handleRemoveKandidat(k.id)} className="absolute top-4 right-4 p-2.5 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 rounded-xl transition-colors shadow-sm">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <p className="text-[10px] font-black text-himars-peach uppercase tracking-widest mb-2">Kandidat {idx + 1}</p>
                      <p className="font-bold text-sm">{k.nama}</p>
                      {k.foto && <img src={k.foto || undefined} alt={k.nama} className="w-12 h-12 rounded-full object-cover mt-2 border border-slate-200" />}
                    </div>
                  ))}

                  <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Kandidat</label>
                        <input type="text" value={newKandidat.nama} onChange={e => setNewKandidat({...newKandidat, nama: e.target.value})} className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Foto Kandidat</label>
                        <div className="flex items-center gap-4">
                          {newKandidat.foto ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                              <img src={newKandidat.foto || undefined} alt="Preview" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setNewKandidat({...newKandidat, foto: ''})}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="w-12 h-12 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-himars-peach hover:bg-himars-peach/5 transition-all shrink-0">
                              <Upload className="w-4 h-4 text-slate-400" />
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                          )}
                          <span className="text-xs text-slate-500 font-medium">Upload foto dari perangkat (Maks 2MB)</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Visi</label>
                      <textarea value={newKandidat.visi} onChange={e => setNewKandidat({...newKandidat, visi: e.target.value})} className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm min-h-[80px]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Misi</label>
                      <textarea value={newKandidat.misi} onChange={e => setNewKandidat({...newKandidat, misi: e.target.value})} className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm min-h-[80px]" />
                    </div>
                    <button type="button" onClick={handleAddKandidat} className="w-full py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> KANDIDAT
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all mt-8">Simpan Sesi Pemilihan</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Live Chart */}
      <AnimatePresence>
        {liveSession && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl h-[85vh] flex flex-col bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl"
            >
              <button 
                onClick={() => setLiveChartSession(null)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
              >
                Tutup <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-black text-himars-dark uppercase tracking-tight mb-4">{liveSession.judul}</h2>
                <div className="flex items-center justify-center gap-4">
                  <span className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-himars-peach/10 text-himars-peach flex items-center gap-2 border border-himars-peach/20">
                    <span className="w-2 h-2 rounded-full bg-himars-peach animate-pulse"></span>
                    Live Result
                  </span>
                  <span className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                    Total Suara: {liveSession.kandidat.reduce((sum, k) => sum + k.jumlahSuara, 0)}
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-slate-50 rounded-[2rem] border border-slate-100 p-8 md:p-12">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={<CustomXAxisTick />} 
                      axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 14, fontWeight: 'bold' }}
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', color: '#0f172a', padding: '12px 20px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold', fontSize: '16px' }}
                      formatter={(value: number, name: string, props: any) => {
                        const totalSuara = liveSession?.kandidat.reduce((sum, k) => sum + k.jumlahSuara, 0) || 0;
                        const percentage = totalSuara > 0 ? Math.round((value / totalSuara) * 100) : 0;
                        return [
                          `${value} Suara (${percentage}%)`, 
                          props.payload.kandidat
                        ];
                      }}
                      labelStyle={{ color: 'rgba(0,0,0,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
                    />
                    <Bar dataKey="suara" radius={[16, 16, 0, 0]} maxBarSize={120}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
        onConfirm={() => {
          if (itemToDelete) {
            deleteVotingSession(itemToDelete);
          }
        }}
        title="Hapus Sesi Voting"
        message="Apakah Anda yakin ingin menghapus sesi voting ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
