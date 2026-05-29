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
  await waitForModelReady(llm);

  return llm;
}

async function waitForModelReady(model: LiteRtModelHandle): Promise<void> {
  if (typeof model.isReady !== 'function') return;

  const timeoutMs = 3000;
  const startedAt = Date.now();

  while (!model.isReady()) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(
        'Local model downloaded, but the native runtime did not report it loaded. Restart the development build and try again.'
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
