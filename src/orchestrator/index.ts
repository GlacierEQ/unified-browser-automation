import { BrowserConfig, AutomationResult, MCPRequest } from '../types/index.js';
import { PlaywrightController } from '../controllers/playwright/index.js';
import { SeleniumController } from '../controllers/selenium/index.js';
import { PuppeteerController } from '../controllers/puppeteer/index.js';
import { ForensicLogger } from '../forensic/logger.js';
import { MemorySync } from '../memory/sync.js';

export class UnifiedOrchestrator {
  private playwright?: PlaywrightController;
  private selenium?: SeleniumController;
  private puppeteer?: PuppeteerController;
  private logger: ForensicLogger;
  private memory: MemorySync;
  private activeFramework?: 'playwright' | 'selenium' | 'puppeteer';

  constructor() {
    this.logger = new ForensicLogger();
    this.memory = new MemorySync();
  }

  async initialize(framework: 'playwright' | 'selenium' | 'puppeteer', config: BrowserConfig): Promise<void> {
    const startTime = Date.now();
    this.activeFramework = framework;

    try {
      switch (framework) {
        case 'playwright':
          this.playwright = new PlaywrightController();
          await this.playwright.initialize(config);
          break;
        case 'selenium':
          this.selenium = new SeleniumController();
          await this.selenium.initialize(config);
          break;
        case 'puppeteer':
          this.puppeteer = new PuppeteerController();
          await this.puppeteer.initialize(config);
          break;
      }

      await this.logger.log({
        action: 'initialize',
        framework,
        success: true,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      await this.logger.log({
        action: 'initialize',
        framework,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
      });
      throw error;
    }
  }

  async executeMCPRequest(request: MCPRequest): Promise<AutomationResult> {
    const framework = request.framework || this.activeFramework || 'playwright';
    const startTime = Date.now();

    try {
      let result: any;

      switch (framework) {
        case 'playwright':
          result = await this.executePlaywrightMethod(request.method, request.params);
          break;
        case 'selenium':
          result = await this.executeSeleniumMethod(request.method, request.params);
          break;
        case 'puppeteer':
          result = await this.executePuppeteerMethod(request.method, request.params);
          break;
      }

      const response: AutomationResult = {
        success: true,
        data: result,
        duration: Date.now() - startTime,
        framework,
      };

      await this.logger.log({
        action: request.method,
        framework,
        success: true,
        duration: response.duration,
        metadata: request.params,
      });

      return response;
    } catch (error) {
      const response: AutomationResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
        framework,
      };

      await this.logger.log({
        action: request.method,
        framework,
        success: false,
        error: response.error,
        duration: response.duration,
      });

      return response;
    }
  }

  private async executePlaywrightMethod(method: string, params: any): Promise<any> {
    if (!this.playwright) throw new Error('Playwright not initialized');

    switch (method) {
      case 'navigate':
        return await this.playwright.navigate(params.url, params.options);
      case 'click':
        return await this.playwright.click(params.selector);
      case 'type':
        return await this.playwright.type(params.selector, params.text);
      case 'screenshot':
        return await this.playwright.screenshot(params.options);
      default:
        throw new Error(`Unknown Playwright method: ${method}`);
    }
  }

  private async executeSeleniumMethod(method: string, params: any): Promise<any> {
    if (!this.selenium) throw new Error('Selenium not initialized');

    switch (method) {
      case 'navigate':
        return await this.selenium.navigate(params.url);
      case 'findElement':
        return await this.selenium.findElement(params.locator);
      case 'click':
        return await this.selenium.click(params.locator);
      default:
        throw new Error(`Unknown Selenium method: ${method}`);
    }
  }

  private async executePuppeteerMethod(method: string, params: any): Promise<any> {
    if (!this.puppeteer) throw new Error('Puppeteer not initialized');

    switch (method) {
      case 'navigate':
        return await this.puppeteer.navigate(params.url, params.options);
      case 'click':
        return await this.puppeteer.click(params.selector);
      case 'screenshot':
        return await this.puppeteer.screenshot(params.options);
      default:
        throw new Error(`Unknown Puppeteer method: ${method}`);
    }
  }

  async close(): Promise<void> {
    if (this.playwright) await this.playwright.close();
    if (this.selenium) await this.selenium.close();
    if (this.puppeteer) await this.puppeteer.close();
  }
}
