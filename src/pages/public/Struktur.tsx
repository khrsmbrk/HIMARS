import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../../store/DataContext';
import { Link } from 'react-router-dom';
import { Shield, FileText, Wallet, Users, Newspaper } from 'lucide-react';
import { AIGeneratedImage } from '../../components/AIGeneratedImage';

export default function Struktur() {
  const { data } = useData();
  const formatur = data.settings.formatur || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const departments = [
    { id: 'ketua-wakil', title: 'Ketua & Wakil', icon: Shield, color: 'hover:bg-[#1a1a1a]' },
    { id: 'sekretaris', title: 'Sekretaris', icon: FileText, color: 'hover:bg-emerald-500' },
    { id: 'bendahara', title: 'Bendahara', icon: Wallet, color: 'hover:bg-orange-500' },
    { id: 'paik', title: 'PENAK', icon: Users, color: 'hover:bg-orange-600' },
    { id: 'litbang', title: 'Litbang', icon: Newspaper, color: 'hover:bg-orange-600' },
    { id: 'pengmas', title: 'PENGAPMAS', icon: Users, color: 'hover:bg-purple-600' },
    { id: 'medkom', title: 'Medkom', icon: Newspaper, color: 'hover:bg-red-600' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-900 selection:bg-orange-500/30">
      {/* Cinematic Header */}
      <section className="relative py-32 overflow-hidden mb-20 border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <img 
            src={data.settings.strukturHeroImageUrl || undefined}
            alt="Struktur Hero"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-orange-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
            >
              Struktur Organisasi
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight uppercase tracking-tighter"
            >
              Struktur Organisasi
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 font-medium uppercase tracking-widest text-xs"
            >
              Himpunan Mahasiswa Administrasi Rumah Sakit Periode 2023/2024
            </motion.p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Department Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-20">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <Link 
                key={dept.id}
                to={`/struktur/${dept.id}`}
                className={`flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] border border-slate-200 transition-all duration-300 group ${dept.color.replace('hover:bg-[#1a1a1a]', 'hover:bg-slate-100')} hover:text-white hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10`}
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors border border-slate-200">
                  <Icon className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center text-slate-600 group-hover:text-white">{dept.title}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-xl"
          >
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center border-b border-slate-200 pb-8 uppercase tracking-tight">
              Formatur Kepengurusan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {formatur.map((person) => (
                <motion.div 
                  key={person.id} 
                  variants={itemVariants}
                  className="text-center group"
                >
                  <div className="relative w-48 h-48 mx-auto mb-8">
                    <div className="absolute inset-0 bg-orange-500 rounded-full scale-0 group-hover:scale-105 transition-transform duration-500 opacity-20"></div>
                    <div className="relative w-full h-full bg-slate-50 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 group-hover:shadow-orange-500/20 group-hover:-translate-y-2">
                      <img 
                        src={person.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.nama}&backgroundColor=f9a875`} 
                        alt={person.nama}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">{person.nama || 'Nama Belum Diatur'}</h3>
                  <div className="flex flex-col gap-1 items-center">
                    <p className="text-sm text-emerald-600 font-bold uppercase tracking-widest">{person.jabatan || 'Jabatan Belum Diatur'}</p>
                    {person.departemen && (
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                        {person.departemen}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bagan Organisasi */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-xl overflow-x-auto"
          >
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center border-b border-slate-200 pb-8 uppercase tracking-tight">
              Bagan Organisasi
            </h2>
            
            <div className="min-w-[800px] flex flex-col items-center pb-12">
              {/* Ketua */}
              <div className="flex flex-col items-center">
                {formatur.filter(p => p.jabatan?.toLowerCase().includes('ketua') && !p.jabatan?.toLowerCase().includes('wakil')).map(person => (
                  <div key={person.id} className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg z-10 relative">
                      <img src={person.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.nama}&backgroundColor=f9a875`} alt={person.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-slate-200 mt-[-1rem] pt-6 z-0 text-center min-w-[160px]">
                      <h4 className="font-bold text-slate-900 text-sm uppercase">{person.nama}</h4>
                      <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest">{person.jabatan}</p>
                    </div>
                  </div>
                ))}
                
                {/* Line down from Ketua */}
                <div className="w-px h-8 bg-slate-300"></div>
                
                {/* Wakil Ketua */}
                {formatur.filter(p => p.jabatan?.toLowerCase().includes('wakil ketua')).map(person => (
                  <div key={person.id} className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg z-10 relative">
                      <img src={person.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.nama}&backgroundColor=50b498`} alt={person.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-slate-200 mt-[-1rem] pt-6 z-0 text-center min-w-[160px]">
                      <h4 className="font-bold text-slate-900 text-sm uppercase">{person.nama}</h4>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{person.jabatan}</p>
                    </div>
                  </div>
                ))}

                {/* Line down from Wakil */}
                <div className="w-px h-8 bg-slate-300"></div>
              </div>

              {/* Sekre & Bendum */}
              <div className="flex justify-center w-full max-w-2xl relative">
                {/* Horizontal line connecting Sekre and Bendum */}
                <div className="absolute top-10 left-1/4 right-1/4 h-px bg-slate-300 z-0"></div>
                
                <div className="flex justify-between w-full px-12 z-10">
                  {/* Sekretaris */}
                  <div className="flex flex-col items-center">
                    {formatur.filter(p => p.jabatan?.toLowerCase().includes('sekretaris')).map(person => (
                      <div key={person.id} className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg z-10 relative">
                          <img src={person.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.nama}&backgroundColor=60a5fa`} alt={person.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="bg-white px-3 py-2 rounded-xl shadow-md border border-slate-200 mt-[-1rem] pt-5 z-0 text-center min-w-[140px]">
                          <h4 className="font-bold text-slate-900 text-xs uppercase">{person.nama}</h4>
                          <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">{person.jabatan}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bendahara */}
                  <div className="flex flex-col items-center">
                    {formatur.filter(p => p.jabatan?.toLowerCase().includes('bendahara')).map(person => (
                      <div key={person.id} className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg z-10 relative">
                          <img src={person.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.nama}&backgroundColor=fbbf24`} alt={person.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="bg-white px-3 py-2 rounded-xl shadow-md border border-slate-200 mt-[-1rem] pt-5 z-0 text-center min-w-[140px]">
                          <h4 className="font-bold text-slate-900 text-xs uppercase">{person.nama}</h4>
                          <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest">{person.jabatan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line down to departments */}
              <div className="w-px h-8 bg-slate-300"></div>
              
              {/* Departments */}
              <div className="relative w-full mt-4">
                {/* Horizontal line for departments */}
                <div className="absolute top-0 left-[10%] right-[10%] h-px bg-slate-300"></div>
                
                <div className="flex justify-between pt-8 px-4">
                  {departments.map((dept, index) => {
                    // Find head of department
                    const head = formatur.find(p => p.departemen === dept.id && p.jabatan?.toLowerCase().includes('kepala'));
                    
                    return (
                      <div key={dept.id} className="flex flex-col items-center relative w-1/5 px-2">
                        {/* Vertical line connecting to horizontal line */}
                        <div className="absolute -top-8 left-1/2 w-px h-8 bg-slate-300"></div>
                        
                        <div className={`w-full py-2 rounded-t-xl text-center text-[10px] font-black uppercase tracking-widest text-white ${dept.color.split(' ')[0].replace('hover:', '')}`}>
                          {dept.title}
                        </div>
                        
                        <div className="bg-white w-full border border-slate-200 rounded-b-xl shadow-md p-3 flex flex-col items-center">
                          {head ? (
                            <>
                              <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 mb-2">
                                <img src={head.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${head.nama}`} alt={head.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <h4 className="font-bold text-slate-900 text-[10px] uppercase text-center leading-tight">{head.nama}</h4>
                              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1 text-center">Kadiv</p>
                            </>
                          ) : (
                            <p className="text-[10px] text-slate-400 italic">Belum ada Kadiv</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
