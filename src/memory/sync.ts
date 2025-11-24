import axios from 'axios';

export interface MemoryContext {
  contextId: string;
  apiKey: string;
  baseUrl: string;
}

export class MemorySync {
  private context?: MemoryContext;

  configure(context: MemoryContext): void {
    this.context = context;
  }

  async store(key: string, value: any, metadata?: Record<string, any>): Promise<void> {
    if (!this.context) {
      console.warn('MemorySync not configured, skipping store');
      return;
    }

    try {
      await axios.post(
        `${this.context.baseUrl}/api/memory`,
        {
          contextId: this.context.contextId,
          key,
          value,
          metadata,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Authorization': `Bearer ${this.context.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Failed to store memory:', error);
    }
  }

  async retrieve(key: string): Promise<any> {
    if (!this.context) {
      console.warn('MemorySync not configured, skipping retrieve');
      return null;
    }

    try {
      const response = await axios.get(
        `${this.context.baseUrl}/api/memory/${this.context.contextId}/${key}`,
        {
          headers: {
            'Authorization': `Bearer ${this.context.apiKey}`,
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error('Failed to retrieve memory:', error);
      return null;
    }
  }

  async search(query: string): Promise<any[]> {
    if (!this.context) {
      console.warn('MemorySync not configured, skipping search');
      return [];
    }

    try {
      const response = await axios.post(
        `${this.context.baseUrl}/api/memory/search`,
        {
          contextId: this.context.contextId,
          query,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.context.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.results || [];
    } catch (error) {
      console.error('Failed to search memory:', error);
      return [];
    }
  }
}
