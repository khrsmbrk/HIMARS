import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Calendar, Filter, PieChart, TrendingUp, Users, Wallet, CheckCircle, AlertCircle, CheckSquare, Target } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function Reports() {
  const { data } = useData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('keuangan');
  const [period, setPeriod] = useState('2024-03'); // Changed to YYYY-MM format

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const formatPeriod = (p: string) => {
    const [year, month] = p.split('-');
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const filteredKeuangan = data.keuangan.filter(k => k.tanggal.startsWith(period));
  const filteredProker = data.proker.filter(p => p.tanggalSelesai.startsWith(period) || p.status === 'Sedang Berjalan');
  const filteredKehadiran = data.kehadiran.filter(k => k.waktu.startsWith(period));

  const generatePDF = async () => {
    setIsGenerating(true);

    setTimeout(() => {
      const doc = new jsPDF() as any;
      const pageWidth = doc.internal.pageSize.getWidth();
      const periodText = formatPeriod(period);
      
      let currentY = 20;

      // Add Kop Surat if available
      if (data.settings.kopSuratUrl) {
        try {
          doc.addImage(data.settings.kopSuratUrl, 'PNG', 20, 10, pageWidth - 40, 30);
          currentY = 50;
        } catch (e) {
          console.error('Failed to add kop surat to PDF', e);
        }
      } else {
        // Fallback Header if no Kop Surat
        doc.setFontSize(20);
        doc.setTextColor(217, 119, 6); // himars-peach
        doc.text('LAPORAN BULANAN HIMARS', pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
        
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Periode: ${periodText}`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 7;
        
        doc.setDrawColor(200);
        doc.line(20, currentY, pageWidth - 20, currentY);
        currentY += 10;
      }

      if (reportType === 'keuangan') {
        const totalPemasukan = filteredKeuangan
          .filter(k => k.jenis === 'pemasukan')
          .reduce((sum, k) => sum + k.nominal, 0);
        const totalPengeluaran = filteredKeuangan
          .filter(k => k.jenis === 'pengeluaran')
          .reduce((sum, k) => sum + k.nominal, 0);
        const saldo = totalPemasukan - totalPengeluaran;

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Ringkasan Keuangan', 20, currentY);
        
        doc.autoTable({
          startY: currentY + 5,
          head: [['Kategori', 'Total']],
          body: [
            ['Total Pemasukan', `Rp ${totalPemasukan.toLocaleString('id-ID')}`],
            ['Total Pengeluaran', `Rp ${totalPengeluaran.toLocaleString('id-ID')}`],
            ['Saldo Akhir', `Rp ${saldo.toLocaleString('id-ID')}`],
          ],
          theme: 'striped',
          headStyles: { fillColor: [217, 119, 6] }
        });

        if (filteredKeuangan.length > 0) {
          doc.text('Detail Transaksi', 20, doc.lastAutoTable.finalY + 15);
          doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Tanggal', 'Keterangan', 'Jenis', 'Nominal']],
            body: filteredKeuangan.map(k => [
              k.tanggal,
              k.keterangan,
              k.jenis.toUpperCase(),
              `Rp ${k.nominal.toLocaleString('id-ID')}`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [217, 119, 6] }
          });
        } else {
          doc.setFontSize(10);
          doc.setTextColor(150);
          doc.text('Tidak ada data transaksi untuk periode ini.', 20, doc.lastAutoTable.finalY + 15);
        }
      } else if (reportType === 'kegiatan') {
        const totalAnggota = data.anggota.length;
        const totalHadir = filteredKehadiran.length;
        
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Statistik Organisasi', 20, currentY);
        
        doc.autoTable({
          startY: currentY + 5,
          head: [['Indikator', 'Jumlah']],
          body: [
            ['Total Anggota Terdaftar', totalAnggota],
            ['Total Presensi Kegiatan (Bulan Ini)', totalHadir],
            ['Program Kerja Berjalan', data.proker.filter(p => p.status === 'Sedang Berjalan').length],
            ['Program Kerja Selesai (Bulan Ini)', data.proker.filter(p => p.status === 'Selesai' && p.tanggalSelesai.startsWith(period)).length],
          ],
          theme: 'striped',
          headStyles: { fillColor: [217, 119, 6] }
        });

        doc.text('Daftar Program Kerja Aktif', 20, doc.lastAutoTable.finalY + 15);
        
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 20,
          head: [['Nama Proker', 'Departemen', 'Status', 'Realisasi']],
          body: data.proker.filter(p => p.status === 'Sedang Berjalan' || p.status === 'Selesai').map(p => [
            p.namaProker,
            p.departemen,
            p.status,
            `Rp ${p.realisasi.toLocaleString('id-ID')}`
          ]),
          theme: 'grid',
          headStyles: { fillColor: [217, 119, 6] }
        });
      } else if (reportType === 'presensi') {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Rekap Presensi Anggota', 20, currentY);

        const attendanceSummary = data.anggota.map(member => {
          const count = filteredKehadiran.filter(k => k.nama === member.nama).length;
          return [member.nama, member.nim, member.jabatan, count];
        });

        doc.autoTable({
          startY: currentY + 5,
          head: [['Nama', 'NIM', 'Jabatan', 'Kehadiran (Bulan Ini)']],
          body: attendanceSummary,
          theme: 'grid',
          headStyles: { fillColor: [217, 119, 6] }
        });
      } else if (reportType === 'proker') {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Laporan Status Program Kerja', 20, currentY);

        const prokerStats = [
          ['TO DO', data.proker.filter(p => p.status === 'Belum Mulai').length],
          ['IN PROGRESS', data.proker.filter(p => p.status === 'Sedang Berjalan').length],
          ['DONE', data.proker.filter(p => p.status === 'Selesai').length],
          ['OVERDUE', data.proker.filter(p => p.status === 'Overdue').length],
        ];

        doc.autoTable({
          startY: currentY + 5,
          head: [['Status', 'Jumlah']],
          body: prokerStats,
          theme: 'striped',
          headStyles: { fillColor: [217, 119, 6] }
        });

        doc.text('Detail Proker', 20, doc.lastAutoTable.finalY + 15);

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 20,
          head: [['Nama Proker', 'Departemen', 'Status', 'Target Selesai']],
          body: data.proker.map(p => [
            p.namaProker,
            p.departemen,
            p.status,
            p.tanggalSelesai
          ]),
          theme: 'grid',
          headStyles: { fillColor: [217, 119, 6] }
        });
      }

      // Add Tanda Tangan if available
      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : currentY + 20;
      
      // Check if we need a new page for signature
      if (finalY > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        finalY = 20;
      }

      if (data.settings.tandaTanganUrl) {
        try {
          doc.addImage(data.settings.tandaTanganUrl, 'PNG', pageWidth - 80, finalY, 60, 30);
          if (data.settings.stempelUrl) {
            doc.addImage(data.settings.stempelUrl, 'PNG', pageWidth - 90, finalY - 5, 40, 40);
          }
        } catch (e) {
          console.error('Failed to add tanda tangan to PDF', e);
        }
      }

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('Dicetak secara otomatis oleh Sistem Informasi HIMARS', pageWidth / 2, footerY, { align: 'center' });
      doc.text(`Tanggal Cetak: ${new Date().toLocaleString('id-ID')}`, pageWidth / 2, footerY + 5, { align: 'center' });

      doc.save(`Laporan_HIMARS_${reportType}_${period}.pdf`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="p-8 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Laporan Otomatis</h1>
          <p className="text-slate-500">Generate laporan periodik organisasi dalam format PDF secara instan.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100">
            <CheckCircle className="h-4 w-4" /> Sistem Siap
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Filter className="h-5 w-5 text-himars-peach" /> Konfigurasi Laporan
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Jenis Laporan</label>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setReportType('keuangan')}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      reportType === 'keuangan' 
                        ? 'border-himars-peach bg-himars-peach/5 text-himars-peach' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Laporan Keuangan</div>
                      <div className="text-[10px] opacity-70">Pemasukan, pengeluaran, saldo</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setReportType('kegiatan')}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      reportType === 'kegiatan' 
                        ? 'border-himars-peach bg-himars-peach/5 text-himars-peach' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Laporan Kegiatan</div>
                      <div className="text-[10px] opacity-70">Anggota, proker, statistik</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setReportType('presensi')}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      reportType === 'presensi' 
                        ? 'border-himars-peach bg-himars-peach/5 text-himars-peach' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <CheckSquare className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Rekap Presensi</div>
                      <div className="text-[10px] opacity-70">Kehadiran per anggota</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setReportType('proker')}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      reportType === 'proker' 
                        ? 'border-himars-peach bg-himars-peach/5 text-himars-peach' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <Target className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Laporan Proker</div>
                      <div className="text-[10px] opacity-70">Status & target proker</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Periode Laporan</label>
                <select 
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-himars-peach outline-none transition-all"
                >
                  <option value="2024-01">Januari 2024</option>
                  <option value="2024-02">Februari 2024</option>
                  <option value="2024-03">Maret 2024</option>
                  <option value="2024-04">April 2024</option>
                </select>
              </div>

              <button 
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full py-4 bg-himars-peach text-white rounded-2xl font-bold shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" /> Generate PDF
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-himars-peach" />
              </div>
              <h4 className="font-bold">Insight Cepat</h4>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Sistem mendeteksi kenaikan partisipasi anggota sebesar 15% dibandingkan bulan sebelumnya.
            </p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-himars-peach w-[75%]" />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <span>Target</span>
              <span>75% Tercapai</span>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-himars-peach" /> Preview Laporan
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
            </div>
            
            <div className="flex-1 bg-slate-100/50 p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-2xl mx-auto bg-white shadow-2xl p-12 min-h-[800px] relative">
                {/* PDF Mockup */}
                <div className="text-center mb-12">
                  <h2 className="text-2xl font-black text-himars-peach mb-2">LAPORAN BULANAN HIMARS</h2>
                  <p className="text-slate-500 font-medium">Periode: {formatPeriod(period)}</p>
                  <div className="w-24 h-1 bg-himars-peach/20 mx-auto mt-4" />
                </div>

                <div className="space-y-8">
                  <section>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                      {reportType === 'keuangan' ? 'Ringkasan Keuangan' : 
                       reportType === 'kegiatan' ? 'Statistik Organisasi' :
                       reportType === 'presensi' ? 'Rekap Presensi' : 'Status Program Kerja'}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {reportType === 'keuangan' ? (
                        <>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Pemasukan</div>
                            <div className="text-lg font-black text-emerald-600">
                              Rp {filteredKeuangan.filter(k => k.jenis === 'pemasukan').reduce((sum, k) => sum + k.nominal, 0).toLocaleString('id-ID')}
                            </div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Pengeluaran</div>
                            <div className="text-lg font-black text-red-600">
                              Rp {filteredKeuangan.filter(k => k.jenis === 'pengeluaran').reduce((sum, k) => sum + k.nominal, 0).toLocaleString('id-ID')}
                            </div>
                          </div>
                        </>
                      ) : reportType === 'kegiatan' ? (
                        <>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Anggota</div>
                            <div className="text-lg font-black text-slate-800">{data.anggota.length} Orang</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Presensi (Bulan Ini)</div>
                            <div className="text-lg font-black text-slate-800">{filteredKehadiran.length} Kali</div>
                          </div>
                        </>
                      ) : reportType === 'presensi' ? (
                        <>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Anggota</div>
                            <div className="text-lg font-black text-slate-800">{data.anggota.length} Orang</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Presensi</div>
                            <div className="text-lg font-black text-slate-800">{filteredKehadiran.length} Kali</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Proker Berjalan</div>
                            <div className="text-lg font-black text-slate-800">{data.proker.filter(p => p.status === 'Sedang Berjalan').length}</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Proker Selesai</div>
                            <div className="text-lg font-black text-slate-800">{data.proker.filter(p => p.status === 'Selesai').length}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                      {reportType === 'keuangan' ? 'Detail Transaksi' : 
                       reportType === 'kegiatan' ? 'Daftar Proker Aktif' :
                       reportType === 'presensi' ? 'Detail Kehadiran Anggota' : 'Daftar Semua Proker'}
                    </h4>
                    <div className="space-y-2">
                      {reportType === 'keuangan' ? (
                        filteredKeuangan.length > 0 ? filteredKeuangan.slice(0, 5).map((k, i) => (
                          <div key={k.id} className="flex items-center justify-between p-3 border-b border-slate-50 text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold">{i + 1}</div>
                              <div>
                                <div className="font-bold text-slate-700">{k.keterangan}</div>
                                <div className="text-[10px] text-slate-400">{k.tanggal}</div>
                              </div>
                            </div>
                            <div className={`font-bold ${k.jenis === 'pemasukan' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {k.jenis === 'pemasukan' ? '+' : '-'} Rp {k.nominal.toLocaleString('id-ID')}
                            </div>
                          </div>
                        )) : <p className="text-xs text-slate-400 italic text-center py-4">Belum ada data tersedia untuk periode ini.</p>
                      ) : reportType === 'kegiatan' || reportType === 'proker' ? (
                        data.proker.slice(0, 5).map((p, i) => (
                          <div key={p.id} className="flex items-center justify-between p-3 border-b border-slate-50 text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold">{i + 1}</div>
                              <div>
                                <div className="font-bold text-slate-700">{p.namaProker}</div>
                                <div className="text-[10px] text-slate-400">{p.departemen}</div>
                              </div>
                            </div>
                            <div className="font-bold text-slate-800">{p.status}</div>
                          </div>
                        ))
                      ) : (
                        data.anggota.slice(0, 5).map((m, i) => (
                          <div key={m.id} className="flex items-center justify-between p-3 border-b border-slate-50 text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold">{i + 1}</div>
                              <div>
                                <div className="font-bold text-slate-700">{m.nama}</div>
                                <div className="text-[10px] text-slate-400">{m.jabatan}</div>
                              </div>
                            </div>
                            <div className="font-bold text-slate-800">
                              {filteredKehadiran.filter(k => k.nama === m.nama).length} Kali
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
                </div>

                <div className="absolute bottom-12 left-0 right-0 text-center">
                  <div className="text-[10px] text-slate-300 uppercase tracking-[0.2em]">
                    Himpunan Mahasiswa Program Studi Administrasi Rumah Sakit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
