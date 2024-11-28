import React, { ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends React.Component<{
  children: ReactNode;
}, {
  hasError: boolean;
}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Protokollieren Sie den Fehler oder führen Sie eine andere Fehlerbehandlung durch
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Ersatzbenutzeroberfläche, wenn ein Fehler auftritt
      return <h1>Etwas ist schiefgelaufen.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;