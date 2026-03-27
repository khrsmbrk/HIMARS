import React, { useState } from 'react';
import { X, Sparkles, Loader2, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { useData } from '../store/DataContext';

interface GenerateSuratModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateSuratModal({ isOpen, onClose }: GenerateSuratModalProps) {
  const { data } = useData();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedHtml('');

    try {
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `Anda adalah asisten pembuat surat resmi organisasi mahasiswa. 
Buatlah isi surat resmi dalam format HTML (hanya tag HTML untuk isi surat, tanpa tag <html>, <head>, atau <body>).
Gunakan tag seperti <div>, <p>, <table>, <strong>, dll dengan styling inline CSS yang rapi jika diperlukan.
Jangan sertakan kop surat, tanda tangan, atau stempel, karena itu akan ditambahkan secara otomatis oleh sistem.
Fokus pada isi surat (Nomor, Lampiran, Perihal, Tujuan, Isi, Penutup).
Gunakan bahasa Indonesia yang baku dan resmi.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      let html = response.text || '';
      // Remove markdown code blocks if any
      html = html.replace(/```html/g, '').replace(/```/g, '').trim();
      setGeneratedHtml(html);
    } catch (error) {
      console.error('Error generating letter:', error);
      alert('Gagal menghasilkan surat. Pastikan API key sudah dikonfigurasi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Surat</title>
        <style>
          body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 2cm;
            color: black;
            font-size: 12pt;
            line-height: 1.5;
          }
          .kop-surat {
            width: 100%;
            border-bottom: 3px solid black;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .kop-surat img {
            width: 100%;
            height: auto;
            max-height: 150px;
            object-fit: contain;
          }
          .signature-section {
            margin-top: 50px;
            width: 100%;
            display: flex;
            justify-content: flex-end;
          }
          .signature-box {
            width: 300px;
            text-align: center;
            position: relative;
          }
          .signature-image {
            width: 150px;
            height: auto;
            margin: 10px auto;
            position: relative;
            z-index: 2;
          }
          .stamp-image {
            position: absolute;
            width: 120px;
            height: auto;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            opacity: 0.8;
          }
          @media print {
            body { padding: 0; }
            @page { margin: 2cm; }
          }
        </style>
      </head>
      <body>
        ${data.settings.kopSuratUrl ? `
          <div class="kop-surat">
            <img src="${data.settings.kopSuratUrl}" alt="Kop Surat" />
          </div>
        ` : '<div style="text-align: center; font-weight: bold; font-size: 16pt; border-bottom: 3px solid black; margin-bottom: 20px; padding-bottom: 10px;">KOP SURAT BELUM DIATUR</div>'}
        
        <div class="content">
          ${generatedHtml}
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <p>Lamongan, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p>Ketua Umum,</p>
            
            <div style="position: relative; height: 100px; display: flex; align-items: center; justify-content: center;">
              ${data.settings.stempelUrl ? `<img src="${data.settings.stempelUrl}" class="stamp-image" alt="Stempel" />` : ''}
              ${data.settings.tandaTanganUrl ? `<img src="${data.settings.tandaTanganUrl}" class="signature-image" alt="Tanda Tangan" />` : '<div style="height: 80px;"></div>'}
            </div>
            
            <p style="font-weight: bold; text-decoration: underline; margin-bottom: 0;">Nama Ketua Umum</p>
            <p style="margin-top: 0;">NIM. 123456789</p>
          </div>
        </div>
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-tight">AI Surat Generator</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buat surat otomatis dengan AI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-6">
              {!generatedHtml ? (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">
                    Deskripsikan surat yang ingin dibuat:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Contoh: Buatkan surat keterangan aktif organisasi untuk mahasiswa bernama Budi Santoso, NIM 12345, prodi S1 ARS, keperluan untuk beasiswa."
                    className="w-full h-40 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-0 resize-none font-medium"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt || isGenerating}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sedang Membuat...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Generate Surat
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700">Preview Surat</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setGeneratedHtml('')}
                        className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        Buat Ulang
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                      >
                        <Printer className="w-4 h-4" /> Cetak / PDF
                      </button>
                    </div>
                  </div>
                  
                  {/* Preview Container */}
                  <div className="flex-1 bg-slate-100 rounded-2xl p-8 overflow-y-auto border border-slate-200">
                    <div className="bg-white max-w-[21cm] min-h-[29.7cm] mx-auto p-[2cm] shadow-md font-serif text-[12pt] leading-relaxed text-black">
                      {/* Kop Surat Preview */}
                      {data.settings.kopSuratUrl ? (
                        <div className="w-full border-b-[3px] border-black pb-2 mb-5">
                          <img src={data.settings.kopSuratUrl} alt="Kop Surat" className="w-full max-h-[150px] object-contain" />
                        </div>
                      ) : (
                        <div className="text-center font-bold text-xl border-b-[3px] border-black pb-2 mb-5">
                          KOP SURAT BELUM DIATUR
                        </div>
                      )}

                      {/* Content Preview */}
                      <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />

                      {/* Signature Preview */}
                      <div className="mt-12 flex justify-end">
                        <div className="w-[300px] text-center relative">
                          <p>Lamongan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          <p>Ketua Umum,</p>
                          
                          <div className="relative h-[100px] flex items-center justify-center my-2">
                            {data.settings.stempelUrl && (
                              <img src={data.settings.stempelUrl} alt="Stempel" className="absolute left-5 top-1/2 -translate-y-1/2 w-[120px] opacity-80 z-0" />
                            )}
                            {data.settings.tandaTanganUrl && (
                              <img src={data.settings.tandaTanganUrl} alt="Tanda Tangan" className="w-[150px] relative z-10" />
                            )}
                          </div>
                          
                          <p className="font-bold underline mb-0">Nama Ketua Umum</p>
                          <p className="mt-0">NIM. 123456789</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
