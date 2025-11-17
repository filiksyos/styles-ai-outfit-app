'use client';

import { useState } from 'react';
import { ErrorState } from '@/types';

interface ErrorDisplayProps {
  error: ErrorState;
  onRetry?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  showDetails?: boolean;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  dismissible = true,
  showDetails = false,
  className = ''
}: ErrorDisplayProps) {
  const [showExpandedDetails, setShowExpandedDetails] = useState(false);

  const getErrorCategory = (code: string) => {
    switch (code) {
      case 'INVALID_API_KEY':
      case 'INSUFFICIENT_CREDITS':
        return 'Configuration Error';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Rate Limit Error';
      case 'MODEL_UNAVAILABLE':
        return 'Service Error';
      case 'VALIDATION_ERROR':
        return 'Validation Error';
      default:
        return 'Processing Error';
    }
  };

  const getSuggestedActions = (code: string) => {
    switch (code) {
      case 'INVALID_API_KEY':
        return 'Please check your OpenRouter API key in the .env file.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Please wait a few minutes before trying again.';
      case 'MODEL_UNAVAILABLE':
        return 'The AI service is temporarily unavailable. Please try again later.';
      default:
        return 'Please try again. If the problem persists, check your setup.';
    }
  };

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                {getErrorCategory(error.code)}
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error.message}
              </p>
            </div>
            
            {dismissible && onDismiss && (
              <button onClick={onDismiss} className="ml-4 text-red-400 hover:text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-3">
            <p className="text-sm text-red-600 dark:text-red-400">
              <span className="font-medium">Suggestion:</span> {getSuggestedActions(error.code)}
            </p>
          </div>

          {showDetails && (
            <div className="mt-4">
              <button
                onClick={() => setShowExpandedDetails(!showExpandedDetails)}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800"
              >
                {showExpandedDetails ? 'Hide' : 'Show'} technical details
              </button>
              
              {showExpandedDetails && error.details && (
                <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/40 rounded-lg">
                  <p className="text-xs text-red-700 dark:text-red-300 font-mono">{error.details}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            {error.isRetryable && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}