import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 pt-16 pb-20 text-center text-white w-full min-h-[calc(100vh)]">
          <h1 className="text-3xl sm:text-4xl font-bold">Ocorreu um Erro</h1>
          <p className="text-gray-200 mt-4 text-sm sm:text-base">Desculpe, algo deu errado. Tente recarregar a página.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-teal-500 text-white rounded px-4 py-2 hover:bg-teal-600"
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;