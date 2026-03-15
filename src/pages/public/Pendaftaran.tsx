import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle, AlertCircle, Upload, Phone, Mail, User, Hash, GraduationCap, Briefcase } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { kirimKeSheet } from '../../utils/kirimKeSheet';

export default function Pendaftaran() {
  const { addAnggota } = useData();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    angkatan: '',
    divisi: '',
    noHp: '',
    jabatan: 'Anggota',
    status: 'Aktif' as const,
    foto: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const registrationData = {
      ...formData,
      foto: formData.foto ? '[Base64 Image Data]' : 'No Photo'
    };

    // Save to local context
    addAnggota(formData);

    // Sync to Google Sheets
    await kirimKeSheet(registrationData, 'Pendaftaran Anggota');

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-slate-600 mb-8">
            Terima kasih telah mendaftar sebagai anggota HIMARS. Data Anda telah kami terima dan akan segera diproses oleh pengurus.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-himars-peach text-white rounded-xl font-semibold shadow-lg shadow-himars-peach/20 hover:bg-himars-peach/90 transition-all"
          >
            Kembali ke Beranda
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Pendaftaran Anggota</h1>
            <p className="text-slate-600">Bergabunglah bersama kami untuk mewujudkan administrator kesehatan masa depan.</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-himars-peach" /> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    required
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-himars-peach focus:ring-2 focus:ring-himars-peach/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-himars-peach" /> NIM
                  </label>
                  <input
                    type="text"
                    name="nim"
                    required
                    value={formData.nim}
                    onChange={handleInputChange}
                    placeholder="Masukkan NIM"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-himars-peach focus:ring-2 focus:ring-himars-peach/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-himars-peach" /> Angkatan
                  </label>
                  <input
                    type="text"
                    name="angkatan"
                    required
                    value={formData.angkatan}
                    onChange={handleInputChange}
                    placeholder="Contoh: 2023"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-himars-peach focus:ring-2 focus:ring-himars-peach/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-himars-peach" /> Divisi / Departemen
                  </label>
                  <select
                    name="divisi"
                    required
                    value={formData.divisi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-himars-peach focus:ring-2 focus:ring-himars-peach/20 outline-none transition-all"
                  >
                    <option value="">Pilih Divisi</option>
                    <option value="BPH">BPH</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                    <option value="Medkom">Medkom</option>
                    <option value="Kaderisasi">Kaderisasi</option>
                    <option value="Minat Bakat">Minat Bakat</option>
                    <option value="Sosial Masyarakat">Sosial Masyarakat</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-himars-peach" /> No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="noHp"
                    required
                    value={formData.noHp}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-himars-peach focus:ring-2 focus:ring-himars-peach/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Upload className="h-4 w-4 text-himars-peach" /> Foto Profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-himars-peach/10 file:text-himars-peach hover:file:bg-himars-peach/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-himars-peach text-white rounded-2xl font-bold text-lg shadow-xl shadow-himars-peach/20 hover:bg-himars-peach/90 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-5 w-5" /> Daftar Sekarang
                </button>
              </div>

              <p className="text-xs text-slate-400 text-center mt-4">
                Dengan mendaftar, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi HIMARS.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
