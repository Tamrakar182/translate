import { IMAGE_TRANSLATION_PROMPT } from '@/ai/prompts';

export function createGeminiImageTranslationPayload(base64Image: string) {
  return {
    contents: [
      {
        parts: [
          {
            text: IMAGE_TRANSLATION_PROMPT,
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
    ],
  };
}
