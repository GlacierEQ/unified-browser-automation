import { Builder, WebDriver, By, until, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import { BrowserConfig, ElementLocator } from '../../types/index.js';

export class SeleniumController {
  private driver?: WebDriver;

  async initialize(config: BrowserConfig): Promise<void> {
    const capabilities = new Capabilities();
    
    let builder = new Builder();

    switch (config.browser) {
      case 'chrome':
      case 'chromium':
        const chromeOptions = new chrome.Options();
        if (config.headless) {
          chromeOptions.addArguments('--headless=new');
        }
        if (config.userAgent) {
          chromeOptions.addArguments(`user-agent=${config.userAgent}`);
        }
        builder = builder.forBrowser('chrome').setChromeOptions(chromeOptions);
        break;

      case 'firefox':
        const firefoxOptions = new firefox.Options();
        if (config.headless) {
          firefoxOptions.addArguments('-headless');
        }
        builder = builder.forBrowser('firefox').setFirefoxOptions(firefoxOptions);
        break;

      case 'edge':
        builder = builder.forBrowser('MicrosoftEdge');
        break;

      default:
        throw new Error(`Unsupported browser: ${config.browser}`);
    }

    this.driver = await builder.build();

    if (config.viewport) {
      await this.driver.manage().window().setRect({
        width: config.viewport.width,
        height: config.viewport.height,
        x: 0,
        y: 0,
      });
    }

    if (config.timeout) {
      await this.driver.manage().setTimeouts({ implicit: config.timeout });
    }
  }

  async navigate(url: string): Promise<void> {
    if (!this.driver) throw new Error('Driver not initialized');
    await this.driver.get(url);
  }

  async findElement(locator: ElementLocator): Promise<any> {
    if (!this.driver) throw new Error('Driver not initialized');

    let by: By;
    if (locator.css) {
      by = By.css(locator.css);
    } else if (locator.xpath) {
      by = By.xpath(locator.xpath);
    } else if (locator.id) {
      by = By.id(locator.id);
    } else if (locator.name) {
      by = By.name(locator.name);
    } else {
      throw new Error('No valid locator provided');
    }

    return await this.driver.findElement(by);
  }

  async click(locator: ElementLocator): Promise<void> {
    const element = await this.findElement(locator);
    await element.click();
  }

  async type(locator: ElementLocator, text: string): Promise<void> {
    const element = await this.findElement(locator);
    await element.sendKeys(text);
  }

  async getText(locator: ElementLocator): Promise<string> {
    const element = await this.findElement(locator);
    return await element.getText();
  }

  async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    if (!this.driver) throw new Error('Driver not initialized');
    return await this.driver.executeScript(script, ...args) as T;
  }

  async takeScreenshot(): Promise<string> {
    if (!this.driver) throw new Error('Driver not initialized');
    return await this.driver.takeScreenshot();
  }

  async getTitle(): Promise<string> {
    if (!this.driver) throw new Error('Driver not initialized');
    return await this.driver.getTitle();
  }

  async waitForElement(locator: ElementLocator, timeout: number = 10000): Promise<void> {
    if (!this.driver) throw new Error('Driver not initialized');
    
    let by: By;
    if (locator.css) {
      by = By.css(locator.css);
    } else if (locator.xpath) {
      by = By.xpath(locator.xpath);
    } else {
      throw new Error('No valid locator provided');
    }

    await this.driver.wait(until.elementLocated(by), timeout);
  }

  async close(): Promise<void> {
    if (this.driver) {
      await this.driver.quit();
    }
  }
}
