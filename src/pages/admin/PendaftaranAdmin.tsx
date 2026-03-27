import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Pendaftaran, FormSettings, FormField } from '../../store/DataContext';
import { Search, Edit2, Trash2, Eye, Download, Calendar, CheckCircle, XCircle, FileText, Settings, ArrowLeft, Plus, GripVertical, Paperclip, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmModal from '../../components/ConfirmModal';
import { storage } from '../../utils/storage';

const EVENT_CATEGORIES = [
  'Open Recruitment Pengurus HIMARS',
  'LKMM Pra-TD',
  'LKMM TD',
  'LKMM TM',
  'LKMM TL',
  'PPK ORMAWA',
  'P2MW',
  'PKM',
  'Lainnya'
];

export default function PendaftaranAdmin() {
  const { data, updatePendaftaranStatus, deletePendaftaran, addAnggota, addUser, addActivityLog, updateFormSettings } = useData();
  const [activeTab, setActiveTab] = useState<'data' | 'pengaturan'>('data');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingPendaftar, setViewingPendaftar] = useState<Pendaftaran | null>(null);
  
  // Settings Form State
  const [formSettingsState, setFormSettingsState] = useState<FormSettings>(data.formSettings);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState<number | null>(null);

  const currentUser = storage.get('currentUser', { nama: 'Unknown', id: 'unknown', username: 'unknown' });

  // --- Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedFieldIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag image slightly transparent
    if (e.target instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.target, 20, 20);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedFieldIndex === null || draggedFieldIndex === index) return;

    const newFields = [...formSettingsState.fields];
    const draggedItem = newFields[draggedFieldIndex];
    
    // Remove the item from its original position
    newFields.splice(draggedFieldIndex, 1);
    // Insert it at the new position
    newFields.splice(index, 0, draggedItem);

    setFormSettingsState({ ...formSettingsState, fields: newFields });
    setDraggedFieldIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedFieldIndex(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormSettings(formSettingsState);
    addActivityLog({
      userId: currentUser.id,
      username: currentUser.username,
      nama: currentUser.nama,
      action: 'Update Pengaturan Form',
      details: 'Memperbarui pengaturan form pendaftaran'
    });
    alert('Pengaturan form berhasil disimpan!');
  };

  const addField = () => {
    const newField: FormField = {
      id: `f${Date.now()}`,
      label: 'Pertanyaan Baru',
      type: 'text',
      required: false
    };
    setFormSettingsState(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormSettingsState(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const removeField = (id: string) => {
    setFormSettingsState(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== id)
    }));
  };

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        dataUrl: reader.result as string
      };
      setFormSettingsState(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), newAttachment]
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = (id: string) => {
    setFormSettingsState(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(a => a.id !== id)
    }));
  };

  const handleDeletePendaftarClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      const pendaftar = data.pendaftaran.find(p => p.id === itemToDelete);
      if (pendaftar) {
        deletePendaftaran(itemToDelete);
        addActivityLog({
          userId: currentUser.id,
          username: currentUser.username,
          nama: currentUser.nama,
          action: 'Hapus Pendaftar',
          details: `Menghapus pendaftar: ${pendaftar.namaLengkap}`
        });
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleStatusChange = (id: number, newStatus: Pendaftaran['status']) => {
    const pendaftar = data.pendaftaran.find(p => p.id === id);
    if (!pendaftar) return;

    updatePendaftaranStatus(id, newStatus);
    
    addActivityLog({
      userId: currentUser.id,
      username: currentUser.username,
      nama: currentUser.nama,
      action: 'Update Status Pendaftaran',
      details: `Mengubah status ${pendaftar.namaLengkap} menjadi ${newStatus}`
    });

    if (newStatus === 'Diterima') {
      const newAnggota = {
        nama: pendaftar.namaLengkap,
        nim: pendaftar.nim,
        angkatan: pendaftar.angkatan,
        noHp: pendaftar.noHp,
        jabatan: 'Anggota',
        divisi: 'Belum Ditentukan',
        status: 'Aktif' as const,
        qrCode: `HIMARS-${pendaftar.nim}`
      };
      
      addAnggota(newAnggota);
      
      if (pendaftar.email && pendaftar.password) {
        addUser({
          username: pendaftar.email,
          password: pendaftar.password,
          nama: pendaftar.namaLengkap,
          role: 'user',
          department: 'Anggota'
        });
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Nama Lengkap', 'NIM', 'Angkatan', 'No HP', 'Tanggal Daftar', 'Status', 'Kategori Event'];
    const csvData = data.pendaftaran.map(p => [
      p.namaLengkap,
      p.nim,
      p.angkatan,
      p.noHp,
      new Date(p.tanggalDaftar).toLocaleDateString('id-ID'),
      p.status,
      p.eventCategory || 'Lainnya'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_pendaftar_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPendaftaran = data.pendaftaran.filter(p => 
    p.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nim.includes(searchQuery)
  );

  return (
    <div className="p-4 sm:p-8 w-full mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pendaftaran</h1>
          <p className="text-slate-500 mt-1">Kelola data pendaftar dan jadwal open recruitment</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'data' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Data Pendaftar
          </button>
          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'pengaturan' 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pengaturan Form
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'data' && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau NIM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Pendaftar</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Kategori</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Kontak</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Tanggal</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPendaftaran.map((pendaftar) => (
                    <tr key={pendaftar.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{pendaftar.namaLengkap}</div>
                        <div className="text-xs text-slate-500">{pendaftar.nim} • Angkatan {pendaftar.angkatan}</div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold whitespace-nowrap">
                          {pendaftar.eventCategory || 'Lainnya'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-600">{pendaftar.noHp}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-600">
                          {new Date(pendaftar.tanggalDaftar).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={pendaftar.status}
                          onChange={(e) => handleStatusChange(pendaftar.id, e.target.value as any)}
                          className={`text-xs font-bold rounded-lg px-3 py-1.5 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                            pendaftar.status === 'Diterima' ? 'bg-emerald-50 text-emerald-600' :
                            pendaftar.status === 'Tidak Lulus' ? 'bg-rose-50 text-rose-600' :
                            'bg-amber-50 text-amber-600'
                          }`}
                        >
                          <option value="Menunggu Berkas">Menunggu Berkas</option>
                          <option value="Menuju Wawancara">Menuju Wawancara</option>
                          <option value="Menunggu Pengumuman">Menunggu Pengumuman</option>
                          <option value="Diterima">Diterima</option>
                          <option value="Tidak Lulus">Tidak Lulus</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setViewingPendaftar(pendaftar)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePendaftarClick(pendaftar.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPendaftaran.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        Belum ada data pendaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'pengaturan' && (
          <motion.div
            key="pengaturan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8"
          >
            <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
              {/* General Settings */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900">Pengaturan Umum</h2>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={formSettingsState.isActive}
                        onChange={(e) => setFormSettingsState({...formSettingsState, isActive: e.target.checked})}
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${formSettingsState.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formSettingsState.isActive ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-bold text-slate-700">
                      {formSettingsState.isActive ? 'Form Aktif' : 'Form Ditutup'}
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Event</label>
                    <input
                      type="text"
                      list="event-categories"
                      value={formSettingsState.eventCategory || ''}
                      onChange={(e) => setFormSettingsState({ ...formSettingsState, eventCategory: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Pilih atau ketik kategori event..."
                    />
                    <datalist id="event-categories">
                      {EVENT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Judul Form</label>
                    <input
                      type="text"
                      required
                      value={formSettingsState.title}
                      onChange={(e) => setFormSettingsState({ ...formSettingsState, title: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Form</label>
                    <textarea
                      required
                      rows={3}
                      value={formSettingsState.description}
                      onChange={(e) => setFormSettingsState({ ...formSettingsState, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal & Waktu Buka Pendaftaran</label>
                    <input
                      type="datetime-local"
                      required
                      value={formSettingsState.startDate}
                      onChange={(e) => setFormSettingsState({ ...formSettingsState, startDate: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal & Waktu Tutup Pendaftaran</label>
                    <input
                      type="datetime-local"
                      required
                      value={formSettingsState.endDate}
                      onChange={(e) => setFormSettingsState({ ...formSettingsState, endDate: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {['Open Recruitment Pengurus HIMARS', 'LKMM Pra-TD', 'LKMM TD', 'LKMM TM', 'LKMM TL', 'PPK ORMAWA', 'P2MW', 'PKM'].includes(formSettingsState.eventCategory || '') && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal & Waktu Mulai Wawancara</label>
                        <input
                          type="datetime-local"
                          value={formSettingsState.interviewStartDate || ''}
                          onChange={(e) => setFormSettingsState({ ...formSettingsState, interviewStartDate: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal & Waktu Selesai Wawancara</label>
                        <input
                          type="datetime-local"
                          value={formSettingsState.interviewEndDate || ''}
                          onChange={(e) => setFormSettingsState({ ...formSettingsState, interviewEndDate: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal & Waktu Pengumuman</label>
                        <input
                          type="datetime-local"
                          value={formSettingsState.announcementDate || ''}
                          onChange={(e) => setFormSettingsState({ ...formSettingsState, announcementDate: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pesan Saat Form Ditutup</label>
                    <textarea
                      required
                      rows={2}
                      value={formSettingsState.teksPengumuman}
                      onChange={(e) => setFormSettingsState({ ...formSettingsState, teksPengumuman: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Builder */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900">Pertanyaan Tambahan</h2>
                  <button
                    type="button"
                    onClick={addField}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    PERTANYAAN
                  </button>
                </div>
                <p className="text-sm text-slate-500">
                  Tip: Anda dapat menambahkan beberapa pertanyaan dengan tipe "Upload File / Foto" untuk meminta pendaftar mengunggah file yang berbeda (misal: Foto Profil 4x3, Surat Kesanggupan, Bukti Screenshot IG).
                </p>

                <div className="space-y-4">
                  {formSettingsState.fields.map((field, index) => (
                    <div 
                      key={field.id} 
                      className={`p-4 bg-slate-50 rounded-xl border flex gap-4 items-start transition-all ${draggedFieldIndex === index ? 'opacity-50 border-blue-500 scale-[0.98]' : 'border-slate-200'}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="mt-2 text-slate-400 cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Pertanyaan</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Tipe Jawaban</label>
                            <select
                              value={field.type}
                              onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="text">Teks Pendek</option>
                              <option value="textarea">Paragraf</option>
                              <option value="select">Pilihan Ganda (Dropdown)</option>
                              <option value="radio">Pilihan Ganda (Radio)</option>
                              <option value="email">Email</option>
                              <option value="tel">Nomor Telepon</option>
                              <option value="file">Upload File / Foto</option>
                            </select>
                          </div>
                        </div>
                        
                        {(field.type === 'select' || field.type === 'radio') && (
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Opsi (pisahkan dengan koma)</label>
                            <input
                              type="text"
                              value={field.options?.join(', ') || ''}
                              onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                              placeholder="Opsi 1, Opsi 2, Opsi 3"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-bold text-slate-700">Wajib Diisi</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeField(field.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formSettingsState.fields.length === 0 && (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      Belum ada pertanyaan tambahan.
                    </div>
                  )}
                </div>
              </div>

              {/* Attachments Builder */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900">File Pendukung / Template</h2>
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Upload File
                    <input type="file" className="hidden" onChange={handleAddAttachment} />
                  </label>
                </div>
                <p className="text-sm text-slate-500">
                  Upload file template (seperti Surat Kesanggupan) yang wajib diunduh oleh pendaftar.
                </p>

                <div className="space-y-3">
                  {formSettingsState.attachments?.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{att.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!formSettingsState.attachments || formSettingsState.attachments.length === 0) && (
                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      Belum ada file pendukung.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Pendaftar"
        message="Apakah Anda yakin ingin menghapus data pendaftar ini? Tindakan ini tidak dapat dibatalkan."
      />

      {/* Detail Modal */}
      <AnimatePresence>
        {viewingPendaftar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-black text-slate-900">Detail Pendaftar</h3>
                <button
                  onClick={() => setViewingPendaftar(null)}
                  className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {viewingPendaftar.eventCategory && (
                    <div className="sm:col-span-2">
                      <div className="text-sm font-bold text-slate-500 mb-1">Kategori Event</div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                        {viewingPendaftar.eventCategory}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-slate-500 mb-1">Nama Lengkap</div>
                    <div className="text-slate-900 font-medium">{viewingPendaftar.namaLengkap}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-500 mb-1">NIM</div>
                    <div className="text-slate-900 font-medium">{viewingPendaftar.nim}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-500 mb-1">Email</div>
                    <div className="text-slate-900 font-medium">{viewingPendaftar.email || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-500 mb-1">No. WhatsApp</div>
                    <div className="text-slate-900 font-medium">{viewingPendaftar.noHp}</div>
                  </div>
                </div>

                {viewingPendaftar.fileUploads && viewingPendaftar.fileUploads.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    <h4 className="text-lg font-bold text-slate-900">File Pendukung</h4>
                    <div className="space-y-4">
                      {viewingPendaftar.fileUploads.map((file, idx) => (
                        <div key={idx}>
                          <div className="text-sm font-bold text-slate-500 mb-1">{file.label}</div>
                          {file.url.startsWith('data:image/') ? (
                            <div className="mt-2">
                              <img src={file.url} alt={file.label} className="max-w-xs rounded-lg shadow-sm border border-slate-200" />
                            </div>
                          ) : (
                            <div className="mt-2">
                              <a href={file.url} download={`document-${file.label}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                                <FileText className="w-4 h-4" />
                                Download File
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewingPendaftar.formDataDinamis && Object.keys(viewingPendaftar.formDataDinamis).length > 0 && (
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    <h4 className="text-lg font-bold text-slate-900">Jawaban Tambahan</h4>
                    <div className="space-y-4">
                      {Object.entries(viewingPendaftar.formDataDinamis).map(([key, value]) => {
                        const fieldLabel = data.formSettings.fields.find(f => f.id === key)?.label || key;
                        return (
                          <div key={key}>
                            <div className="text-sm font-bold text-slate-500 mb-1">{fieldLabel}</div>
                            {Array.isArray(value) ? (
                              <div className="flex flex-wrap gap-4 mt-2">
                                {value.map((v, i) => (
                                  typeof v === 'string' && v.startsWith('data:image/') ? (
                                    <img key={i} src={v} alt={`${fieldLabel} ${i + 1}`} className="max-w-xs rounded-lg shadow-sm border border-slate-200" />
                                  ) : typeof v === 'string' && v.startsWith('data:') ? (
                                    <a key={i} href={v} download={`document-${fieldLabel}-${i + 1}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                                      <FileText className="w-4 h-4" />
                                      Download File {i + 1}
                                    </a>
                                  ) : (
                                    <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-sm">{v}</span>
                                  )
                                ))}
                              </div>
                            ) : typeof value === 'string' && value.startsWith('data:image/') ? (
                              <div className="mt-2">
                                <img src={value} alt={fieldLabel} className="max-w-xs rounded-lg shadow-sm border border-slate-200" />
                              </div>
                            ) : typeof value === 'string' && value.startsWith('data:') ? (
                              <div className="mt-2">
                                <a href={value} download={`document-${fieldLabel}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                                  <FileText className="w-4 h-4" />
                                  Download File
                                </a>
                              </div>
                            ) : (
                              <div className="text-slate-900 font-medium whitespace-pre-wrap">{value || '-'}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setViewingPendaftar(null)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
