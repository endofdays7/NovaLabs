"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-red-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-red-200 dark:bg-red-900 rounded-full blur-3xl opacity-30 animate-pulse" />
          <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 sm:p-6 md:p-8 shadow-xl ring-1 ring-gray-100 dark:ring-gray-700">
            <AlertTriangle
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-red-600 dark:text-red-400 mx-auto"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* 500 Text */}
        <div className="space-y-2">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            500
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-orange-600 mx-auto rounded-full" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Something Went Wrong
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            An unexpected error occurred. Our team has been notified, but
            you can try again or head back home.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            onClick={reset}
            className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleReload}
            className="shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Page
          </Button>

          <Link href="/">
            <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Error Details Section */}
        <div className="max-w-lg mx-auto w-full pt-4">
          {/* Development Error Details */}
          {process.env.NODE_ENV === "development" && (
            <details className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 group">
              <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Error Details
              </summary>
              <div className="mt-3 space-y-2 text-left">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Message:</strong>{" "}
                  <span className="break-all">
                    {error.message || "Unknown error"}
                  </span>
                </div>
                {error.digest && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Digest:</strong>{" "}
                    <code className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">
                      {error.digest}
                    </code>
                  </div>
                )}
                {error.stack && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Stack:</strong>
                    <pre className="mt-1 text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-x-auto max-h-40">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Footer Info */}
        <div className="pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Error Code:{" "}
            <span className="font-mono font-semibold text-red-600 dark:text-red-400">
              500
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
