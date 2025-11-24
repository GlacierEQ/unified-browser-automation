import { chromium, firefox, webkit, Browser, Page, BrowserContext } from 'playwright';
import { BrowserConfig, NavigationOptions, ScreenshotOptions } from '../../types/index.js';

export class PlaywrightController {
  private browser?: Browser;
  private context?: BrowserContext;
  private page?: Page;

  async initialize(config: BrowserConfig): Promise<void> {
    const browserType = config.browser === 'chrome' ? 'chromium' : config.browser;
    
    const launchOptions = {
      headless: config.headless ?? true,
      slowMo: config.slowMo ?? 0,
    };

    switch (browserType) {
      case 'chromium':
        this.browser = await chromium.launch(launchOptions);
        break;
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        throw new Error(`Unsupported browser: ${config.browser}`);
    }

    this.context = await this.browser.newContext({
      viewport: config.viewport,
      userAgent: config.userAgent,
    });

    this.page = await this.context.newPage();
  }

  async navigate(url: string, options?: NavigationOptions): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.goto(url, {
      waitUntil: options?.waitUntil as any,
      timeout: options?.timeout,
    });
  }

  async click(selector: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.fill(selector, text);
  }

  async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.screenshot({
      path: options?.path,
      fullPage: options?.fullPage,
      clip: options?.clip,
    });
  }

  async getTitle(): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.title();
  }

  async evaluate<T>(fn: () => T): Promise<T> {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.evaluate(fn);
  }

  async close(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}
