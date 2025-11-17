// TypeScript type definitions

export interface UploadedImage {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

export interface ImageUploadProps {
  label: string;
  onImageSelect: (image: UploadedImage | null) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export type FileValidationError = 
  | 'invalid-file-type'
  | 'file-too-large'
  | 'upload-failed'
  | 'no-file-selected';

export type SupportedImageTypes = 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/webp';

export interface BodyData {
  height?: string;
  weight?: string;
  bodyType?: 'slim' | 'average' | 'athletic' | 'plus-size';
  gender?: 'male' | 'female' | 'other';
  age?: string;
}

export interface GenerateOutfitRequest {
  personImage: File;
  clothingImage: File;
  bodyData?: BodyData;
}

export interface GenerateOutfitResponse {
  success: true;
  data: {
    generatedImageUrl: string;
    generatedImageBase64?: string;
    description?: string;
    processingTime: number;
  };
  message: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
    details?: string;
  };
}

export type ApiResponse = GenerateOutfitResponse | ApiError;

export type GenerationState = 'idle' | 'loading' | 'success' | 'error';

export interface GeneratedResult {
  imageUrl: string;
  imageBase64?: string;
  description?: string;
  processingTime: number;
  generatedAt: Date;
  metadata?: {
    modelUsed: string;
    promptVersion: string;
    originalImages: {
      personImageName: string;
      clothingImageName: string;
    };
  };
}

export interface ErrorState {
  message: string;
  code: string;
  status: number;
  details?: string;
  isRetryable: boolean;
  timestamp: Date;
}

export interface DownloadOptions {
  format: 'png' | 'jpeg';
  quality?: number;
  filename?: string;
}