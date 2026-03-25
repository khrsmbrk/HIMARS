import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Tag, Info } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Rapat Kerja HIMARS 2024',
    date: '2024-03-15',
    time: '09:00 - 15:00',
    location: 'Ruang Rapat HIMARS',
    category: 'Internal',
    description: 'Penyusunan program kerja strategis untuk satu periode ke depan.'
  },
  {
    id: 2,
    title: 'Seminar Nasional Administrasi RS',
    date: '2024-03-22',
    time: '08:00 - 12:00',
    location: 'Auditorium UMLA',
    category: 'Akademik',
    description: 'Menghadirkan pakar manajemen rumah sakit untuk membahas tantangan era digital.'
  },
  {
    id: 3,
    title: 'Bakti Sosial Ramadhan',
    date: '2024-04-05',
    time: '16:00 - 18:30',
    location: 'Panti Asuhan Lamongan',
    category: 'Sosial',
    description: 'Berbagi kebahagiaan dan buka puasa bersama anak-anak panti asuhan.'
  },
  {
    id: 4,
    title: 'Milad HIMARS ke-5',
    date: '2024-04-12',
    time: '19:00 - 21:30',
    location: 'Gedung Serbaguna UMLA',
    category: 'Event',
    description: 'Perayaan hari jadi HIMARS yang ke-5 dengan berbagai penampilan seni.'
  }
];

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border-b border-r border-slate-100 bg-slate-50/30"></div>);
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);

      days.push(
        <div key={day} className="h-24 md:h-32 border-b border-r border-slate-100 p-2 relative group hover:bg-slate-50 transition-colors">
          <span className={`text-sm font-bold ${dayEvents.length > 0 ? 'text-himars-peach' : 'text-slate-400'}`}>
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className="text-[10px] md:text-xs p-1 rounded bg-himars-peach/10 text-himars-peach font-semibold truncate border-l-2 border-himars-peach"
                title={event.title}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Kalender Kegiatan</h1>
            <p className="text-slate-600 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px]">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              <span className="ml-2 text-himars-peach">{currentTime.toLocaleTimeString('id-ID')}</span>
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <CalendarIcon className="h-6 w-6 text-himars-peach" />
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <ChevronLeft className="h-5 w-5 text-slate-600" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <ChevronRight className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-l border-slate-100">
              {renderCalendar()}
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <Info className="h-5 w-5 text-himars-peach" /> Agenda Mendatang
              </h3>
              <div className="space-y-6">
                {events.map((event) => (
                  <motion.div 
                    key={event.id}
                    whileHover={{ x: 5 }}
                    className="group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-himars-peach/10 rounded-2xl flex flex-col items-center justify-center shrink-0 group-hover:bg-himars-peach group-hover:text-white transition-all">
                        <span className="text-xs font-bold uppercase">{months[new Date(event.date).getMonth()].substr(0, 3)}</span>
                        <span className="text-lg font-black leading-none">{new Date(event.date).getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded">
                            {event.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 group-hover:text-himars-peach transition-colors">{event.title}</h4>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <Clock className="h-3 w-3 text-himars-peach" /> {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <MapPin className="h-3 w-3 text-himars-peach" /> {event.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-himars-peach to-orange-600 rounded-3xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-black mb-4 leading-tight">Punya Agenda atau Usulan Kegiatan?</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Sampaikan aspirasi Anda melalui kanal aspirasi kami untuk kemajuan HIMARS yang lebih baik.
              </p>
              <button 
                onClick={() => window.location.href = '/aspirasi'}
                className="w-full py-3 bg-white text-himars-peach rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-all"
              >
                Kirim Aspirasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
