import { CameraCapturedPicture } from 'expo-camera';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
export const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export type GeminiModel = {
  name: string;
  displayName?: string;
  version?: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedGenerationMethods?: string[];
};

const getModelId = (modelName: string): string => {
  return modelName.replace(/^models\//, '');
};

const getGenerateContentEndpoint = (modelName: string): string => {
  const modelId = getModelId(modelName);
  return `${GEMINI_BASE_URL}/models/${modelId}:generateContent`;
};

const assertGeminiApiKey = (): string => {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_GEMINI_KEY in your environment.');
  }

  return GEMINI_API_KEY;
};

const isSupportedForImageTranslation = (model: GeminiModel): boolean => {
  const modelId = getModelId(model.name).toLowerCase();
  const displayName = model.displayName?.toLowerCase() ?? '';
  const description = model.description?.toLowerCase() ?? '';
  const searchableText = `${modelId} ${displayName} ${description}`;

  const supportsGenerateContent =
    model.supportedGenerationMethods?.includes('generateContent') ?? false;

  if (!supportsGenerateContent) return false;

  if (!modelId.startsWith('gemini-')) return false;

  const blockedTerms = [
    'embedding',
    'embed',
    'aqa',
    'imagen',
    'veo',
    'image-generation',
    'image generation',
    'image-preview',
    'image preview',
    'tts',
    'text-to-speech',
    'speech',
    'audio',
    'native-audio',
    'live',
    'bidi',
  ];

  const isBlocked = blockedTerms.some((term) => searchableText.includes(term));

  if (isBlocked) return false;

  const likelyVisionTextModelTerms = [
    'flash',
    'flash-lite',
    'pro',
  ];

  return likelyVisionTextModelTerms.some((term) => modelId.includes(term));
};

export const listAvailableGeminiModels = async (): Promise<GeminiModel[]> => {
  const apiKey = assertGeminiApiKey();

  const response = await fetch(`${GEMINI_BASE_URL}/models`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    },
  });

  const parsedData = await response.json();

  if (!response.ok) {
    throw new Error(
      parsedData?.error?.message || 'Failed to list Gemini models.'
    );
  }

  const models: GeminiModel[] = parsedData?.models ?? [];

  return models
    .filter(isSupportedForImageTranslation)
    .sort((a, b) => {
      const aId = getModelId(a.name);
      const bId = getModelId(b.name);

      const scoreModel = (modelId: string): number => {
        if (modelId.includes('flash-lite')) return 0;
        if (modelId.includes('flash')) return 1;
        if (modelId.includes('pro')) return 2;
        return 3;
      };

      const scoreDiff = scoreModel(aId) - scoreModel(bId);

      if (scoreDiff !== 0) return scoreDiff;

      return aId.localeCompare(bId);
    });
};

export const sendRequestToGemini = async (
  photo: CameraCapturedPicture,
  modelName: string = DEFAULT_GEMINI_MODEL
) => {
  const apiKey = assertGeminiApiKey();

  if (!photo.base64) {
    throw new Error('Captured photo does not contain base64 image data.');
  }

  const payload = {
    contents: [
      {
        parts: [
          {
            text:
              'Extract any visible text from this image. Translate that text clearly into English. Return ONLY the final translated text. If there is no readable text, say: No readable text found.',
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: photo.base64,
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(getGenerateContentEndpoint(modelName), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const parsedData = await response.json();

  if (!response.ok) {
    throw new Error(parsedData?.error?.message || 'Gemini request failed.');
  }

  return parsedData;
};