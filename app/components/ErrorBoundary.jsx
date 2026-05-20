"use client";
import { Component } from "react";
import { Button } from "./ui/button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full">
            <div className="bg-card rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
              <p className="text-muted-foreground mb-4">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === "development" && (
                <details className="mb-6 cursor-pointer">
                  <summary className="text-sm text-gray-500 font-mono hover:text-gray-700">
                    Error details
                  </summary>
                  <pre className="mt-3 p-3 bg-background border rounded text-xs overflow-auto max-h-48">
                    {this.state.error?.toString()}
                    {"\n\n"}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <div className="space-y-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Try again
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-gray-700 hover:bg-gray-800"
                >
                  Go home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
