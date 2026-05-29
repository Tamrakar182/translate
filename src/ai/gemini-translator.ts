import type { TranslateImageInput, TranslateImageResult } from './types';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_PROMPT =
  'Extract any visible text from this image. Translate the extracted text clearly into English. Return ONLY the final English translated text. If there is no readable text, return: No readable text found.';

const assertGeminiApiKey = (): string => {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_GEMINI_KEY in your environment.');
  }

  return GEMINI_API_KEY;
};

const parseTranslatedText = (parsedData: unknown): string => {
  const text =
    (parsedData as {
      candidates?: {
        content?: {
          parts?: { text?: string }[];
        };
      }[];
    })?.candidates?.[0]?.content?.parts?.[0]?.text;

  return text?.trim() || 'No readable text found.';
};

export async function translateWithGemini(
  input: TranslateImageInput
): Promise<TranslateImageResult> {
  const apiKey = assertGeminiApiKey();

  if (!input.base64) {
    throw new Error('Captured photo does not contain base64 image data.');
  }

  const response = await fetch(
    `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: GEMINI_PROMPT,
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: input.base64,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const parsedData = await response.json();

  if (!response.ok) {
    throw new Error(parsedData?.error?.message || 'Gemini request failed.');
  }

  return {
    text: parseTranslatedText(parsedData),
    engine: 'gemini',
  };
}
