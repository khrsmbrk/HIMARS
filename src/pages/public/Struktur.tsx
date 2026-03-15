import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../../store/DataContext';
import { Link } from 'react-router-dom';
import { Shield, FileText, Wallet, Users, Newspaper } from 'lucide-react';
import { AIGeneratedImage } from '../../components/AIGeneratedImage';

export default function Struktur() {
  const { data } = useData();
  const formatur = data.settings.formatur;

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
    { id: 'ketua-wakil', title: 'Ketua & Wakil', icon: Shield, color: 'hover:bg-himars-dark' },
    { id: 'sekretaris', title: 'Sekretaris', icon: FileText, color: 'hover:bg-himars-green' },
    { id: 'bendahara', title: 'Bendahara', icon: Wallet, color: 'hover:bg-himars-peach' },
    { id: 'paik', title: 'PENAK', icon: Users, color: 'hover:bg-orange-600' },
    { id: 'litbang', title: 'Litbang', icon: Newspaper, color: 'hover:bg-orange-600' },
    { id: 'pengmas', title: 'PENGAPMAS', icon: Users, color: 'hover:bg-purple-600' },
    { id: 'medkom', title: 'Medkom', icon: Newspaper, color: 'hover:bg-red-600' },
  ];

  return (
    <div className="bg-liquid min-h-screen pb-24">
      {/* Cinematic Header */}
      <section className="bg-himars-dark text-white py-32 relative overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={data.settings.strukturHeroImageUrl || undefined}
            alt="Struktur Hero"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-himars-peach font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
            >
              Struktur Organisasi
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight uppercase tracking-tighter"
            >
              Struktur Organisasi
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300 font-medium uppercase tracking-widest text-xs"
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
                className={`flex flex-col items-center justify-center p-6 glass-ios rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 transition-all duration-300 group ${dept.color} hover:text-white hover:-translate-y-2 hover:shadow-xl`}
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <Icon className="w-6 h-6 text-himars-dark group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center">{dept.title}</span>
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
            className="glass-ios rounded-[3rem] p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40"
          >
            <h2 className="text-3xl font-black text-himars-dark mb-12 text-center border-b border-slate-50 pb-8 uppercase tracking-tight">
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
                    <div className="absolute inset-0 bg-himars-peach rounded-full scale-0 group-hover:scale-105 transition-transform duration-500 opacity-20"></div>
                    <div className="relative w-full h-full bg-slate-50 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 group-hover:shadow-himars-peach/20 group-hover:-translate-y-2">
                      <img 
                        src={person.foto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.nama}&backgroundColor=f9a875`} 
                        alt={person.nama}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-himars-dark mb-1 uppercase tracking-tight">{person.nama || 'Nama Belum Diatur'}</h3>
                  <div className="flex flex-col gap-1 items-center">
                    <p className="text-sm text-himars-green font-bold uppercase tracking-widest">{person.jabatan || 'Jabatan Belum Diatur'}</p>
                    {person.departemen && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                        {person.departemen}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
