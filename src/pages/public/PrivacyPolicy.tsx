import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useData } from '../../store/DataContext';

export default function PrivacyPolicy() {
  const { data } = useData();
  const content = data.settings.privacyPolicy;

  return (
    <div className="bg-liquid min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-ios rounded-[3rem] p-12 md:p-16 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40"
        >
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="w-16 h-16 bg-himars-peach/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-himars-peach" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-himars-dark uppercase tracking-tight">Kebijakan Privasi</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Terakhir Diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-himars-dark prose-headings:uppercase prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed">
            {content.split('\n').map((paragraph, index) => {
              if (!paragraph.trim()) return null;
              
              // Check if it's a heading (starts with number.)
              if (/^\d+\./.test(paragraph)) {
                return (
                  <h3 key={index} className="mt-12 mb-6">
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

              return <p key={index}>{paragraph}</p>;
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
