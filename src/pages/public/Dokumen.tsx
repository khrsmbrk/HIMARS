import React from 'react';
import { useData } from '../../store/DataContext';
import { motion } from 'motion/react';
import { FileText, Download, File, Image as ImageIcon, FileVideo } from 'lucide-react';

export default function Dokumen() {
  const { data } = useData();
  
  // Filter only documents marked as public by admin
  const publicDocs = data.dokumen.filter(d => d.isPublic);

  // Group documents by category
  const groupedDocs = publicDocs.reduce((acc: Record<string, typeof publicDocs>, doc) => {
    const cat = doc.kategori || 'umum';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, typeof publicDocs>);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-orange-400" />;
    if (type.startsWith('video/')) return <FileVideo className="w-8 h-8 text-purple-400" />;
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
    return <File className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 overflow-x-hidden">
      {/* Cinematic Header */}
      <section className="bg-white text-slate-900 py-32 relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <img 
            src={data.settings.dokumenHeroImageUrl || undefined}
            alt="Dokumen Hero"
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-emerald-500 font-bold tracking-[0.3em] uppercase text-xs mb-6">
              Sumber Daya & Transparansi
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase">Dokumen Publik</h1>
            <p className="text-xl text-slate-600 font-light">
              Transparansi organisasi melalui publikasi laporan, proposal, dan dokumen umum lainnya.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-16">
        {Object.keys(groupedDocs).length > 0 ? (
          Object.keys(groupedDocs).map((category, catIndex) => {
            const docs = groupedDocs[category];
            return (
              <div key={category}>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 tracking-tight uppercase"
                >
                  <span className="w-12 h-[1px] bg-orange-500"></span>
                  <span className="capitalize">{category}</span>
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl"
                >
                  <ul className="divide-y divide-slate-200">
                    {docs.map((doc, index) => (
                      <motion.li 
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 sm:p-10 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-center justify-between group gap-8"
                      >
                        <div className="flex items-center space-x-8 text-center sm:text-left flex-col sm:flex-row">
                          <div className="p-6 bg-slate-50 rounded-3xl group-hover:bg-emerald-500/10 transition-colors border border-slate-200">
                            {getFileIcon(doc.tipe)}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-3">
                              {doc.nama}
                            </h3>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start text-[10px] font-bold text-slate-500 gap-4 uppercase tracking-[0.2em]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                {(doc.ukuran / 1024).toFixed(1)} KB
                              </span>
                              <span className="flex items-center gap-1.5">
                                <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                {doc.tanggal}
                              </span>
                            </div>
                          </div>
                        </div>
                        <motion.a 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={doc.url} 
                          download={doc.nama}
                          className="p-5 text-slate-600 hover:text-white hover:bg-orange-500 rounded-full transition-all bg-slate-50 border border-slate-200"
                          title="Download"
                        >
                          <Download className="w-6 h-6" />
                        </motion.a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-slate-200 shadow-xl"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200">
              <FileText className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Tidak ada dokumen tersedia</h3>
            <p className="text-slate-500 font-light">Dokumen publik akan dicantumkan di sini setelah diterbitkan.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
