'use client';

import { useEffect, useState } from 'react';

interface LoadingDisplayProps {
  stage?: 'preparing' | 'uploading' | 'processing' | 'generating' | 'finishing';
  estimatedTime?: number;
  onCancel?: () => void;
  showCancel?: boolean;
  className?: string;
}

const STAGE_MESSAGES = {
  preparing: 'Preparing images for AI processing...',
  uploading: 'Uploading images to the AI service...',
  processing: 'AI is analyzing your images...',
  generating: 'Creating your personalized outfit...',
  finishing: 'Finalizing your generated image...'
};

export function LoadingDisplay({
  stage = 'processing',
  estimatedTime,
  onCancel,
  showCancel = true,
  className = ''
}: LoadingDisplayProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(dotsTimer);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getProgressPercentage = () => {
    switch (stage) {
      case 'preparing': return 10;
      case 'uploading': return 25;
      case 'processing': return 50;
      case 'generating': return 80;
      case 'finishing': return 95;
      default: return 0;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
          <div className="absolute inset-2 bg-blue-100 dark:bg-blue-900 rounded-full animate-pulse flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Generating Your AI Outfit
        </h2>
        
        <div className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
          {STAGE_MESSAGES[stage]}{dots}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="capitalize font-medium">{stage} Stage</span>
          <span>{getProgressPercentage()}%</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
        Elapsed: {formatTime(elapsedTime)}
      </div>

      {showCancel && onCancel && (
        <div className="text-center">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}