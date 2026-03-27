import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-xl text-center border border-slate-100">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Oops! Terjadi Kesalahan</h1>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Maaf, aplikasi mengalami gangguan teknis. Silakan muat ulang halaman atau hubungi administrator jika masalah berlanjut.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left overflow-auto max-h-32">
              <p className="text-xs font-mono text-slate-600 whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            <button 
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
