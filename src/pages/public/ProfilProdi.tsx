import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Shield, Target, Award, BookOpen, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useData } from '../../store/DataContext';

export default function ProfilProdi() {
  const { data } = useData();
  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const misiItems = [
    "Menyelenggarakan program pendidikan dan pengajaran ARS yang bermutu tinggi berdasarkan standart nasional perguruan tinggi berorientasi pada rekam medik dan sistem teknologi informasi berlandaskan nilai keislaman.",
    "Meningkatkan penelitian dan pengabdian masyarakat yang inovatif dibidang Administrasi Rumah Sakit khususnya rekam medik dan sistem teknologi informasi kesehatan sebagai pendukung proses pembelajaran dan pengembangan IPTEK untuk kesejahteraan umat.",
    "Mengembangkan networking dan kemitraan dengan lembaga dalam negeri dan luar negeri terkait perkembangan administrasi rumah sakit khususnya rekam medik dan sistem teknologi informasi kesehatan untuk meningkatkan kompetensi dan pendayagunaan lulusan.",
    "Mengimplementasikan dan mengembangkan nilai keislaman dan Kemuhammadiyahan dalam bidang ilmu administrasi rumah sakit.",
    "Mengembangkan good governance university secara bertahap dan berkesinambungan."
  ];

  return (
    <div className="bg-liquid min-h-screen pb-20 overflow-x-hidden font-sans">
      {/* Header Section */}
      <section ref={headerRef} className="bg-himars-dark text-white py-40 relative overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={data.settings.profilHeroImageUrl || undefined}
            alt="Profil Hero"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-himars-dark/90"></div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block text-himars-peach font-bold tracking-[0.3em] uppercase text-sm mb-6 border-l-2 border-himars-peach pl-4">
              Identitas Kami
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase">Profil Program Studi</h1>
            <p className="text-2xl text-slate-300 font-light leading-relaxed max-w-2xl">
              S1 Administrasi Rumah Sakit - Fakultas Ilmu Kesehatan
              <br />
              <span className="text-white font-medium">Universitas Muhammadiyah Lamongan</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Editorial Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-white rounded-t-[3rem] md:rounded-t-[4rem] p-8 md:p-16 lg:p-24 shadow-2xl">
          
          {/* Sejarah Singkat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <h2 className="text-4xl font-black text-himars-dark uppercase tracking-tighter">Sejarah Singkat</h2>
              <div className="w-20 h-1 bg-slate-200 mt-6"></div>
            </div>
            <div className="lg:col-span-8">
              <div className="prose prose-lg text-slate-600 leading-relaxed">
                <p className="text-2xl font-medium text-slate-800 mb-6 leading-snug">
                  Program Studi S1 Administrasi Rumah Sakit didirikan sebagai respon terhadap kebutuhan tenaga profesional di bidang manajemen kesehatan yang terus meningkat.
                </p>
                <p>
                  Dengan mengintegrasikan nilai-nilai keislaman dan kemuhammadiyahan, kami berkomitmen untuk mencetak administrator rumah sakit yang tidak hanya kompeten secara teknis, tetapi juga memiliki integritas moral yang tinggi dalam menghadapi tantangan industri kesehatan modern.
                </p>
              </div>
            </div>
          </div>

          {/* Visi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <h2 className="text-4xl font-black text-himars-dark uppercase tracking-tighter">Visi</h2>
              <div className="w-20 h-1 bg-himars-peach mt-6"></div>
            </div>
            <div className="lg:col-span-8">
              <p className="text-3xl md:text-4xl text-slate-800 leading-tight font-serif italic">
                "Menjadi program studi Administrasi Rumah Sakit (ARS) yang terkemuka, inovatif, islami, serta unggul dibidang rekam medik dan sistem teknologi informasi kesehatan pada tingkat nasional pada tahun 2033."
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <h2 className="text-4xl font-black text-himars-dark uppercase tracking-tighter">Misi</h2>
              <div className="w-20 h-1 bg-himars-green mt-6"></div>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-12">
                {misiItems.map((item, i) => (
                  <li key={i} className="flex gap-6 md:gap-8 group">
                    <span className="text-5xl md:text-6xl font-black text-slate-100 group-hover:text-himars-green transition-colors duration-500">
                      0{i + 1}
                    </span>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed pt-2 md:pt-4 font-medium">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tujuan & Profil Lulusan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <h2 className="text-4xl font-black text-himars-dark uppercase tracking-tighter">Tujuan & Profil Lulusan</h2>
              <div className="w-20 h-1 bg-himars-yellow mt-6"></div>
            </div>
            <div className="lg:col-span-8 space-y-16">
              <div>
                <p className="text-2xl text-slate-800 leading-relaxed font-medium mb-12">
                  Menghasilkan lulusan administrasi rumah sakit yang profesional dan islami, unggul dibidang rekam medik dan sistem teknologi informasi kesehatan serta mampu bersaing di tingkat nasional.
                </p>
                
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Profil Lulusan Kami</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {["Pemimpin", "Pendidik", "Peneliti", "Inovator"].map((item) => (
                    <div key={item} className="border-b-2 border-slate-100 pb-4 group cursor-default">
                      <span className="font-black text-xl text-slate-800 uppercase tracking-tight group-hover:text-himars-peach transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kompetensi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <h2 className="text-4xl font-black text-himars-dark uppercase tracking-tighter">Kompetensi</h2>
              <div className="w-20 h-1 bg-slate-800 mt-6"></div>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Pengetahuan */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <BookOpen className="w-8 h-8 text-himars-green" />
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Penguasaan Pengetahuan</h3>
                  </div>
                  <ul className="space-y-6">
                    {[
                      "Konsep rumah sakit dan analisis data informasi kesehatan.",
                      "Perencanaan dan pengelolaan organisasi manajemen pelayanan kesehatan.",
                      "Analisis sosiokultural dan lingkungan kerja rumah sakit.",
                      "Advokasi dan pemberdayaan kegiatan dukungan sosial.",
                      "Kepemimpinan, berpikir sistem, dan budaya kewirausahaan."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-himars-green shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Keterampilan */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <Briefcase className="w-8 h-8 text-himars-peach" />
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Keterampilan Khusus</h3>
                  </div>
                  <ul className="space-y-6">
                    {[
                      "Membangun dan mengembangkan organisasi profesi ARS.",
                      "Menginisiasi perubahan staf dan manajemen RS.",
                      "Menilai kinerja pelayanan berbasis IT.",
                      "Penyelenggaraan kemitraan dengan pasien dan keluarga.",
                      "Pengendalian ancaman kesehatan dan surveilans data."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-himars-peach shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

