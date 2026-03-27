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
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border-b border-r border-slate-200 bg-slate-50/50"></div>);
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);

      days.push(
        <div key={day} className="h-24 md:h-32 border-b border-r border-slate-200 p-2 relative group hover:bg-slate-50 transition-colors">
          <span className={`text-sm font-bold ${dayEvents.length > 0 ? 'text-orange-500' : 'text-slate-500'}`}>
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className="text-[10px] md:text-xs p-1 rounded bg-orange-500/10 text-orange-500 font-semibold truncate border-l-2 border-orange-500"
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
    <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Kalender Kegiatan</h1>
            <p className="text-slate-600 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px]">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              <span className="ml-2 text-orange-500">{currentTime.toLocaleTimeString('id-ID')}</span>
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                <CalendarIcon className="h-6 w-6 text-orange-500" />
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
                  <ChevronLeft className="h-5 w-5 text-slate-600 hover:text-slate-900" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
                  <ChevronRight className="h-5 w-5 text-slate-600 hover:text-slate-900" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-l border-slate-200">
              {renderCalendar()}
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                <Info className="h-5 w-5 text-orange-500" /> Agenda Mendatang
              </h3>
              <div className="space-y-6">
                {events.map((event) => (
                  <motion.div 
                    key={event.id}
                    whileHover={{ x: 5 }}
                    className="group cursor-pointer p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all group-hover:border-orange-500">
                        <span className="text-[10px] font-bold uppercase text-slate-600 group-hover:text-white/80">{months[new Date(event.date).getMonth()].substr(0, 3)}</span>
                        <span className="text-xl font-black leading-none text-slate-900 group-hover:text-white">{new Date(event.date).getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded border border-slate-200">
                            {event.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">{event.title}</h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <Clock className="h-3.5 w-3.5 text-orange-500" /> {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-orange-500" /> {event.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-[2rem] shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-0"></div>
              <h3 className="text-xl font-black mb-4 leading-tight uppercase tracking-tight relative z-10">Punya Agenda atau Usulan Kegiatan?</h3>
              <p className="text-white/80 text-sm mb-8 leading-relaxed font-light relative z-10">
                Sampaikan aspirasi Anda melalui kanal aspirasi kami untuk kemajuan HIMARS yang lebih baik.
              </p>
              <button 
                onClick={() => window.location.href = '/aspirasi'}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-slate-800 transition-all border border-slate-800 relative z-10"
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
