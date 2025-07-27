import chalk from 'chalk';
import { logger } from './logger.js';
import { FRESHFIELD_API_URL } from './config.js';

export class DisplayManager {
  private static frames = [
    '🥕',
    '🖌️',
    '🆕',
    '🪴',
    '🎨',
    '⚙️',
    '✏️',
  ];

  private static currentFrame = 0;

  static createBox(title: string, content: string, width: number = 80): string {
    const topBorder = '╭' + '─'.repeat(width - 2) + '╮';
    const bottomBorder = '╰' + '─'.repeat(width - 2) + '╯';
    const titleLine = '│ ' + chalk.bold.cyan(title.padEnd(width - 4)) + ' │';
    const separator = '├' + '─'.repeat(width - 2) + '┤';
    
    const wrappedContent = this.wrapText(content, width - 4);
    const contentLines = wrappedContent.map(line => {
      const visibleLength = this.stripAnsiCodes(line).length;
      const padding = width - 4 - visibleLength;
      return '│ ' + line + ' '.repeat(Math.max(0, padding)) + ' │';
    });
    
    return [
      topBorder,
      titleLine,
      separator,
      ...contentLines,
      bottomBorder
    ].join('\n');
  }

  private static stripAnsiCodes(text: string): string {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  }

  private static wrapText(text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const textLines = text.split('\n');
    
    for (const line of textLines) {
      if (line.trim() === '') {
        lines.push('');
        continue;
      }
      
      const words = line.split(' ');
      let currentLine = '';

      for (const word of words) {
        const currentLineVisibleLength = this.stripAnsiCodes(currentLine).length;
        const wordVisibleLength = this.stripAnsiCodes(word).length;
        
        if (currentLineVisibleLength + wordVisibleLength + (currentLine ? 1 : 0) <= maxWidth) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          currentLine = word;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  }

  static getNextFrame(): string {
    const frame = this.frames[this.currentFrame] || '🎉';
    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    return frame;
  }

  static async animateText(text: string, duration: number = 2000): Promise<void> {
    const startTime = Date.now();
    const interval = 150;
    
    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const columns = Math.max(process.stdout.columns || 0, 80);
        process.stdout.write(`\r${' '.repeat(columns)}`);
        process.stdout.write(`\r${this.getNextFrame()} ${text}`);
        
        if (progress < 1) {
          setTimeout(animate, interval);
        } else {
          process.stdout.write('\n\n');
          resolve();
        }
      };
      
      animate();
    });
  }

  static showSuccessBox(response: any): void {
    if (!response.data) {
      logger.error('No data received from Freshfield');
      return;
    }

    const { data } = response;
    
    let content = '';
    content += `${chalk.gray('Title:')} ${data.title}\n`;
    content += `\n`;
    content += `${chalk.gray('Description:')} ${data.description}\n`;

    if (data.features && data.features.length > 0) {
      content += `\n${chalk.gray('Features:')}`;
      content += '\n';
      data.features.forEach((feature: any) => {
        content += `  • ${feature.name}: ${feature.description}\n`;
      });
    }

    if (data.email) {
      content += `\n${chalk.gray('Email:')}`;
      content += '\n';
      content += `  ${chalk.gray('Subject:')} ${data.email.subject}\n`;
      content += `  ${chalk.gray('Body:')} ${chalk.dim('available only on the dashboard')} \n`;
    }

    console.log('\n' + this.createBox('🎉 New update draft for ' + data.appName + '!', content) + '\n');
  }
} 