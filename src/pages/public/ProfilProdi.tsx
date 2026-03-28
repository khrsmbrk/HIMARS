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
    <div className="bg-slate-50 min-h-screen pb-20 overflow-x-hidden font-sans text-slate-900 selection:bg-orange-500/30">
      {/* Header Section */}
      <section ref={headerRef} className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden border-b border-slate-200">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={data.settings.profilHeroImageUrl || undefined}
            alt="Profil Hero"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50"></div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="inline-block text-himars-peach font-bold tracking-[0.3em] uppercase text-sm mb-6 border-l-2 border-himars-peach pl-4">
              Identitas Kami
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter uppercase text-slate-900">Profil Program Studi</h1>
            <p className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed max-w-2xl">
              S1 Administrasi Rumah Sakit - Fakultas Ilmu Kesehatan
              <br />
              <span className="text-slate-900 font-medium">Universitas Muhammadiyah Lamongan</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Editorial Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-20">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-xl border border-slate-200">
          
          {/* Sejarah Singkat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Sejarah Singkat</h2>
              <div className="w-20 h-1 bg-slate-300 mt-6"></div>
            </div>
            <div className="lg:col-span-8">
              <div className="prose prose-lg prose-slate text-slate-600 leading-relaxed">
                <p className="text-2xl font-medium text-slate-900 mb-6 leading-snug">
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
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Visi</h2>
              <div className="w-20 h-1 bg-orange-500 mt-6"></div>
            </div>
            <div className="lg:col-span-8">
              <p className="text-3xl md:text-4xl text-slate-900 leading-tight font-serif italic">
                "Menjadi program studi Administrasi Rumah Sakit (ARS) yang terkemuka, inovatif, islami, serta unggul dibidang rekam medik dan sistem teknologi informasi kesehatan pada tingkat nasional pada tahun 2033."
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-32">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Misi</h2>
              <div className="w-20 h-1 bg-emerald-500 mt-6"></div>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-12">
                {misiItems.map((item, i) => (
                  <li key={i} className="flex gap-6 md:gap-8 group">
                    <span className="text-5xl md:text-6xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors duration-500">
                      0{i + 1}
                    </span>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed pt-2 md:pt-4 font-medium group-hover:text-slate-900 transition-colors">
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
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Tujuan & Profil Lulusan</h2>
              <div className="w-20 h-1 bg-yellow-500 mt-6"></div>
            </div>
            <div className="lg:col-span-8 space-y-16">
              <div>
                <p className="text-2xl text-slate-900 leading-relaxed font-medium mb-12">
                  Menghasilkan lulusan administrasi rumah sakit yang profesional dan islami, unggul dibidang rekam medik dan sistem teknologi informasi kesehatan serta mampu bersaing di tingkat nasional.
                </p>
                
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Profil Lulusan Kami</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {["Pemimpin", "Pendidik", "Peneliti", "Inovator"].map((item) => (
                    <div key={item} className="border-b-2 border-slate-200 pb-4 group cursor-default">
                      <span className="font-black text-xl text-slate-700 uppercase tracking-tight group-hover:text-orange-500 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kompetensi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Kompetensi</h2>
              <div className="w-20 h-1 bg-slate-300 mt-6"></div>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Pengetahuan */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <BookOpen className="w-8 h-8 text-emerald-500" />
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Penguasaan Pengetahuan</h3>
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
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Keterampilan */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <Briefcase className="w-8 h-8 text-orange-500" />
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Keterampilan Khusus</h3>
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
                        <CheckCircle2 className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
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

