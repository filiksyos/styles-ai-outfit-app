import { 
  SupportedImageTypes, 
  FileValidationError, 
  UploadedImage, 
  ApiResponse, 
  GenerateOutfitResponse, 
  GeneratedResult,
  DownloadOptions,
  ErrorState,
  BodyData
} from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES: SupportedImageTypes[] = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

export const validateImageFile = (file: File | null): {
  isValid: boolean;
  error?: FileValidationError;
} => {
  if (!file) {
    return { isValid: false, error: 'no-file-selected' };
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as SupportedImageTypes)) {
    return { isValid: false, error: 'invalid-file-type' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'file-too-large' };
  }

  return { isValid: true };
};

export const createFormDataFromImages = (
  personImage: UploadedImage,
  clothingImage: UploadedImage,
  bodyData?: BodyData | null
): FormData => {
  const formData = new FormData();
  formData.append('personImage', personImage.file);
  formData.append('clothingImage', clothingImage.file);
  if (bodyData) {
    formData.append('bodyData', JSON.stringify(bodyData));
  }
  return formData;
};

export const callGenerateOutfitAPI = async (
  personImage: UploadedImage,
  clothingImage: UploadedImage,
  bodyData?: BodyData | null
): Promise<ApiResponse> => {
  try {
    const formData = createFormDataFromImages(personImage, clothingImage, bodyData);
    
    const response = await fetch('/api/generate-outfit', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'PROCESSING_ERROR',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};

export const formatProcessingTime = (milliseconds: number): string => {
  if (milliseconds < 1000) return `${milliseconds}ms`;
  const seconds = Math.round(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const generateFilename = (
  prefix: string = 'ai-outfit',
  format: 'png' | 'jpeg' = 'png'
): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const timeString = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${prefix}-${timestamp}-${timeString}.${format}`;
};

export const downloadImage = async (
  imageUrl: string,
  options: DownloadOptions
): Promise<void> => {
  try {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = options.filename || generateFilename('ai-outfit', options.format);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const convertApiResponseToResult = (
  response: GenerateOutfitResponse,
  originalImages: {
    personImage: UploadedImage;
    clothingImage: UploadedImage;
  }
): GeneratedResult => {
  return {
    imageUrl: response.data.generatedImageUrl,
    imageBase64: response.data.generatedImageBase64,
    description: response.data.description,
    processingTime: response.data.processingTime,
    generatedAt: new Date(),
    metadata: {
      modelUsed: 'Gemini 2.5 Flash (via OpenRouter)',
      promptVersion: '1.0',
      originalImages: {
        personImageName: originalImages.personImage.name,
        clothingImageName: originalImages.clothingImage.name
      }
    }
  };
};

export const convertApiErrorToErrorState = (response: any): ErrorState => {
  const isRetryable = !['INVALID_API_KEY', 'INSUFFICIENT_CREDITS'].includes(
    response.error?.code || ''
  );

  return {
    message: response.error?.message || 'An unknown error occurred',
    code: response.error?.code || 'UNKNOWN_ERROR',
    status: response.error?.status || 500,
    details: response.error?.details,
    isRetryable,
    timestamp: new Date()
  };
};

// Body data localStorage helpers
export const saveBodyData = (data: BodyData): void => {
  try {
    localStorage.setItem('styles-body-data', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save body data:', error);
  }
};

export const loadBodyData = (): BodyData | null => {
  try {
    const saved = localStorage.getItem('styles-body-data');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load body data:', error);
    return null;
  }
};