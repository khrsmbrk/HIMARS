import React, { useState, useEffect } from 'react';
import { useData } from '../../store/DataContext';
import QRScanner from '../../components/QRScanner';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, UserCheck, Search, AlertCircle, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { kirimKeSheet } from '../../utils/kirimKeSheet';

export default function Presensi() {
  const { data, addKehadiran } = useData();
  const location = useLocation();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedEvent, setScannedEvent] = useState<any>(null);
  const [nim, setNim] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventTitle = params.get('event');
    if (eventTitle) {
      const event = data.news.find(n => n.judul === eventTitle);
      if (event) {
        setScannedEvent(event);
      }
    }
  }, [location.search, data.news]);

  const handleScan = (qrCode: string) => {
    // Check if it's a URL with event param
    try {
      if (qrCode.includes('?event=')) {
        const url = new URL(qrCode);
        const eventTitle = url.searchParams.get('event');
        const event = data.news.find(n => n.judul === eventTitle);
        if (event) {
          setScannedEvent(event);
          setShowScanner(false);
          setStatus(null);
          return;
        }
      }
    } catch (e) {
      // Not a URL, continue with raw qrCode check
    }

    const event = data.news.find(n => n.qrCode === qrCode);
    if (event) {
      setScannedEvent(event);
      setShowScanner(false);
      setStatus(null);
    } else {
      setStatus({ type: 'error', message: 'QR Code Acara tidak valid atau tidak ditemukan.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedEvent || !nim) return;

    setIsSubmitting(true);
    
    // Find member by NIM
    const member = data.anggota.find(a => a.nim === nim);
    
    if (!member) {
      setStatus({ type: 'error', message: 'NIM tidak terdaftar sebagai anggota HIMARS.' });
      setIsSubmitting(false);
      return;
    }

    // Check if already present for this event
    const alreadyPresent = data.kehadiran.find(k => k.nim === nim && k.kegiatan === scannedEvent.judul && k.tanggal === new Date().toLocaleDateString('id-ID'));
    
    if (alreadyPresent) {
      setStatus({ type: 'error', message: 'Anda sudah melakukan presensi untuk acara ini hari ini.' });
      setIsSubmitting(false);
      return;
    }

    const attendanceData = {
      nama: member.nama,
      nim: member.nim,
      kegiatan: scannedEvent.judul,
      keterangan: 'Hadir (Mandiri)'
    };

    // Record attendance locally
    addKehadiran(attendanceData);

    // Sync to Google Sheets
    await kirimKeSheet(attendanceData, 'Presensi Mandiri');

    setStatus({ type: 'success', message: `Presensi berhasil! Selamat mengikuti ${scannedEvent.judul}.` });
    setNim('');
    setScannedEvent(null);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-liquid py-20 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-himars-peach rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-himars-peach/20"
          >
            <UserCheck className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-himars-dark uppercase tracking-tight">Presensi Mandiri</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Scan QR Acara & Masukkan NIM Anda</p>
        </div>

        <AnimatePresence mode="wait">
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-6 rounded-3xl flex items-center gap-4 border ${
                status.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-red-50 border-red-100 text-red-700'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
              <p className="font-bold text-sm uppercase tracking-wide">{status.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-ios rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden border border-white/40">
          {!scannedEvent ? (
            <div className="p-10 text-center">
              <div className="mb-8">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-dashed border-slate-200">
                  <QrCode className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-himars-dark uppercase tracking-tight mb-2">Scan QR Acara</h3>
                <p className="text-slate-500 text-sm font-medium">Silakan scan QR Code yang ditampilkan oleh operator acara untuk memulai presensi.</p>
              </div>
              
              <button
                onClick={() => setShowScanner(true)}
                className="w-full py-5 bg-himars-peach text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-himars-peach/90 transition-all shadow-lg shadow-himars-peach/20 flex items-center justify-center gap-3 mb-6"
              >
                <QrCode className="w-5 h-5" /> Buka Kamera Scanner
              </button>

              <div className="relative flex items-center py-2 mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Atau</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Pilih Acara Manual</label>
                <select
                  onChange={(e) => {
                    const event = data.news.find(n => n.judul === e.target.value);
                    if (event) setScannedEvent(event);
                  }}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-himars-peach/10 focus:border-himars-peach transition-all font-bold text-himars-dark text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>-- Pilih Acara --</option>
                  {data.news.filter(n => n.kategori === 'kegiatan').map(event => (
                    <option key={event.id} value={event.judul}>{event.judul}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="p-10">
              <div className="flex items-center gap-4 mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-himars-green/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-himars-green" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acara Terdeteksi</p>
                  <h3 className="text-lg font-black text-himars-dark uppercase tracking-tight">{scannedEvent.judul}</h3>
                </div>
                <button 
                  onClick={() => setScannedEvent(null)}
                  className="ml-auto text-xs font-bold text-red-500 uppercase tracking-widest hover:underline"
                >
                  Ganti
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Masukkan NIM Anda</label>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      placeholder="Contoh: 2402070300"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-himars-peach/10 focus:border-himars-peach transition-all font-bold text-himars-dark"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-himars-dark text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses...' : (
                    <>Konfirmasi Kehadiran <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Kesulitan scan? Hubungi operator acara di lokasi.
          </p>
        </div>
      </div>

      {showScanner && (
        <QRScanner 
          onScan={handleScan} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </div>
  );
}
