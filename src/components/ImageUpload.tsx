'use client';

import React, { useState, useCallback, useRef } from 'react';
import { ImageUploadProps, UploadedImage, FileValidationError, SupportedImageTypes } from '@/types';

const SUPPORTED_FILE_TYPES: SupportedImageTypes[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function ImageUpload({
  label,
  onImageSelect,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  maxSize = DEFAULT_MAX_SIZE,
  className = ''
}: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): FileValidationError | null => {
    if (!SUPPORTED_FILE_TYPES.includes(file.type as SupportedImageTypes)) {
      return 'invalid-file-type';
    }
    if (file.size > maxSize) {
      return 'file-too-large';
    }
    return null;
  }, [maxSize]);

  const getErrorMessage = (error: FileValidationError): string => {
    switch (error) {
      case 'invalid-file-type':
        return 'Please select a valid image file (JPG, PNG, or WebP)';
      case 'file-too-large':
        return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
      case 'upload-failed':
        return 'Failed to upload image. Please try again.';
      case 'no-file-selected':
        return 'No file selected';
      default:
        return 'An error occurred during upload';
    }
  };

  const processFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError('');

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setError(getErrorMessage(validationError));
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      const newImage: UploadedImage = {
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };

      setUploadedImage(newImage);
      onImageSelect(newImage);
    } catch (err) {
      setError(getErrorMessage('upload-failed'));
      console.error('Error processing file:', err);
    } finally {
      setIsLoading(false);
    }
  }, [validateFile, onImageSelect, maxSize]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveImage = useCallback(() => {
    if (uploadedImage?.previewUrl) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }
    setUploadedImage(null);
    setError('');
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadedImage, onImageSelect]);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      
      <div className="relative">
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${
              isDragActive 
                ? 'border-purple-400 bg-purple-500/10' 
                : uploadedImage 
                  ? 'border-green-400 bg-green-500/10' 
                  : 'border-gray-600 bg-gray-800/50 hover:border-purple-400 hover:bg-purple-500/5'
            }
            ${error ? 'border-red-400 bg-red-500/10' : ''}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="sr-only"
          />

          {isLoading ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <p className="text-sm text-gray-400">Processing image...</p>
            </div>
          ) : uploadedImage ? (
            <div className="space-y-4">
              <div className="relative max-w-xs mx-auto">
                <img
                  src={uploadedImage.previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <p className="font-medium text-green-400">{uploadedImage.name}</p>
                <p>{(uploadedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <p className="text-xs text-gray-500">Click to replace image</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <p className="font-medium">
                  {isDragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs">
                  JPG, PNG, WebP up to {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-400 flex items-center space-x-1">
            <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}