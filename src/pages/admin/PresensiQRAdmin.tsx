import React, { useState, useEffect } from 'react';
import { useData } from '../../store/DataContext';
import { Search, CheckCircle2, History, UserCheck, QrCode, Users, Trash2, Plus, X, Download, Printer, Camera, Edit, Calendar, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import ConfirmModal from '../../components/ConfirmModal';
import QRScanner from '../../components/QRScanner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSearchParams } from 'react-router-dom';
import { Event } from '../../store/DataContext';

export default function PresensiQRAdmin() {
  const { data, addPresensi, deletePresensi, addEvent, updateEvent, deleteEvent } = useData();
  const [searchParams] = useSearchParams();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'event' | 'presensi', id: number | string } | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Modal Presensi State
  const [isPresensiModalOpen, setIsPresensiModalOpen] = useState(false);
  const [presensiEventId, setPresensiEventId] = useState<number | null>(null);

  const getPresensiByAcara = (idAcara: string) => {
    return data.presensi.filter(p => p.idAcara === idAcara);
  };

  // Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    capacity: 0,
    status: 'Akan Datang' as Event['status']
  });

  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam) {
      const event = data.events.find(e => e.title === eventParam);
      if (event) setSelectedEventId(event.id);
    } else if (data.events.length > 0 && !selectedEventId) {
      setSelectedEventId(data.events[0].id);
    }
  }, [searchParams, data.events]);

  const selectedEvent = data.events.find(e => e.id === selectedEventId);

  const filteredPresensi = data.presensi.filter(p => {
    if (!selectedEvent) return false;
    if (p.idAcara !== selectedEvent.id.toString()) return false;
    const member = data.anggota.find(a => a.id.toString() === p.idAnggota);
    if (!member) return false;
    return member.nama.toLowerCase().includes(searchQuery.toLowerCase()) || member.nim.includes(searchQuery);
  });

  const handleDelete = (type: 'event' | 'presensi', id: number | string) => {
    setItemToDelete({ type, id });
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setEventFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      capacity: 0,
      status: 'Akan Datang'
    });
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent({ ...eventFormData, id: editingEvent.id });
    } else {
      addEvent(eventFormData);
    }
    handleCloseModal();
  };

  const openEditEventModal = (event: Event) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      capacity: event.capacity,
      status: event.status
    });
    setIsEventModalOpen(true);
  };

  // Get current app URL for QR code
  const appUrl = window.location.origin;
  const qrValue = selectedEvent ? `${appUrl}/presensi?event=${encodeURIComponent(selectedEvent.title)}` : '';

  const exportToPDF = () => {
    if (!selectedEvent) return;
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(18);
    doc.setTextColor(217, 119, 6);
    doc.text(`REKAP PRESENSI: ${selectedEvent.title.toUpperCase()}`, pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, 28, { align: 'center' });

    doc.autoTable({
      startY: 35,
      head: [['Nama', 'NIM', 'Waktu Scan', 'Status']],
      body: filteredPresensi.map(p => {
        const member = data.anggota.find(a => a.id.toString() === p.idAnggota);
        return [member?.nama || '-', member?.nim || '-', new Date(p.waktuPresensi).toLocaleString('id-ID'), p.status || '-'];
      }),
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6] }
    });

    doc.save(`Presensi_${selectedEvent.title.replace(/\s+/g, '_')}.pdf`);
  };

  const exportToCSV = () => {
    if (!selectedEvent) return;
    const headers = ['Nama', 'NIM', 'Waktu Scan', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredPresensi.map(p => {
        const member = data.anggota.find(a => a.id.toString() === p.idAnggota);
        return `"${member?.nama || '-'}","${member?.nim || '-'}","${new Date(p.waktuPresensi).toLocaleString('id-ID')}","${p.status || '-'}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Presensi_${selectedEvent.title.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadQR = () => {
    if (!selectedEvent) return;
    const svg = document.getElementById('attendance-qr');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR-${selectedEvent.title}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handleScanMemberQR = async (qrCode: string) => {
    const member = data.anggota.find(a => a.qrCode === qrCode);
    if (!member) {
      setScanStatus({ type: 'error', message: 'QR Code Anggota tidak valid atau tidak ditemukan.' });
      return;
    }

    if (!selectedEvent) {
      setScanStatus({ type: 'error', message: 'Pilih acara terlebih dahulu.' });
      return;
    }

    const alreadyPresent = data.presensi.find(p => p.idAnggota === member.id.toString() && p.idAcara === selectedEvent.id.toString());
    
    if (alreadyPresent) {
      setScanStatus({ type: 'error', message: `Anggota ${member.nama} sudah melakukan presensi untuk acara ini.` });
      return;
    }

    addPresensi({
      idAcara: selectedEvent.id.toString(),
      idAnggota: member.id.toString(),
      status: 'HADIR'
    });

    setScanStatus({ type: 'success', message: `Presensi berhasil untuk ${member.nama}.` });
    setTimeout(() => setScanStatus(null), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-himars-dark uppercase tracking-tight">Presensi QR</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Kelola acara dan kehadiran anggota.</p>
        </div>
        <button 
          onClick={() => {
            setEditingEvent(null);
            setEventFormData({ title: '', date: '', time: '', location: '', description: '', capacity: 0, status: 'Akan Datang' });
            setIsEventModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-himars-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-himars-dark/20"
        >
          <Plus className="w-4 h-4" /> ACARA
        </button>
      </div>

      {/* Event Management Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-xl font-serif text-himars-dark">Daftar Acara</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Acara</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu & Lokasi</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center">
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Belum ada acara.</p>
                  </td>
                </tr>
              ) : (
                data.events.map((event) => (
                  <tr key={event.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedEventId === event.id ? 'bg-himars-peach/5' : ''}`}>
                    <td className="px-8 py-5">
                      <div className="font-black text-himars-dark uppercase tracking-tight">{event.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Kapasitas: {event.capacity}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Clock className="w-3 h-3" /> {event.date} • {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        event.status === 'Berlangsung' ? 'bg-emerald-100 text-emerald-700' :
                        event.status === 'Selesai' ? 'bg-slate-100 text-slate-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setPresensiEventId(event.id);
                            setIsPresensiModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        >
                          <Users className="w-3 h-3 inline-block mr-1" /> Lihat Presensi
                        </button>
                        <button 
                          onClick={() => setSelectedEventId(event.id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedEventId === event.id 
                              ? 'bg-himars-peach text-white shadow-lg shadow-himars-peach/20' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <QrCode className="w-3 h-3 inline-block mr-1" /> Scan
                        </button>
                        <button 
                          onClick={() => openEditEventModal(event)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete('event', event.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Attendance Section (Only visible if an event is selected) */}
      {selectedEvent && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* QR Code Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 text-center sticky top-8">
              <h2 className="text-xl font-serif text-himars-dark mb-2">Kode QR Presensi</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{selectedEvent.title}</p>
              
              <div className="bg-white p-8 rounded-[2rem] border-2 border-himars-peach/20 inline-block mb-8 shadow-inner">
                <QRCodeSVG 
                  id="attendance-qr"
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={handleDownloadQR}
                  className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 py-3 bg-himars-peach text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-himars-peach/20"
                >
                  <Printer className="w-3 h-3" /> Cetak
                </button>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Camera className="w-4 h-4" /> Scan QR Anggota
                </button>
              </div>

              <AnimatePresence>
                {scanStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-6 p-4 rounded-xl text-sm font-bold ${
                      scanStatus.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}
                  >
                    {scanStatus.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-mono text-slate-400 break-all">{qrValue}</p>
              </div>
            </div>
          </div>

          {/* Attendance List Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-himars-peach/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-himars-peach" />
                  </div>
                  <h2 className="text-xl font-serif text-himars-dark">Daftar Kehadiran</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={exportToCSV}
                    disabled={filteredPresensi.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <Download className="w-3 h-3" /> Export CSV
                  </button>
                  <button 
                    onClick={exportToPDF}
                    disabled={filteredPresensi.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-himars-peach text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-himars-peach/90 transition-all shadow-lg shadow-himars-peach/20 disabled:opacity-50"
                  >
                    <Download className="w-3 h-3" /> Export PDF
                  </button>
                  <div className="px-4 py-1.5 bg-himars-peach/10 rounded-full text-[10px] font-black text-himars-peach uppercase tracking-widest">
                    {filteredPresensi.length} Peserta
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama / NIM</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jabatan</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu Scan</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPresensi.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-24 text-center">
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Belum ada peserta yang melakukan scan.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredPresensi.map((p) => {
                        const member = data.anggota.find(a => a.id.toString() === p.idAnggota);
                        return (
                          <tr key={p.idPresensi} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="font-black text-himars-dark uppercase tracking-tight">{member?.nama || '-'}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member?.nim || '-'}</div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-slate-500">{member?.jabatan || 'Anggota'}</span>
                                {member?.departemen && (
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {member.departemen}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-bold text-slate-500">{new Date(p.waktuPresensi).toLocaleString('id-ID')}</td>
                            <td className="px-8 py-5">
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                                {p.status || 'HADIR'}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <button 
                                onClick={() => handleDelete('presensi', p.idPresensi)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* All Attendance Data Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mt-8">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-xl font-serif text-himars-dark">Rekap Kehadiran Semua Acara</h2>
          </div>
        </div>
        <div className="p-8 space-y-8">
          {data.events.map(event => {
            const eventPresensi = getPresensiByAcara(event.id.toString());
            if (eventPresensi.length === 0) return null;
            return (
              <div key={event.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-black text-himars-dark uppercase tracking-tight">{event.title}</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {eventPresensi.length} Hadir
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-100">
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama / NIM</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jabatan</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu Scan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {eventPresensi.map(p => {
                        const member = data.anggota.find(a => a.id.toString() === p.idAnggota);
                        return (
                          <tr key={p.idPresensi} className="hover:bg-slate-50/50 transition-colors bg-white">
                            <td className="px-6 py-3">
                              <div className="font-black text-himars-dark text-sm">{member?.nama || '-'}</div>
                              <div className="text-[10px] text-slate-400 font-bold">{member?.nim || '-'}</div>
                            </td>
                            <td className="px-6 py-3 text-xs font-bold text-slate-500">{member?.jabatan || 'Anggota'}</td>
                            <td className="px-6 py-3 text-xs font-bold text-slate-500">{new Date(p.waktuPresensi).toLocaleString('id-ID')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {data.events.every(event => getPresensiByAcara(event.id.toString()).length === 0) && (
            <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-sm">
              Belum ada data kehadiran untuk acara apapun.
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-2xl font-black text-himars-dark uppercase tracking-tight">
                  {editingEvent ? 'Edit Acara' : 'Tambah Acara Baru'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-6 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Acara</label>
                    <input 
                      type="text" 
                      required
                      value={eventFormData.title}
                      onChange={e => setEventFormData({...eventFormData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                      placeholder="Contoh: Rapat Kerja Tahunan"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</label>
                    <input 
                      type="date" 
                      required
                      value={eventFormData.date}
                      onChange={e => setEventFormData({...eventFormData, date: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</label>
                    <input 
                      type="time" 
                      required
                      value={eventFormData.time}
                      onChange={e => setEventFormData({...eventFormData, time: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi</label>
                    <input 
                      type="text" 
                      required
                      value={eventFormData.location}
                      onChange={e => setEventFormData({...eventFormData, location: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                      placeholder="Contoh: Ruang Sidang Utama"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapasitas</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={eventFormData.capacity}
                      onChange={e => setEventFormData({...eventFormData, capacity: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                    <select 
                      value={eventFormData.status}
                      onChange={e => setEventFormData({...eventFormData, status: e.target.value as Event['status']})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
                    >
                      <option value="Akan Datang">Akan Datang</option>
                      <option value="Berlangsung">Berlangsung</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi</label>
                    <textarea 
                      rows={3}
                      value={eventFormData.description}
                      onChange={e => setEventFormData({...eventFormData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm resize-none"
                      placeholder="Deskripsi singkat acara..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-himars-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-himars-dark/20"
                  >
                    Simpan Acara
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
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
            if (itemToDelete.type === 'event') {
              deleteEvent(itemToDelete.id as number);
              if (selectedEventId === itemToDelete.id) {
                setSelectedEventId(null);
              }
            } else if (itemToDelete.type === 'presensi') {
              deletePresensi(itemToDelete.id as string);
            }
          }
        }}
        title={`Hapus ${itemToDelete?.type === 'event' ? 'Acara' : 'Kehadiran'}`}
        message={`Apakah Anda yakin ingin menghapus data ${itemToDelete?.type === 'event' ? 'acara' : 'kehadiran'} ini? Data yang dihapus tidak dapat dikembalikan.`}
      />

      {/* Modal Lihat Presensi */}
      <AnimatePresence>
        {isPresensiModalOpen && presensiEventId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPresensiModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] p-8 max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-himars-dark uppercase tracking-tight">
                    Daftar Hadir: {data.events.find(e => e.id === presensiEventId)?.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Total Hadir: {getPresensiByAcara(presensiEventId.toString()).length}
                  </p>
                </div>
                <button 
                  onClick={() => setIsPresensiModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama / NIM</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jabatan</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu Scan</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {getPresensiByAcara(presensiEventId.toString()).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Belum ada peserta yang hadir.</p>
                        </td>
                      </tr>
                    ) : (
                      getPresensiByAcara(presensiEventId.toString()).map((p) => {
                        const member = data.anggota.find(a => a.id.toString() === p.idAnggota);
                        return (
                          <tr key={p.idPresensi} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-black text-himars-dark uppercase tracking-tight">{member?.nama || '-'}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member?.nim || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-slate-500">{member?.jabatan || 'Anggota'}</span>
                                {member?.departemen && (
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {member.departemen}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-500">{new Date(p.waktuPresensi).toLocaleString('id-ID')}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                                {p.status || 'HADIR'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showScanner && (
        <QRScanner 
          onScan={(data) => {
            handleScanMemberQR(data);
            setShowScanner(false);
          }} 
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
