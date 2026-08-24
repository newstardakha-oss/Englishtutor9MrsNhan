import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  declare readonly props: Props;
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-8 max-w-md text-center shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-black text-white mb-2">Đã xảy ra lỗi</h2>
            <p className="text-sm text-slate-400 mb-4">
              Ứng dụng gặp sự cố. Vui lòng tải lại trang để tiếp tục.
            </p>
            <p className="text-xs text-red-400/70 bg-red-500/5 border border-red-500/20 rounded-xl p-3 mb-5 font-mono break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-indigo-500/20 transition-all border border-indigo-400/30 active:scale-[0.98]"
            >
              🔄 Tải Lại Trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
