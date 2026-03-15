import React, { useState, useEffect } from 'react';
import { useData } from '../../store/DataContext';
import { Search, CheckCircle2, History, UserCheck, QrCode, Users, Trash2, Plus, X, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import ConfirmModal from '../../components/ConfirmModal';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSearchParams } from 'react-router-dom';
import { kirimKeSheet } from '../../utils/kirimKeSheet';

export default function Kehadiran() {
  const { data, deleteKehadiran } = useData();
  const [searchParams] = useSearchParams();
  const events = data.news.filter(n => n.kategori === 'kegiatan');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    const eventParam = searchParams.get('event');
    if (eventParam) {
      setSelectedEvent(eventParam);
    } else if (events.length > 0) {
      setSelectedEvent(events[0].judul);
    }
  }, [searchParams, events]);

  const filteredKehadiran = data.kehadiran.filter(k => 
    k.kegiatan === selectedEvent &&
    (k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.nim.includes(searchQuery))
  );

  const handleDelete = (id: string | number) => {
    setItemToDelete(id as number);
    setIsDeleteModalOpen(true);
  };

  // Get current app URL for QR code
  const appUrl = window.location.origin;
  const qrValue = `${appUrl}/presensi?event=${encodeURIComponent(selectedEvent)}`;

  const exportToPDF = () => {
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(18);
    doc.setTextColor(217, 119, 6);
    doc.text(`REKAP PRESENSI: ${selectedEvent.toUpperCase()}`, pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, 28, { align: 'center' });

    doc.autoTable({
      startY: 35,
      head: [['Nama', 'NIM', 'Waktu Scan', 'Keterangan']],
      body: filteredKehadiran.map(k => [k.nama, k.nim, k.waktu, k.keterangan]),
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6] }
    });

    doc.save(`Presensi_${selectedEvent.replace(/\s+/g, '_')}.pdf`);
  };

  const handleDownloadQR = () => {
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
        downloadLink.download = `QR-${selectedEvent}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-himars-dark uppercase tracking-tight">Sistem Presensi QR</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Kelola kehadiran anggota melalui kode QR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* QR Code Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 text-center">
            <h2 className="text-xl font-serif text-himars-dark mb-8">Kode QR Presensi</h2>
            
            <div className="text-left mb-8">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Pilih Acara</label>
              <select 
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-himars-peach font-bold text-sm"
              >
                {events.length === 0 && <option value="" disabled>Belum ada acara</option>}
                {events.map(n => (
                  <option key={n.id} value={n.judul}>{n.judul}</option>
                ))}
              </select>
            </div>

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
                  onClick={exportToPDF}
                  disabled={filteredKehadiran.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100 disabled:opacity-50"
                >
                  <Download className="w-3 h-3" /> Export PDF
                </button>
                <div className="px-4 py-1.5 bg-himars-peach/10 rounded-full text-[10px] font-black text-himars-peach uppercase tracking-widest">
                  {filteredKehadiran.length} Peserta
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
                  {filteredKehadiran.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-24 text-center">
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Belum ada peserta yang melakukan scan.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredKehadiran.map((k) => {
                      const member = data.anggota.find(a => a.nim === k.nim);
                      return (
                        <tr key={k.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="font-black text-himars-dark uppercase tracking-tight">{k.nama}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{k.nim}</div>
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
                          <td className="px-8 py-5 text-sm font-bold text-slate-500">{k.waktu}</td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                              {k.keterangan}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <button 
                              onClick={() => handleDelete(k.id)}
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
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={async () => {
          if (itemToDelete) {
            const record = data.kehadiran.find(k => k.id === itemToDelete);
            if (record) {
              await kirimKeSheet({
                nama: record.nama,
                nim: record.nim,
                kegiatan: record.kegiatan,
                aksi: 'Hapus Presensi'
              }, 'Presensi QR');
            }
            deleteKehadiran(itemToDelete);
          }
        }}
        title="Hapus Kehadiran"
        message="Apakah Anda yakin ingin menghapus data kehadiran ini? Data yang dihapus tidak dapat dikembalikan."
      />
    </div>
  );
}
