import { NextRequest, NextResponse } from 'next/server';
import { openrouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check for API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables.',
            code: 'INVALID_API_KEY',
            status: 500,
          },
        },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const personImage = formData.get('personImage') as File;
    const clothingImage = formData.get('clothingImage') as File;
    const bodyDataStr = formData.get('bodyData') as string;

    // Validate images
    if (!personImage || !clothingImage) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Both person image and clothing image are required.',
            code: 'VALIDATION_ERROR',
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    // Check file sizes
    if (personImage.size > MAX_FILE_SIZE || clothingImage.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Image files must be less than 10MB.',
            code: 'FILE_TOO_LARGE',
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    // Convert images to base64
    const personImageBuffer = Buffer.from(await personImage.arrayBuffer());
    const clothingImageBuffer = Buffer.from(await clothingImage.arrayBuffer());
    const personImageBase64 = personImageBuffer.toString('base64');
    const clothingImageBase64 = clothingImageBuffer.toString('base64');

    // Parse body data if provided
    let bodyData = null;
    if (bodyDataStr) {
      try {
        bodyData = JSON.parse(bodyDataStr);
      } catch (e) {
        // Ignore invalid body data
      }
    }

    // Build prompt with body data context
    let prompt = `You are an AI fashion assistant. Given a photo of a person and a photo of a clothing item, generate a realistic image showing what the person would look like wearing that clothing item.

Consider:
- The person's body type, pose, and lighting in the original photo
- The clothing item's style, color, pattern, and fit
- Natural shadows, wrinkles, and fabric behavior
- Realistic proportions and perspective`;

    if (bodyData) {
      prompt += `\n\nPerson's measurements:
- Height: ${bodyData.height || 'Not provided'}
- Weight: ${bodyData.weight || 'Not provided'}
- Body type: ${bodyData.bodyType || 'Not provided'}`;
    }

    prompt += `\n\nPlease generate a photorealistic image of the person wearing the clothing item.`;

    // Call OpenRouter with Gemini 2.5 Flash
    const model = openrouter('google/gemini-2.0-flash-exp:free');

    const result = await generateText({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image',
              image: personImageBase64,
            },
            {
              type: 'image',
              image: clothingImageBase64,
            },
          ],
        },
      ],
    });

    const processingTime = Date.now() - startTime;

    // Note: Gemini 2.5 Flash via OpenRouter returns text descriptions, not images
    // For actual image generation, you would need a different model or approach
    // This is a simplified MVP that returns the AI's description
    return NextResponse.json({
      success: true,
      data: {
        generatedImageUrl: '', // Placeholder - actual image generation would require different model
        generatedImageBase64: '', // Placeholder
        description: result.text,
        processingTime,
      },
      message: 'Outfit visualization generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating outfit:', error);

    // Handle specific OpenRouter errors
    if (error.message?.includes('401')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid OpenRouter API key.',
            code: 'INVALID_API_KEY',
            status: 401,
            details: error.message,
          },
        },
        { status: 401 }
      );
    }

    if (error.message?.includes('429')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
            status: 429,
            details: error.message,
          },
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to generate outfit visualization.',
          code: 'PROCESSING_ERROR',
          status: 500,
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}