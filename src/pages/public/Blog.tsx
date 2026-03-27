import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Tag, Search, X, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import { AIGeneratedImage } from '../../components/AIGeneratedImage';

export default function Blog() {
  const { data } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const filteredNews = data.news.filter(news => 
    news.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.isi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 overflow-x-hidden text-slate-900 selection:bg-orange-500/30">
      {/* Cinematic Header */}
      <section className="relative py-32 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <img 
            src={data.settings.blogHeroImageUrl || undefined}
            alt="Blog Hero"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-orange-500 font-bold tracking-[0.3em] uppercase text-xs mb-6">
              Wawasan & Cerita
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase text-slate-900">Berita</h1>
            <p className="text-xl text-slate-600 font-light mb-12">
              Informasi terbaru, kegiatan, dan artikel seputar {data.settings.siteName}.
            </p>

            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Cari berita atau artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-full text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredNews.map((news, index) => (
              <motion.article 
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 flex flex-col hover:border-slate-300 hover:shadow-2xl hover:shadow-orange-500/10 transition-all cursor-pointer"
                onClick={() => setSelectedNews(news)}
              >
                <div className="h-64 bg-[#1a1a1a] relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                    src={news.coverImage || `https://picsum.photos/seed/${news.id}/800/600`}
                    alt={news.judul}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-[#1a1a1a]/90 backdrop-blur-sm text-emerald-500 border border-white/10 text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">
                      {news.kategori}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col">
                  <div className="flex items-center text-[10px] font-bold text-slate-500 mb-4 space-x-4 uppercase tracking-[0.2em]">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1.5 text-orange-500" />
                      {news.tanggal}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1.5 text-orange-500" />
                      {news.waktu}
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors tracking-tight">
                    {news.judul}
                  </h2>
                  <p className="text-slate-400 line-clamp-3 mb-8 flex-grow leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.isi) }} />
                  <div className="flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs">
                    Baca Selengkapnya <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Tag className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Tidak ada hasil ditemukan</h3>
            <p className="text-slate-600 font-light">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
          </motion.div>
        )}
      </div>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden border border-slate-200 flex flex-col shadow-2xl"
            >
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-8 right-8 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-600 hover:text-orange-500 transition-all shadow-lg border border-slate-200"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="overflow-y-auto custom-scrollbar">
                <div className="aspect-[21/9] w-full bg-slate-100">
                  <img 
                    src={selectedNews.coverImage || `https://picsum.photos/seed/${selectedNews.id}/1200/600`} 
                    className="w-full h-full object-cover opacity-80"
                    alt={selectedNews.judul}
                  />
                </div>
                
                <div className="p-10 sm:p-20">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="px-5 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold rounded-full uppercase tracking-[0.2em]">
                      {selectedNews.kategori}
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center uppercase tracking-[0.2em]">
                      <Calendar className="w-3 h-3 mr-2 text-orange-500" /> {selectedNews.tanggal}
                    </span>
                  </div>

                  <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-12 leading-tight tracking-tighter uppercase">
                    {selectedNews.judul}
                  </h2>

                  <div className="prose prose-slate max-w-none">
                    <div 
                      className="text-xl text-slate-600 leading-relaxed mb-8 font-light"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNews.isi) }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
