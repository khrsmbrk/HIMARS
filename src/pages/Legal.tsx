import React from 'react';
import { Shield, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { useData } from '../store/DataContext';

export default function LegalPage() {
  const { data } = useData();
  const content = data.settings.termsConditions || '';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Syarat dan Ketentuan</h1>
              <p className="text-slate-500 mt-1">HIMARS Workspace</p>
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
        </div>
        <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
