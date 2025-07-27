import { FreshFieldRequest, FreshFieldResponse } from '../types/index.js';
import { logger } from './logger.js';

export class ApiManager {
  static async sendCommits(
    appId: string,
    cliToken: string,
    apiUrl: string,
    commits: FreshFieldRequest['commits']
  ): Promise<FreshFieldResponse> {
    const url = `${apiUrl}/api/${appId}/cli`;
    
    try {
      logger.debug(`Sending request to: ${url}`);
      logger.debug(`Commits count: ${commits.length}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cliToken}`
        },
        body: JSON.stringify({ commits })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: FreshFieldResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('API request failed: Unknown error');
    }
  }

  static validateResponse(response: FreshFieldResponse): boolean {
    return response.type === 'success' && response.data !== undefined;
  }
} 