import React, { useState } from 'react';
import { Download, Upload, Database, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { storage } from '../../utils/storage';

export default function BackupRestore() {
  const { data, addActivityLog } = useData();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const currentUser = storage.get('currentUser', { nama: 'Unknown', id: 'unknown', username: 'unknown' });

  const handleExport = () => {
    setIsExporting(true);
    try {
      // Get all data from storage
      const allData = {
        himars_data: storage.get('himars_data', {}),
        himars_users: storage.get('himars_users', []),
        himars_activity_logs: storage.get('himars_activity_logs', []),
        himars_bug_reports: storage.get('himars_bug_reports', [])
      };

      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `himars_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addActivityLog({
        userId: currentUser.id,
        username: currentUser.username,
        nama: currentUser.nama,
        action: 'Export Data',
        details: 'Melakukan backup data sistem'
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Gagal mengekspor data.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('idle');
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = JSON.parse(content);

        // Basic validation
        if (!parsedData.himars_data || !parsedData.himars_users) {
          throw new Error('Format file backup tidak valid.');
        }

        // Restore data
        if (parsedData.himars_data) storage.set('himars_data', parsedData.himars_data);
        if (parsedData.himars_users) storage.set('himars_users', parsedData.himars_users);
        if (parsedData.himars_activity_logs) storage.set('himars_activity_logs', parsedData.himars_activity_logs);
        if (parsedData.himars_bug_reports) storage.set('himars_bug_reports', parsedData.himars_bug_reports);

        addActivityLog({
          userId: currentUser.id,
          username: currentUser.username,
          nama: currentUser.nama,
          action: 'Import Data',
          details: 'Melakukan restore data sistem dari file backup'
        });

        setImportStatus('success');
        
        // Reload page after short delay to apply changes
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Gagal membaca file backup.');
      } finally {
        setIsImporting(false);
        // Reset file input
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full mx-auto space-y-8">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Backup & Restore</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Manajemen Data Sistem HIMARS
          </p>
        </div>
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
          <Database className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
            <Download className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Export Data</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
            Unduh seluruh data sistem (Anggota, Proker, Keuangan, dll) ke dalam format JSON. Simpan file ini di tempat yang aman sebagai cadangan.
          </p>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? 'Mengekspor...' : 'Export ke JSON'}
          </button>
        </div>

        {/* Import Section */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-6">
            <Upload className="w-6 h-6 text-rose-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Restore Data</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
            Pulihkan data sistem dari file backup JSON. <strong className="text-rose-500">Peringatan:</strong> Tindakan ini akan menimpa seluruh data yang ada saat ini.
          </p>
          
          {importStatus === 'success' && (
            <div className="mb-4 p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-3 text-sm font-bold">
              <CheckCircle className="w-5 h-5 shrink-0" />
              Data berhasil dipulihkan! Memuat ulang sistem...
            </div>
          )}

          {importStatus === 'error' && (
            <div className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 text-sm font-bold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting || importStatus === 'success'}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              disabled={isImporting || importStatus === 'success'}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              {isImporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isImporting ? 'Memulihkan...' : 'Pilih File Backup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
