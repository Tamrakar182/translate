import { useEffect, useRef, useState } from 'react';

import { LOCAL_MODEL_UNAVAILABLE_MESSAGE } from '@/ai/litert/config';
import { createLiteRtModel } from '@/ai/litert/model-loader';
import {
    getLiteRtErrorMessage,
    isExpoGo,
    type LiteRtModelHandle,
} from '@/ai/litert/native-module';

export type LiteRtModelState = {
  localModel: unknown;
  isReady: boolean;
  isLoading: boolean;
  downloadProgress: number;
  error: string | null;
};

const initialModelState: LiteRtModelState = {
  localModel: null,
  isReady: false,
  isLoading: false,
  downloadProgress: 0,
  error: null,
};

export function useLiteRtModel(isEnabled: boolean): LiteRtModelState {
  const [state, setState] = useState<LiteRtModelState>(initialModelState);
  const modelRef = useRef<LiteRtModelHandle | null>(null);
  const activeRequestId = useRef(0);

  useEffect(() => {
    activeRequestId.current += 1;
    const requestId = activeRequestId.current;
    let cancelled = false;

    const closeModel = (): void => {
      modelRef.current?.close?.();
      modelRef.current = null;
    };

    const resetModel = (): void => {
      closeModel();
      setState(initialModelState);
    };

    if (!isEnabled) {
      resetModel();
      return closeModel;
    }

    if (isExpoGo()) {
      closeModel();
      setState({
        ...initialModelState,
        error: LOCAL_MODEL_UNAVAILABLE_MESSAGE,
      });
      return closeModel;
    }

    const loadModel = async (): Promise<void> => {
      try {
        setState({
          ...initialModelState,
          isLoading: true,
        });

        const model = await createLiteRtModel((progress) => {
          if (!cancelled && requestId === activeRequestId.current) {
            setState((current) => ({
              ...current,
              downloadProgress: progress,
            }));
          }
        });

        if (cancelled || requestId !== activeRequestId.current) {
          model.close?.();
          return;
        }

        modelRef.current = model;
        setState({
          localModel: model,
          isReady: true,
          isLoading: false,
          downloadProgress: 1,
          error: null,
        });
      } catch (error) {
        if (cancelled || requestId !== activeRequestId.current) return;

        setState({
          ...initialModelState,
          error: getLiteRtErrorMessage(error),
        });
      }
    };

    loadModel();

    return () => {
      cancelled = true;
      closeModel();
    };
  }, [isEnabled]);

  return state;
}
