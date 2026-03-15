import React, { useRef } from 'react';
import { useData } from '../../store/DataContext';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { AIGeneratedImage } from '../../components/AIGeneratedImage';
import { 
  Youtube,
  Play,
  Sparkles, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Users,
  Newspaper,
  FileText,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function Home() {
  const { data } = useData();
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const pillars = [
    {
      title: "Struktur Organisasi",
      description: "Mengenal lebih dekat para pengurus HIMARS Administrasi Rumah Sakit periode ini.",
      path: "/struktur",
      icon: Users,
      prompt: "Indonesian university students wearing olive green uniform shirts, organizing an event, holding clipboards and talking. High quality, cinematic lighting, realistic, photography."
    },
    {
      title: "Berita",
      description: "Ikuti perkembangan terbaru, kegiatan, dan artikel menarik dari program studi kami.",
      path: "/blog",
      icon: Newspaper,
      prompt: "Close up of Indonesian university students wearing olive green uniform shirts, working on laptops together. High quality, cinematic lighting, realistic, photography."
    },
    {
      title: "Dokumen Publik",
      description: "Akses laporan kegiatan, transparansi keuangan, dan dokumen publik lainnya.",
      path: "/dokumen",
      icon: FileText,
      prompt: "Indonesian university students wearing olive green uniform shirts, presenting in front of a class. High quality, cinematic lighting, realistic, photography."
    }
  ];

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          <section key="hero" className="relative min-h-screen flex items-center overflow-hidden bg-transparent pt-20">
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
              <img 
                src={data.settings.heroImageUrl || undefined}
                alt="Hero Background"
                className="w-full h-full object-cover opacity-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fffaf5] via-[#fffaf5]/80 to-transparent"></div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20 text-center flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="max-w-4xl flex flex-col items-center"
              >
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-orange-100"
                >
                  {data.settings.siteName} UMLA
                </motion.span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
                  {data.settings.heroTitle.split(' ').map((word, i) => (
                    <React.Fragment key={i}>
                      {word === 'Administrator' ? <span className="text-orange-600">{word}</span> : word}{' '}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-medium mb-12 max-w-2xl leading-relaxed">
                  {data.settings.heroSubtitle}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    to="/blog" 
                    className="group inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-bold text-sm shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95"
                  >
                    Lihat Kegiatan
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/profil" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 rounded-full font-bold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                  >
                    Tentang Kami
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        );
      case 'stats':
        return (
          <section key="stats" className="py-24 glass-ios border-y border-white/40 relative z-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: ShieldCheck, color: "text-himars-peach", title: "Integritas", desc: "Menjunjung tinggi nilai kejujuran dan etika profesi." },
                { icon: Award, color: "text-himars-green", title: "Prestasi", desc: "Mendorong mahasiswa untuk unggul di bidang akademik dan non-akademik." },
                { icon: Sparkles, color: "text-himars-peach", title: "Inovasi", desc: "Beradaptasi dengan perkembangan teknologi kesehatan modern." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.2, duration: 0.8, type: "spring" }}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-himars-dark group-hover:text-himars-peach transition-colors">{feature.title}</h3>
                    <p className="text-slate-500 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      case 'visi-misi':
        return (
          <section key="visi-misi" className="py-32 glass-ios overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-200px" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                    <img 
                      src={data.settings.visiMisiImageUrl || undefined}
                      alt="Visi Misi"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-himars-green/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-himars-peach/20 rounded-full blur-3xl"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-200px" }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <span className="text-himars-peach font-bold tracking-widest uppercase text-xs mb-4 block">Visi & Misi</span>
                  <h2 className="font-serif text-4xl md:text-6xl text-himars-dark mb-8 leading-tight">
                    {data.settings.visiMisiTitle.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word === 'Ekselensi' ? <span className="italic font-light">{word}</span> : word}{' '}
                        {i === 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h2>
                  <div className="space-y-8">
                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="p-8 glass-ios rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 hover:border-himars-green/30 transition-all group"
                    >
                      <h4 className="font-serif text-2xl text-himars-dark mb-3 group-hover:text-himars-green transition-colors">Visi Kami</h4>
                      <p className="text-slate-600 leading-relaxed italic">
                        "{data.settings.visiMisiText}"
                      </p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="p-8 glass-ios rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 hover:border-himars-peach/30 transition-all group"
                    >
                      <h4 className="font-serif text-2xl text-himars-dark mb-3 group-hover:text-himars-peach transition-colors">Misi Kami</h4>
                      <p className="text-slate-600 leading-relaxed">
                        Menyelenggarakan pendidikan bermutu tinggi, meningkatkan penelitian inovatif, dan mengembangkan kemitraan strategis berlandaskan nilai keislaman.
                      </p>
                    </motion.div>
                  </div>
                  <Link to="/profil" className="mt-10 inline-flex items-center gap-3 text-himars-dark font-bold uppercase tracking-widest text-sm border-b-2 border-himars-peach pb-1 hover:text-himars-peach transition-colors">
                    Selengkapnya <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        );
      case 'pillars':
        return (
          <section key="pillars" className="py-32 glass-ios">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <span className="text-himars-green font-bold tracking-widest uppercase text-xs mb-4 block">Navigasi Utama</span>
                  <h2 className="font-serif text-4xl md:text-6xl text-himars-dark leading-tight">
                    Pilar utama <br className="hidden md:block" />
                    <span className="italic font-light">organisasi</span> kami.
                  </h2>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Link to="/profil" className="group flex items-center gap-3 text-himars-peach font-bold uppercase tracking-widest text-sm">
                    Lihat Profil Prodi <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {pillars.map((pillar, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group cursor-pointer"
                  >
                    <Link to={pillar.path}>
                      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl shadow-slate-200">
                        <img 
                          src={data.settings.pillarImages[index] || `https://picsum.photos/seed/pillar${index}/800/1000`}
                          alt={pillar.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-center">
                          <pillar.icon className="w-12 h-12 text-white mx-auto mb-4" />
                          <span className="text-white font-bold uppercase tracking-widest text-xs">
                            Buka Halaman
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-2xl text-himars-dark mb-2 group-hover:text-himars-peach transition-colors">{pillar.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">{pillar.description}</p>
                      </div>
                      <ArrowRight className="text-himars-peach w-6 h-6 mt-1 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'program-kerja':
        return (
          <section key="program-kerja" className="py-32 bg-transparent">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-20">
                <span className="text-himars-green font-bold tracking-widest uppercase text-xs mb-4 block">Agenda & Kegiatan</span>
                <h2 className="font-serif text-4xl md:text-6xl text-himars-dark">
                  Program <span className="italic font-light">Kerja Unggulan</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[700px]">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-2 md:row-span-2 bg-himars-dark rounded-[2.5rem] overflow-hidden relative group"
                >
                  <img 
                    src={data.settings.prokerImageUrl || undefined} 
                    alt="Program Kerja" 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 p-12 flex flex-col justify-end">
                    <span className="text-himars-peach font-bold uppercase tracking-widest text-xs mb-4">Acara Tahunan</span>
                    <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">Seminar Nasional Administrasi RS</h3>
                    <p className="text-white/60 text-sm max-w-md">
                      Pertemuan ilmiah tahunan yang menghadirkan pakar manajemen kesehatan untuk membahas tantangan industri RS masa depan.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-2 glass-ios rounded-[2.5rem] p-10 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 bg-himars-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-himars-green group-hover:text-white transition-colors">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-serif text-himars-dark mb-3">Latihan Kepemimpinan</h3>
                    <p className="text-slate-500 text-sm">
                      Membentuk karakter pemimpin masa depan yang berintegritas dan memiliki visi strategis dalam organisasi.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-himars-green font-bold text-xs uppercase tracking-widest">
                    Detail Program <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-himars-peach rounded-[2.5rem] p-10 flex flex-col justify-between group"
                >
                  <div className="text-white">
                    <h3 className="text-xl font-serif mb-3">Bakti Sosial</h3>
                    <p className="text-white/80 text-xs">
                      Kontribusi nyata mahasiswa kepada masyarakat melalui edukasi kesehatan.
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center self-end">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="glass-ios rounded-[2.5rem] p-10 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex flex-col justify-between group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Newspaper className="w-5 h-5 text-himars-dark" />
                  </div>
                  <h3 className="text-lg font-serif text-himars-dark">Buletin ARS</h3>
                  <p className="text-slate-500 text-xs">
                    Publikasi rutin karya tulis dan riset mahasiswa.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        );
      case 'video':
        return (
          <section key="video" className="py-32 glass-ios">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-himars-peach font-bold tracking-widest uppercase text-xs mb-4 block">HIMARS Media</span>
                  <h2 className="font-serif text-4xl md:text-6xl text-himars-dark mb-8 leading-tight">
                    Tonton <span className="italic font-light text-himars-peach">Podcast</span> <br />
                    & Video Terbaru Kami.
                  </h2>
                  <p className="text-slate-500 text-lg mb-10 font-light leading-relaxed">
                    Ikuti diskusi menarik seputar dunia Administrasi Rumah Sakit, tips karir, dan kegiatan mahasiswa melalui channel YouTube resmi kami.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <a 
                      href={data.settings.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-black rounded-full uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                    >
                      <Youtube className="w-5 h-5" /> Langganan YouTube
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 relative">
                    <iframe 
                      src={data.settings.podcastUrl || undefined}
                      title="HIMARS Podcast"
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-himars-peach rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <Play className="w-10 h-10 text-white fill-current" />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );
      case 'kontak':
        return (
          <section key="kontak" className="py-24 glass-ios-dark relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
              <img 
                src={data.settings.kontakImageUrl || undefined} 
                alt="Pola Latar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-8">
                  Mari Berkarya Bersama
                </h2>
                <p className="text-xl text-slate-300 font-medium mb-12 leading-relaxed">
                  Mari bergabung bersama HIMARS UMLA untuk mewujudkan sistem pelayanan kesehatan Indonesia yang lebih baik, efisien, dan Islami.
                </p>
                <a 
                  href="https://www.instagram.com/himars_umla" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-10 py-5 bg-himars-peach text-white rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_50px_rgba(217,119,6,0.3)] hover:bg-himars-peach/90 transition-all active:scale-95"
                >
                  Ikuti Kami di Instagram
                </a>
              </motion.div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-liquid font-sans overflow-x-hidden">
      {data.settings.homeSections
        .filter(section => section.enabled)
        .map(section => renderSection(section.id))}
    </div>
  );
}
