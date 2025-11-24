import puppeteer, { Browser, Page, ScreenshotOptions as PuppeteerScreenshotOptions } from 'puppeteer';
import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BrowserConfig, NavigationOptions, ScreenshotOptions } from '../../types/index.js';

export class PuppeteerController {
  private browser?: Browser;
  private page?: Page;
  private useStealth: boolean = false;

  async initialize(config: BrowserConfig): Promise<void> {
    this.useStealth = config.stealth ?? false;

    const launchOptions = {
      headless: config.headless ?? true,
      slowMo: config.slowMo,
      defaultViewport: config.viewport || null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    };

    if (config.userAgent) {
      launchOptions.args.push(`--user-agent=${config.userAgent}`);
    }

    if (this.useStealth) {
      const puppeteerExtra = addExtra(puppeteer as any);
      puppeteerExtra.use(StealthPlugin());
      this.browser = await puppeteerExtra.launch(launchOptions);
    } else {
      this.browser = await puppeteer.launch(launchOptions);
    }

    this.page = await this.browser.newPage();

    if (config.userAgent && this.page) {
      await this.page.setUserAgent(config.userAgent);
    }
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
    await this.page.type(selector, text);
  }

  async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
    if (!this.page) throw new Error('Page not initialized');
    
    const screenshotOptions: PuppeteerScreenshotOptions = {
      path: options?.path,
      fullPage: options?.fullPage,
      clip: options?.clip,
    };

    const screenshot = await this.page.screenshot(screenshotOptions);
    return Buffer.from(screenshot);
  }

  async evaluate<T>(fn: () => T): Promise<T> {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.evaluate(fn);
  }

  async getTitle(): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');
    return await this.page.title();
  }

  async waitForSelector(selector: string, timeout?: number): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.waitForSelector(selector, { timeout });
  }

  async interceptNetwork(enable: boolean = true): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');
    await this.page.setRequestInterception(enable);
  }

  async close(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }
}
