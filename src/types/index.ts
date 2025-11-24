export interface BrowserConfig {
  browser: 'chromium' | 'firefox' | 'webkit' | 'chrome' | 'edge' | 'safari';
  headless?: boolean;
  slowMo?: number;
  timeout?: number;
  viewport?: { width: number; height: number };
  userAgent?: string;
  stealth?: boolean;
}

export interface NavigationOptions {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  timeout?: number;
}

export interface ElementLocator {
  css?: string;
  xpath?: string;
  text?: string;
  id?: string;
  name?: string;
  testId?: string;
}

export interface ScreenshotOptions {
  path?: string;
  fullPage?: boolean;
  clip?: { x: number; y: number; width: number; height: number };
  quality?: number;
}

export interface AutomationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  duration: number;
  framework: 'playwright' | 'selenium' | 'puppeteer';
}

export interface ForensicLog {
  id: string;
  timestamp: Date;
  action: string;
  framework: string;
  url?: string;
  duration?: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface MCPRequest {
  id: string;
  method: string;
  params: Record<string, any>;
  framework?: 'playwright' | 'selenium' | 'puppeteer';
}

export interface MCPResponse {
  id: string;
  result?: any;
  error?: string;
}
