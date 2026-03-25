import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, X, ZoomIn, Calendar, MapPin } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    title: 'Milad HIMARS ke-5',
    category: 'Event',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    date: '12 Januari 2024',
    location: 'Auditorium UMLA'
  },
  {
    id: 2,
    title: 'Rapat Kerja Tahunan',
    category: 'Internal',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    date: '5 Februari 2024',
    location: 'Ruang Rapat HIMARS'
  },
  {
    id: 3,
    title: 'Bakti Sosial Ramadhan',
    category: 'Sosial',
    image: 'https://images.unsplash.com/photo-1469571483333-243f85122899?auto=format&fit=crop&w=800&q=80',
    date: '20 Maret 2024',
    location: 'Panti Asuhan Lamongan'
  },
  {
    id: 4,
    title: 'Seminar Kesehatan Nasional',
    category: 'Akademik',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    date: '15 April 2024',
    location: 'Gedung Serbaguna UMLA'
  },
  {
    id: 5,
    title: 'Latihan Kepemimpinan Mahasiswa',
    category: 'Kaderisasi',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    date: '10 Mei 2024',
    location: 'Villa Pacet'
  },
  {
    id: 6,
    title: 'HIMARS Cup 2024',
    category: 'Minat Bakat',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    date: '25 Juni 2024',
    location: 'Lapangan Olahraga UMLA'
  }
];

const categories = ['Semua', 'Event', 'Internal', 'Sosial', 'Akademik', 'Kaderisasi', 'Minat Bakat'];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = selectedCategory === 'Semua' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Galeri Kegiatan</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Dokumentasi berbagai momen berharga dan kegiatan yang telah dilaksanakan oleh Himpunan Mahasiswa Program Studi Administrasi Rumah Sakit.
            </p>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-himars-peach text-white shadow-lg shadow-himars-peach/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="text-white h-10 w-10" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-himars-peach/10 text-himars-peach text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {item.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-10 w-10" />
              </button>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1">
                  <img 
                    src={selectedImage.image} 
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-80 p-8 flex flex-col justify-center">
                  <span className="text-himars-peach font-bold text-xs uppercase tracking-widest mb-4">
                    {selectedImage.category}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mb-6 leading-tight">
                    {selectedImage.title}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar className="h-5 w-5 text-himars-peach" />
                      <span className="text-sm font-medium">{selectedImage.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="h-5 w-5 text-himars-peach" />
                      <span className="text-sm font-medium">{selectedImage.location}</span>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-500 italic leading-relaxed">
                      "Dokumentasi ini merupakan bagian dari sejarah perjalanan HIMARS dalam memberikan kontribusi terbaik bagi mahasiswa ARS."
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
