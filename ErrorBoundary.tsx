import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white text-center">
            <div>
                <h1 className="text-4xl font-bold text-red-400">アプリケーションでエラーが発生しました。</h1>
                <p className="mt-2 text-slate-300 text-xl">ページを再読み込みしてお試しください。</p>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;