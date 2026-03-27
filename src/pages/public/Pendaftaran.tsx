import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, CheckCircle, FileText, Download, Paperclip } from 'lucide-react';
import { useData } from '../../store/DataContext';

export default function Pendaftaran() {
  const { data, addPendaftaran } = useData();
  const formSettings = data.formSettings;
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isRegistrationOpen = () => {
    if (!formSettings || !formSettings.isActive) return false;
    const now = new Date();
    const start = formSettings.startDate ? new Date(formSettings.startDate) : new Date(0);
    const end = formSettings.endDate ? new Date(formSettings.endDate) : new Date(8640000000000000);
    return now >= start && now <= end;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileChange = async (fieldId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const filePromises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    const base64Files = await Promise.all(filePromises);
    handleInputChange(fieldId, base64Files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract standard fields if they exist, otherwise put everything in formDataDinamis
    const standardFields = ['namaLengkap', 'nim', 'angkatan', 'noHp', 'email', 'alasanBergabung'];
    const standardData: any = {};
    const dinamisData: any = {};
    const fileUploads: { label: string; url: string }[] = [];

    Object.keys(formData).forEach(key => {
      const fieldDef = formSettings?.fields.find(f => f.id === key);
      if (fieldDef?.type === 'file') {
        // formData[key] is an array of base64 strings
        const files = formData[key] as string[];
        if (files && files.length > 0) {
          files.forEach((fileUrl, index) => {
            fileUploads.push({
              label: files.length > 1 ? `${fieldDef.label} (${index + 1})` : fieldDef.label,
              url: fileUrl
            });
          });
        }
      } else if (standardFields.includes(key)) {
        standardData[key] = formData[key];
      } else {
        dinamisData[key] = formData[key];
      }
    });

    addPendaftaran({
      namaLengkap: standardData.namaLengkap || 'N/A',
      nim: standardData.nim || 'N/A',
      angkatan: standardData.angkatan || 'N/A',
      noHp: standardData.noHp || 'N/A',
      email: standardData.email || 'N/A',
      alasanBergabung: standardData.alasanBergabung || 'N/A',
      formDataDinamis: dinamisData,
      fileUploads: fileUploads,
      eventCategory: formSettings.eventCategory
    });
    
    setIsSubmitted(true);
  };

  if (!formSettings || !isRegistrationOpen()) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pendaftaran Ditutup</h1>
          <p className="text-slate-600">
            {formSettings?.announcementMessage || 'Tidak ada pendaftaran aktif saat ini. Pantau info terbaru di website HIMARS.'}
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pendaftaran Berhasil!</h2>
          <p className="text-slate-600">
            Terima kasih telah mendaftar. Data Anda telah kami terima dan akan segera diproses. 
            Silakan tunggu informasi selanjutnya melalui kontak yang telah Anda berikan.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({});
            }}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Kembali
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6"
          >
            <FileText className="w-4 h-4" />
            <span>Formulir Pendaftaran</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6"
          >
            {formSettings?.title || 'Formulir Pendaftaran'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            {formSettings?.description || 'Silakan lengkapi data diri Anda di bawah ini.'}
          </motion.p>

          {/* Important Dates */}
          {['Open Recruitment Pengurus HIMARS', 'LKMM Pra-TD', 'LKMM TD', 'LKMM TM', 'LKMM TL', 'PPK ORMAWA', 'P2MW', 'PKM'].includes(formSettings?.eventCategory || '') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
            >
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pendaftaran</div>
                <div className="text-sm font-medium text-slate-800">
                  {formSettings?.startDate ? new Date(formSettings.startDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'} <br/> s/d <br/>
                  {formSettings?.endDate ? new Date(formSettings.endDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Wawancara</div>
                <div className="text-sm font-medium text-slate-800">
                  {formSettings?.interviewStartDate ? new Date(formSettings.interviewStartDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'} <br/> s/d <br/>
                  {formSettings?.interviewEndDate ? new Date(formSettings.interviewEndDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pengumuman</div>
                <div className="text-sm font-medium text-slate-800">
                  {formSettings?.announcementDate ? new Date(formSettings.announcementDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-6 sm:p-10 border border-slate-100"
        >
          {formSettings?.attachments && formSettings.attachments.length > 0 && (
            <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                File Pendukung / Template
              </h3>
              <p className="text-xs text-blue-700 mb-4">Silakan unduh file berikut jika diperlukan untuk pendaftaran.</p>
              <div className="space-y-2">
                {formSettings.attachments.map(att => (
                  <a
                    key={att.id}
                    href={att.dataUrl}
                    download={att.name}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <span className="text-sm font-medium text-slate-700 truncate mr-4">{att.name}</span>
                    <Download className="w-4 h-4 text-blue-500 group-hover:text-blue-600 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formSettings?.fields.map((field) => (
                <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {field.label} {field.required && '*'}
                  </label>
                  
                  {field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'tel' || field.type === 'date' ? (
                    <input
                      type={field.type}
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-shadow"
                      placeholder={`Masukkan ${field.label.toLowerCase()}`}
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      rows={4}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                      placeholder={`Masukkan ${field.label.toLowerCase()}`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-shadow"
                    >
                      <option value="">Pilih {field.label}</option>
                      {field.options?.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'radio' ? (
                    <div className="space-y-2">
                      {field.options?.map((opt, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={field.id}
                            value={opt}
                            required={field.required}
                            checked={formData[field.id] === opt}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'checkbox' ? (
                    <div className="space-y-2">
                      {field.options?.map((opt, idx) => (
                        <label key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={opt}
                            checked={(formData[field.id] || []).includes(opt)}
                            onChange={(e) => {
                              const currentValues = formData[field.id] || [];
                              if (e.target.checked) {
                                handleInputChange(field.id, [...currentValues, opt]);
                              } else {
                                handleInputChange(field.id, currentValues.filter((v: string) => v !== opt));
                              }
                            }}
                            className="text-blue-500 focus:ring-blue-500 rounded"
                          />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'file' ? (
                    <input
                      type="file"
                      multiple
                      required={field.required}
                      onChange={(e) => handleFileChange(field.id, e.target.files)}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                Kirim Pendaftaran <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
