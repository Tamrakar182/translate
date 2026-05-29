import {
    LITERT_MODEL_URL,
    LOCAL_MODEL_UNAVAILABLE_MESSAGE,
} from '@/ai/litert/config';
import {
    getLiteRtModelOptions,
    importLiteRtModule,
    isExpoGo,
    type LiteRtModelHandle,
} from '@/ai/litert/native-module';

export async function createLiteRtModel(
  onProgress?: (progress: number) => void
): Promise<LiteRtModelHandle> {
  if (isExpoGo()) {
    throw new Error(LOCAL_MODEL_UNAVAILABLE_MESSAGE);
  }

  const { createLLM } = await importLiteRtModule();
  const llm = createLLM();

  await llm.loadModel(LITERT_MODEL_URL, getLiteRtModelOptions(), onProgress);

  return llm;
}
