'use client';

import { useState } from 'react';
import { GeneratedResult, DownloadOptions } from '@/types';
import { formatProcessingTime } from '@/lib/utils';

interface ResultDisplayProps {
  result: GeneratedResult;
  onDownload: (options: DownloadOptions) => void;
  onGenerateAnother: () => void;
  className?: string;
}

export function ResultDisplay({
  result,
  onDownload,
  onGenerateAnother,
  className = ''
}: ResultDisplayProps) {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const handleDownload = (format: 'png' | 'jpeg') => {
    const options: DownloadOptions = {
      format,
      filename: `styles-outfit-${Date.now()}`,
      quality: format === 'jpeg' ? 0.9 : undefined,
    };
    onDownload(options);
    setShowDownloadOptions(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Generated Outfit
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Generated on {result.generatedAt.toLocaleDateString()} at {result.generatedAt.toLocaleTimeString()}
        </p>
      </div>

      <div className="p-6">
        {result.description && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              AI Description
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {result.description}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Processing Time:
            </span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {formatProcessingTime(result.processingTime)}
            </span>
          </div>
          
          {result.metadata && (
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Model:
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {result.metadata.modelUsed}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onGenerateAnother}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generate Another
          </button>
        </div>
      </div>
    </div>
  );
}