import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Vote, CheckCircle, AlertCircle, Clock, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { kirimKeSheet } from '../../utils/kirimKeSheet';

export default function Voting() {
  const { data, castVote } = useData();
  const [nim, setNim] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [isEventCodeVerified, setIsEventCodeVerified] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [selectedKandidat, setSelectedKandidat] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState('');

  const activeSessions = data.voting.filter(v => v.status === 'Aktif');

  const handleVerifyEventCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
    
    const session = data.voting.find(v => v.id === selectedSession);
    if (!session) return;

    if (!session.kodeAkses || session.kodeAkses.toUpperCase() === eventCode.toUpperCase()) {
      setIsEventCodeVerified(true);
      setError('');
    } else {
      setError('Kode akses acara tidak valid.');
    }
  };

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !selectedKandidat || !nim) {
      setError('Pilih sesi, kandidat, dan masukkan NIM.');
      return;
    }

    const session = data.voting.find(v => v.id === selectedSession);
    if (!session) return;

    const terdaftar = session.nimTerdaftar || [];
    const sudahMemilih = session.nimSudahMemilih || [];

    if (terdaftar.length > 0 && !terdaftar.includes(nim)) {
      setError('NIM Anda tidak terdaftar sebagai pemilih di sesi ini.');
      return;
    }

    if (sudahMemilih.includes(nim)) {
      setError('NIM ini sudah digunakan untuk memilih.');
      return;
    }

    if (nim.length < 5) {
      setError('NIM tidak valid.');
      return;
    }

    const kandidat = session.kandidat.find(k => k.id === selectedKandidat);

    const voteData = {
      nim: nim,
      sesi: session.judul,
      pilihan: kandidat?.nama || 'Unknown'
    };

    // Record vote locally
    castVote(selectedSession, selectedKandidat, nim);

    // Sync to Google Sheets
    await kirimKeSheet(voteData, 'E-Voting');

    setHasVoted(true);
    setError('');
    
    setTimeout(() => {
      setHasVoted(false);
      setNim('');
      setEventCode('');
      setIsEventCodeVerified(false);
      setSelectedSession(null);
      setSelectedKandidat(null);
    }, 5000);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-liquid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 bg-himars-peach/20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3"
          >
            <Vote className="w-10 h-10 text-himars-peach" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-himars-dark uppercase tracking-tight mb-6"
          >
            E-Voting HIMARS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-medium"
          >
            Gunakan hak suara Anda untuk memilih pemimpin HIMARS UMLA periode selanjutnya.
          </motion.p>
        </div>

        {activeSessions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="glass-ios rounded-[3rem] p-12 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 max-w-2xl mx-auto"
          >
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-himars-dark uppercase tracking-tight mb-2">Belum Ada Pemilihan Aktif</h3>
            <p className="text-slate-600">Saat ini tidak ada sesi pemilihan yang sedang berlangsung. Silakan kembali lagi nanti.</p>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {hasVoted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-ios rounded-[3rem] p-12 text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40"
                >
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-black text-himars-dark uppercase tracking-tight mb-4">Terima Kasih!</h3>
                  <p className="text-lg text-slate-600">Suara Anda telah berhasil direkam dalam sistem. Satu suara Anda sangat berarti untuk kemajuan HIMARS UMLA.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="glass-ios rounded-[3rem] p-8 md:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40"
                >
                  <form onSubmit={handleVote} className="space-y-8">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Sesi Pemilihan</label>
                      <div className="grid grid-cols-1 gap-4">
                        {activeSessions.map(session => (
                          <label 
                            key={session.id} 
                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
                              selectedSession === session.id ? 'border-himars-peach bg-himars-peach/5' : 'border-slate-100 bg-white/50 hover:border-himars-peach/30'
                            }`}
                          >
                            <div>
                              <h4 className="text-lg font-black text-himars-dark uppercase">{session.judul}</h4>
                              <p className="text-xs font-bold text-slate-500 mt-1">Berakhir: {session.tanggalSelesai}</p>
                            </div>
                            <input 
                              type="radio" 
                              name="session" 
                              value={session.id} 
                              checked={selectedSession === session.id}
                              onChange={() => { 
                                setSelectedSession(session.id); 
                                setSelectedKandidat(null); 
                                setIsEventCodeVerified(!session.kodeAkses);
                                setEventCode('');
                                setError('');
                              }}
                              className="w-5 h-5 text-himars-peach focus:ring-himars-peach"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {selectedSession && !isEventCodeVerified && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Lock className="w-4 h-4" /> Masukkan Kode Akses Acara
                        </label>
                        <div className="flex flex-col md:flex-row gap-4">
                          <input 
                            type="text" 
                            required 
                            value={eventCode} 
                            onChange={e => setEventCode(e.target.value.toUpperCase())} 
                            className="flex-1 px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-mono font-bold text-lg tracking-widest uppercase" 
                            placeholder="KODE ACARA" 
                          />
                          <button 
                            type="button"
                            onClick={handleVerifyEventCode}
                            className="px-8 py-4 bg-himars-dark text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl hover:bg-himars-dark/90 transition-all flex items-center justify-center gap-2"
                          >
                            Verifikasi
                          </button>
                        </div>
                        {error && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-bold mt-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                          </motion.p>
                        )}
                        <p className="text-xs text-slate-500 mt-4 font-medium">Sesi pemilihan ini bersifat tertutup. Silakan masukkan kode akses yang diberikan oleh panitia acara.</p>
                      </motion.div>
                    )}

                    {selectedSession && isEventCodeVerified && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Kandidat</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {data.voting.find(v => v.id === selectedSession)?.kandidat.map((k, idx) => (
                            <label 
                              key={k.id} 
                              className={`cursor-pointer p-6 rounded-3xl border-2 transition-all relative overflow-hidden ${
                                selectedKandidat === k.id ? 'border-himars-peach bg-himars-peach/5 shadow-lg shadow-himars-peach/10' : 'border-slate-100 bg-white/50 hover:border-himars-peach/30'
                              }`}
                            >
                              <div className="absolute top-4 right-4">
                                <input 
                                  type="radio" 
                                  name="kandidat" 
                                  value={k.id} 
                                  checked={selectedKandidat === k.id}
                                  onChange={() => setSelectedKandidat(k.id)}
                                  className="w-6 h-6 text-himars-peach focus:ring-himars-peach"
                                />
                              </div>
                              <span className="text-[10px] font-black text-himars-peach uppercase tracking-widest mb-2 block">Paslon {idx + 1}</span>
                              <div className="flex items-center gap-4 mb-6">
                                {k.foto ? (
                                  <img src={k.foto || undefined} alt={k.nama} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
                                ) : (
                                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">Foto</div>
                                )}
                                <h4 className="text-xl font-black text-himars-dark uppercase">{k.nama}</h4>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visi</p>
                                  <p className="text-sm text-slate-700 leading-relaxed">{k.visi}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Misi</p>
                                  <p className="text-sm text-slate-700 leading-relaxed">{k.misi}</p>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {selectedKandidat && isEventCodeVerified && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Lock className="w-4 h-4" /> Masukkan NIM Anda
                        </label>
                        <div className="flex flex-col md:flex-row gap-4">
                          <input 
                            type="text" 
                            required 
                            value={nim} 
                            onChange={e => setNim(e.target.value.toUpperCase())} 
                            className="flex-1 px-6 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-himars-peach font-mono font-bold text-lg tracking-widest uppercase" 
                            placeholder="CONTOH: 123456789" 
                          />
                          <button 
                            type="submit" 
                            className="px-8 py-4 bg-himars-peach text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all flex items-center justify-center gap-2"
                          >
                            <Vote className="w-5 h-5" /> Gunakan Hak Suara
                          </button>
                        </div>
                        {error && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-bold mt-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                          </motion.p>
                        )}
                        <p className="text-xs text-slate-500 mt-4 font-medium">Sistem menggunakan prinsip One Vote One NIM. NIM Anda hanya dapat digunakan satu kali. Pastikan pilihan Anda sudah benar sebelum menekan tombol.</p>
                      </motion.div>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
