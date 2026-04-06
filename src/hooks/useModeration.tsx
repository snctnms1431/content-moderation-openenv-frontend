// src/services/moderationService.tsx

// Use ONLY the Hugging Face URL - no fallback to localhost
const API_BASE_URL = 'https://Ajinkyakakade02-content-moderation-openenv.hf.space';

export interface ModerationContent {
  type: 'text' | 'image' | 'video';
  data: string;
  filename?: string;
  size?: number;
}

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

export interface HealthStatus {
  status: string;
  ai_available: boolean;
  capabilities: {
    text: boolean;
    image: boolean;
    video: boolean;
  };
}

class ModerationService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`📡 API Request: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async checkHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  async moderateText(text: string): Promise<ModerationResult> {
    return this.request<ModerationResult>('/moderate', {
      method: 'POST',
      body: JSON.stringify({
        content: {
          type: 'text',
          data: text,
        },
      }),
    });
  }

  async moderateImage(imageBase64: string): Promise<ModerationResult> {
    return this.request<ModerationResult>('/moderate', {
      method: 'POST',
      body: JSON.stringify({
        content: {
          type: 'image',
          data: imageBase64,
        },
      }),
    });
  }

  async moderateVideo(videoBase64: string, filename: string, size: number): Promise<ModerationResult> {
    return this.request<ModerationResult>('/moderate', {
      method: 'POST',
      body: JSON.stringify({
        content: {
          type: 'video',
          data: videoBase64,
          filename,
          size,
        },
      }),
    });
  }

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}

export const moderationService = new ModerationService();