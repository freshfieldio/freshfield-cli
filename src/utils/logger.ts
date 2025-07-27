import chalk from 'chalk';

export class Logger {
  private static instance: Logger;
  private debugMode = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  error(message: string): void {
    console.error(chalk.red('✗'), message);
  }

  debug(message: string): void {
    if (this.debugMode) {
      console.log(chalk.gray('🔍'), message);
    }
  }

  log(message: string): void {
    console.log(message);
  }
}

export const logger = Logger.getInstance(); 