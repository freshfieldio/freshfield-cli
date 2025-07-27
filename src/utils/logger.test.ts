import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger } from './logger.js';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: any;

  beforeEach(() => {
    logger = Logger.getInstance();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should be a singleton', () => {
    const instance1 = Logger.getInstance();
    const instance2 = Logger.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should log info messages', () => {
    logger.info('Test info message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ℹ'), 'Test info message');
  });

  it('should log success messages', () => {
    logger.success('Test success message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✓'), 'Test success message');
  });

  it('should log warning messages', () => {
    logger.warning('Test warning message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('⚠'), 'Test warning message');
  });

  it('should not log debug messages when debug mode is disabled', () => {
    logger.setDebugMode(false);
    logger.debug('Test debug message');
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('🔍'), 'Test debug message');
  });

  it('should log debug messages when debug mode is enabled', () => {
    logger.setDebugMode(true);
    logger.debug('Test debug message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🔍'), 'Test debug message');
  });
}); 