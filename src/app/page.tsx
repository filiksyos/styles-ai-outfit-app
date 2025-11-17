'use client';

import { useState, useCallback, useEffect } from 'react';
import { ImageUpload, ResultDisplay, ErrorDisplay, LoadingDisplay, BodyDataForm } from '@/components';
import { 
  UploadedImage, 
  GenerationState, 
  GeneratedResult, 
  ErrorState, 
  DownloadOptions,
  BodyData 
} from '@/types';
import {
  callGenerateOutfitAPI,
  convertApiResponseToResult,
  convertApiErrorToErrorState,
  downloadImage,
  generateFilename,
  loadBodyData,
  saveBodyData
} from '@/lib/utils';

export default function Home() {
  // Upload state
  const [personPhoto, setPersonPhoto] = useState<UploadedImage | null>(null);
  const [clothingItem, setClothingItem] = useState<UploadedImage | null>(null);
  const [bodyData, setBodyData] = useState<BodyData | null>(null);

  // Generation state management
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [loadingStage, setLoadingStage] = useState<'preparing' | 'uploading' | 'processing' | 'generating' | 'finishing'>('preparing');

  // Load saved body data on mount
  useEffect(() => {
    const savedData = loadBodyData();
    if (savedData) {
      setBodyData(savedData);
    }
  }, []);

  // Handle image uploads
  const handlePersonPhotoSelect = useCallback((image: UploadedImage | null) => {
    setPersonPhoto(image);
    if (generationState !== 'idle') {
      setGenerationState('idle');
      setGeneratedResult(null);
      setError(null);
    }
  }, [generationState]);

  const handleClothingItemSelect = useCallback((image: UploadedImage | null) => {
    setClothingItem(image);
    if (generationState !== 'idle') {
      setGenerationState('idle');
      setGeneratedResult(null);
      setError(null);
    }
  }, [generationState]);

  // Handle body data updates
  const handleBodyDataChange = useCallback((data: BodyData | null) => {
    setBodyData(data);
    if (data) {
      saveBodyData(data);
    }
  }, []);

  // Validation
  const canGenerate = personPhoto && clothingItem && generationState !== 'loading';

  // Handle AI outfit generation
  const handleGenerateOutfit = useCallback(async () => {
    if (!personPhoto || !clothingItem) {
      setError({
        message: 'Please upload both a person photo and a clothing item before generating.',
        code: 'VALIDATION_ERROR',
        status: 400,
        isRetryable: false,
        timestamp: new Date()
      });
      return;
    }

    try {
      setError(null);
      setGeneratedResult(null);
      setGenerationState('loading');
      setLoadingStage('preparing');

      setTimeout(() => setLoadingStage('uploading'), 1000);
      setTimeout(() => setLoadingStage('processing'), 2000);
      setTimeout(() => setLoadingStage('generating'), 8000);
      setTimeout(() => setLoadingStage('finishing'), 15000);

      const response = await callGenerateOutfitAPI(personPhoto, clothingItem, bodyData);

      if (response.success) {
        const result = convertApiResponseToResult(response, {
          personImage: personPhoto,
          clothingImage: clothingItem
        });
        setGeneratedResult(result);
        setGenerationState('success');
      } else {
        const errorState = convertApiErrorToErrorState(response);
        setError(errorState);
        setGenerationState('error');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError({
        message: 'An unexpected error occurred while generating your outfit. Please try again.',
        code: 'UNEXPECTED_ERROR',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error',
        isRetryable: true,
        timestamp: new Date()
      });
      setGenerationState('error');
    }
  }, [personPhoto, clothingItem, bodyData]);

  const handleDownload = useCallback(async (options: DownloadOptions) => {
    if (!generatedResult) return;

    try {
      const imageUrl = generatedResult.imageUrl || 
        `data:image/png;base64,${generatedResult.imageBase64}`;
      
      const downloadOptions: DownloadOptions = {
        ...options,
        filename: options.filename || generateFilename('styles-outfit', options.format)
      };

      await downloadImage(imageUrl, downloadOptions);
    } catch (error) {
      console.error('Download error:', error);
      setError({
        message: 'Failed to download the image. Please try again.',
        code: 'DOWNLOAD_ERROR',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown download error',
        isRetryable: true,
        timestamp: new Date()
      });
    }
  }, [generatedResult]);

  const handleRetry = useCallback(() => {
    setError(null);
    setGenerationState('idle');
    handleGenerateOutfit();
  }, [handleGenerateOutfit]);

  const handleGenerateAnother = useCallback(() => {
    setGenerationState('idle');
    setGeneratedResult(null);
    setError(null);
  }, []);

  const handleErrorDismiss = useCallback(() => {
    setError(null);
    setGenerationState('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (personPhoto?.previewUrl) {
        URL.revokeObjectURL(personPhoto.previewUrl);
      }
      if (clothingItem?.previewUrl) {
        URL.revokeObjectURL(clothingItem.previewUrl);
      }
    };
  }, [personPhoto?.previewUrl, clothingItem?.previewUrl]);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Styles - AI Outfit Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Upload your photo and body data to see what you'd look like in different clothes.
              Our AI uses Gemini 2.5 Flash to create realistic outfit visualizations.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              {/* Body Data Form */}
              <div className="mb-8">
                <BodyDataForm 
                  initialData={bodyData}
                  onChange={handleBodyDataChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <ImageUpload
                  label="Person Photo"
                  onImageSelect={handlePersonPhotoSelect}
                  className="space-y-4"
                />

                <ImageUpload
                  label="Clothing Item"
                  onImageSelect={handleClothingItemSelect}
                  className="space-y-4"
                />
              </div>

              {generationState === 'idle' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleGenerateOutfit}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-12 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!canGenerate}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate AI Outfit
                    </span>
                  </button>
                  
                  {!canGenerate && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      Please upload both images to start generating your AI outfit
                    </p>
                  )}
                </div>
              )}
            </div>

            {generationState === 'loading' && (
              <LoadingDisplay
                stage={loadingStage}
                estimatedTime={45}
                onCancel={() => {
                  setGenerationState('idle');
                  setError(null);
                }}
                showCancel={true}
                className="max-w-2xl mx-auto"
              />
            )}

            {generationState === 'error' && error && (
              <ErrorDisplay
                error={error}
                onRetry={error.isRetryable ? handleRetry : undefined}
                onDismiss={handleErrorDismiss}
                dismissible={true}
                showDetails={true}
                className="max-w-2xl mx-auto"
              />
            )}

            {generationState === 'success' && generatedResult && (
              <ResultDisplay
                result={generatedResult}
                onDownload={handleDownload}
                onGenerateAnother={handleGenerateAnother}
                className="max-w-4xl mx-auto"
              />
            )}
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">1. Add Your Data</h3>
                  <p>Enter your body measurements and upload your photo for better AI accuracy.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">2. AI Processing</h3>
                  <p>Gemini 2.5 Flash analyzes your body data and creates realistic visualizations.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">3. Download Result</h3>
                  <p>View, share, or download your personalized outfit image.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}