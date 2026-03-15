import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { Users, CheckCircle, Wallet, FileText, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Target, Box, User } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { data } = useData();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const today = currentTime.toLocaleDateString('id-ID');
  const todayAttendance = data.kehadiran.filter(k => k.tanggal === today).length;

  const totalPemasukan = data.keuangan
    .filter(k => k.jenis === 'pemasukan')
    .reduce((sum, k) => sum + k.nominal, 0);

  const totalPengeluaran = data.keuangan
    .filter(k => k.jenis === 'pengeluaran')
    .reduce((sum, k) => sum + k.nominal, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  const stats = [
    { 
      name: 'Total Anggota', 
      value: data.anggota.length, 
      icon: Users, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      trend: data.anggota.length > 0 ? `+${data.anggota.length}` : '0', 
      isUp: true 
    },
    { 
      name: 'Presensi Hari Ini', 
      value: todayAttendance, 
      icon: CheckCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      trend: todayAttendance > 0 ? 'Aktif' : 'Kosong', 
      isUp: todayAttendance > 0 
    },
    { 
      name: 'Saldo Kas', 
      value: formatRupiah(saldo), 
      icon: Wallet, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      trend: saldo >= 0 ? 'Surplus' : 'Defisit', 
      isUp: saldo >= 0 
    },
    { 
      name: 'Berita & Agenda', 
      value: data.news.length, 
      icon: Calendar, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      trend: 'Update', 
      isUp: true 
    },
    { 
      name: 'Proker Aktif', 
      value: data.proker.filter(p => p.status === 'Sedang Berjalan' || p.status === 'Belum Mulai').length, 
      icon: Target, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50', 
      trend: `${data.proker.filter(p => p.status === 'Sedang Berjalan' || p.status === 'Belum Mulai').length} Aktif`, 
      isUp: true 
    },
    { 
      name: 'Aset Dipinjam', 
      value: data.peminjaman.filter(p => p.status === 'Dipinjam').length, 
      icon: Box, 
      color: 'text-cyan-600', 
      bg: 'bg-cyan-50', 
      trend: `${data.inventaris.length} Aset`, 
      isUp: true 
    },
  ];

  // Calculate real attendance data for the last 7 days
  const getChartData = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateStr: d.toLocaleDateString('id-ID'),
        dayName: days[d.getDay()],
        fullDate: d
      };
    });

    return last7Days.map(day => {
      const count = data.kehadiran.filter(k => k.tanggal === day.dateStr).length;
      return {
        name: day.dayName,
        value: count
      };
    });
  };

  const chartData = getChartData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-himars-dark uppercase tracking-tight">Dasbor Admin</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            {currentUser.department ? `Bidang ${currentUser.department.toUpperCase()} • ` : ''}
            Ringkasan Eksekutif HIMARS UMLA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Server</p>
            <p className="text-sm font-bold text-himars-dark">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              <span className="ml-2 text-himars-peach">{currentTime.toLocaleTimeString('id-ID')}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl glass-ios shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-himars-green" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.name}</h3>
                <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Statistik Presensi</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Aktivitas Mingguan</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold uppercase tracking-widest rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#1a1a1a' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">Log Aktivitas Admin</h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {(data.activityLogs || []).slice(0, 10).map((item, i) => (
              <div key={i} className="flex gap-4 items-start group/item">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover/item:bg-orange-50 group-hover/item:border-orange-100 transition-colors">
                  <User className="w-5 h-5 text-slate-400 group-hover/item:text-orange-600 transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{item.nama}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.details}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.timestamp}</p>
                </div>
              </div>
            ))}
            {(!data.activityLogs || data.activityLogs.length === 0) && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-sm text-slate-400 font-medium">Belum ada log aktivitas hari ini.</p>
              </div>
            )}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">
              Mencatat setiap pergerakan login anggota
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
