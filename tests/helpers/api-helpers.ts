import { Page, APIRequestContext } from '@playwright/test';

export class APIHelpers {
  constructor(private page: Page, private request: APIRequestContext) {}

  async waitForAPIResponse(endpoint: string, timeout: number = 10000): Promise<any> {
    return await this.page.waitForResponse(
      (response) => response.url().includes(endpoint) && response.status() === 200,
      { timeout }
    );
  }

  async mockAPIResponse(endpoint: string, response: any): Promise<void> {
    await this.page.route(endpoint, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    });
  }

  async verifyAPICall(endpoint: string, expectedParams?: Record<string, any>): Promise<boolean> {
    const responses = await this.page.waitForResponse(
      (response) => response.url().includes(endpoint),
      { timeout: 5000 }
    ).catch(() => null);

    if (!responses) return false;

    if (expectedParams) {
      const url = new URL(responses.url());
      for (const [key, value] of Object.entries(expectedParams)) {
        if (url.searchParams.get(key) !== String(value)) {
          return false;
        }
      }
    }

    return true;
  }

  async getAPIResponse(endpoint: string): Promise<any> {
    const response = await this.request.get(endpoint);
    return await response.json();
  }

  async postAPIRequest(endpoint: string, data: any): Promise<any> {
    const response = await this.request.post(endpoint, {
      data: data,
    });
    return await response.json();
  }
}

