import { Component } from 'react';
import ServerError from '../../pages/errors/ServerError';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real deployment this is where you'd forward to an error-tracking
    // service (Sentry, etc). Logging to console keeps this dependency-free.
    console.error('[ErrorBoundary] Caught a render error:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ServerError onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
