export type AiMode = 'gemini' | 'litert';

export type TranslateImageInput = {
  uri: string;
  base64?: string;
};

export type TranslateImageResult = {
  text: string;
  engine: AiMode;
  warning?: string;
};

export type ImageTranslator = (
  input: TranslateImageInput
) => Promise<TranslateImageResult>;
