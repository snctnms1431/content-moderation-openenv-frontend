// src/services/moderationService.ts

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

const API_BASE_URL = 'http://localhost:5000';

class ModerationService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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