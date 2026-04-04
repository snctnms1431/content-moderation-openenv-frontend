// src/hooks/useModeration.ts

import { useState, useCallback } from 'react';
import { moderationService, ModerationResult, ModerationContent } from '@/services/moderationService';

interface UseModerationReturn {
  moderate: (content: ModerationContent) => Promise<ModerationResult | null>;
  isLoading: boolean;
  error: string | null;
  lastResult: ModerationResult | null;
  reset: () => void;
  isBackendAvailable: boolean;
  checkBackend: () => Promise<boolean>;
}

export function useModeration(): UseModerationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ModerationResult | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  const checkBackend = useCallback(async (): Promise<boolean> => {
    try {
      const health = await moderationService.checkHealth();
      const available = health.status === 'ok';
      setIsBackendAvailable(available);
      return available;
    } catch (err) {
      setIsBackendAvailable(false);
      return false;
    }
  }, []);

  const moderate = useCallback(async (content: ModerationContent): Promise<ModerationResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result: ModerationResult;
      
      switch (content.type) {
        case 'text':
          result = await moderationService.moderateText(content.data);
          break;
        case 'image':
          result = await moderationService.moderateImage(content.data);
          break;
        case 'video':
          result = await moderationService.moderateVideo(
            content.data,
            content.filename || 'video',
            content.size || 0
          );
          break;
        default:
          throw new Error('Unsupported content type');
      }
      
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Moderation failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLastResult(null);
  }, []);

  return {
    moderate,
    isLoading,
    error,
    lastResult,
    reset,
    isBackendAvailable,
    checkBackend,
  };
}