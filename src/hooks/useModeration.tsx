import { useState, useCallback, useEffect } from 'react';

export interface ModerationResult {
  action: 'ALLOW' | 'FLAG' | 'REMOVE';
  harmful_score: number;
  confidence: number;
  violations: string[];
  reason: string;
  content_type: string;
  detection_method: string;
  ai_available: boolean;
}

export function useModeration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ModerationResult | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  const API_URL = 'https://Ajinkyakakade02-content-moderation-openenv.hf.space';

  const checkBackend = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      const available = data.status === 'active' || data.status === 'ok';
      setIsBackendAvailable(available);
      return available;
    } catch (err) {
      setIsBackendAvailable(false);
      return false;
    }
  }, []);

  const moderate = useCallback(async (content: { 
    type: 'text' | 'image' | 'video'; 
    data: string; 
    filename?: string; 
    size?: number 
  }): Promise<ModerationResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      const result: ModerationResult = await response.json();
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

  useEffect(() => {
    checkBackend();
  }, []);

  return {
    moderate,
    isLoading,
    error,
    lastResult,
    isBackendAvailable,
    checkBackend,
  };
}