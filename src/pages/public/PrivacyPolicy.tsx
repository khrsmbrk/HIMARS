import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useData } from '../../store/DataContext';

export default function PrivacyPolicy() {
  const { data } = useData();
  const content = data.settings.privacyPolicy || '';

  return (
    <div className="bg-slate-50 min-h-screen py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 blur-[120px] rounded-full mix-blend-multiply"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-12 md:p-16 shadow-xl border border-slate-200 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/10">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Kebijakan Privasi</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Terakhir Diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:uppercase prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
            {content.split('\n').map((paragraph, index) => {
              if (!paragraph.trim()) return null;
              
              // Check if it's a heading (starts with number.)
              if (/^\d+\./.test(paragraph)) {
                return (
                  <h3 key={index} className="mt-12 mb-6 text-slate-900">
                    {paragraph}
                  </h3>
                );
              }
              
              // Check if it's a list item (starts with -)
              if (paragraph.trim().startsWith('-')) {
                return (
                  <ul key={index} className="list-disc pl-6 space-y-2 text-slate-600 mb-2">
                    <li>{paragraph.replace(/^- /, '')}</li>
                  </ul>
                );
              }

              return <p key={index} className="text-slate-600">{paragraph}</p>;
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
