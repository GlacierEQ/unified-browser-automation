# 🌐 Unified Browser Automation System

**Apex-tier browser automation framework** merging Selenium 4.34, Playwright 1.56, and Puppeteer with MCP protocol integration, MemoryPlugin orchestration, and AI-powered workflow control.

## 🚀 Features

### Multi-Framework Support
- **Playwright 1.56** - Latest Microsoft framework with Test Agents, `titlePath` traceability, auto-visibility assertions
- **Selenium 4.34** - W3C WebDriver BiDi, Chrome DevTools Protocol, enhanced Grid 4 with Docker/Kubernetes
- **Puppeteer 23.11** - Chrome DevTools Protocol mastery with stealth plugins

### Advanced Capabilities
- **MCP Integration** - Model Context Protocol server for AI agent orchestration
- **MemoryPlugin Sync** - Context-aware automation with persistent memory
- **Forensic Logging** - Complete audit trails with Winston + Pino
- **Cross-Browser** - Chromium, Firefox, WebKit unified API
- **Parallel Execution** - Bull queue management with Redis
- **Health Monitoring** - Real-time metrics and performance tracking

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/GlacierEQ/unified-browser-automation.git
cd unified-browser-automation

# Install dependencies
npm install

# Install browser binaries
npm run playwright:install

# Build TypeScript
npm run build
```

## 🎯 Quick Start

### Playwright Example
```typescript
import { PlaywrightController } from './src/controllers/playwright';

const controller = new PlaywrightController();
await controller.initialize({ browser: 'chromium', headless: false });
await controller.navigate('https://example.com');
const title = await controller.getTitle();
await controller.close();
```

### Selenium Example
```typescript
import { SeleniumController } from './src/controllers/selenium';

const controller = new SeleniumController();
await controller.initialize({ browser: 'chrome' });
await controller.navigate('https://example.com');
const element = await controller.findElement({ css: 'h1' });
await controller.close();
```

### Puppeteer Example
```typescript
import { PuppeteerController } from './src/controllers/puppeteer';

const controller = new PuppeteerController();
await controller.initialize({ headless: true, stealth: true });
await controller.navigate('https://example.com');
const screenshot = await controller.screenshot();
await controller.close();
```

## 🏗️ Architecture

```
unified-browser-automation/
├── src/
│   ├── controllers/          # Framework-specific controllers
│   │   ├── playwright/       # Playwright 1.56 implementation
│   │   ├── selenium/         # Selenium 4.34 implementation
│   │   └── puppeteer/        # Puppeteer implementation
│   ├── mcp/                  # Model Context Protocol server
│   ├── memory/               # MemoryPlugin integration
│   ├── forensic/             # Logging and audit systems
│   ├── orchestrator/         # Unified automation orchestrator
│   ├── queue/                # Bull queue management
│   └── utils/                # Shared utilities
├── tests/                    # Test suites
├── config/                   # Configuration files
└── docs/                     # Documentation
```

## 🔧 Configuration

Create `.env` file:

```env
# Server
PORT=8787
NODE_ENV=production

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# MCP
MCP_SERVER_PORT=3000

# MemoryPlugin
MEMORY_PLUGIN_API_KEY=your_key
MEMORY_PLUGIN_CONTEXT=your_context

# Browser Settings
HEADLESS=true
SLOW_MO=0
TIMEOUT=30000
```

## 📊 Framework Comparison

| Feature | Playwright 1.56 | Selenium 4.34 | Puppeteer 23.11 |
|---------|----------------|---------------|------------------|
| Browser Support | Chromium, Firefox, WebKit | All major browsers | Chromium, Firefox |
| Language Support | JS, TS, Python, Java, .NET | Java, Python, C#, Ruby, JS | JS, TS |
| Auto-waiting | ✅ Native | ⚠️ Explicit | ⚠️ Manual |
| Network Intercept | ✅ Advanced | ✅ CDP | ✅ CDP |
| Mobile Emulation | ✅ Built-in | ⚠️ Limited | ✅ Built-in |
| Parallel Testing | ✅ Native | ✅ Grid 4 | ⚠️ Manual |
| W3C BiDi | ✅ Full | ✅ Full | ⚠️ Partial |

## 🧪 Testing

```bash
# Run all tests
npm test

# Playwright tests
npm run test:playwright

# Selenium tests
npm run test:selenium

# Integration tests
npm run test:integration
```

## 🐳 Docker Support

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

## 📖 Documentation

- [Playwright Guide](./docs/playwright-guide.md)
- [Selenium Guide](./docs/selenium-guide.md)
- [Puppeteer Guide](./docs/puppeteer-guide.md)
- [MCP Integration](./docs/mcp-integration.md)
- [API Reference](./docs/api-reference.md)

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file.

## 🔗 Related Projects

- [comet-agent](https://github.com/GlacierEQ/comet-agent) - Original Comet browser automation
- [google-drive-mcp](https://github.com/GlacierEQ/google-drive-mcp) - MCP Google Drive connector

## 📞 Support

For issues and questions, please open a GitHub issue or contact GLACIER.EQUILIBRIUM@GMAIL.COM
