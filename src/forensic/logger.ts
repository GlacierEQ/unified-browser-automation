import winston from 'winston';
import { ForensicLog } from '../types/index.js';
import { nanoid } from 'nanoid';

export class ForensicLogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }

  async log(data: Omit<ForensicLog, 'id' | 'timestamp'>): Promise<void> {
    const log: ForensicLog = {
      id: nanoid(),
      timestamp: new Date(),
      ...data,
    };

    this.logger.info('Automation action', log);
  }

  async error(action: string, error: Error | string, metadata?: Record<string, any>): Promise<void> {
    this.logger.error('Automation error', {
      id: nanoid(),
      timestamp: new Date(),
      action,
      success: false,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      metadata,
    });
  }
}
