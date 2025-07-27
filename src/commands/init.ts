import { Command } from 'commander';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';
import { ConfigManager } from '../utils/config.js';

export function initCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize Freshfield.io CLI with your credentials')
    .action(async () => {
      try {
        logger.info('Initializing Freshfield CLI...');

        const answers = await getCredentials();
        
        // Set configuration
        ConfigManager.set('appId', answers.appId);
        ConfigManager.set('cliToken', answers.cliToken);

        logger.log('\n');
        logger.success('Freshfield CLI initialized successfully!');
        // logger.info('Next steps:');
        // logger.info('  1. Navigate to your git repository');
        // logger.info('  2. Run "freshfield update" to generate new update draft');
        
      } catch (error) {
        logger.error('Failed to initialize Freshfield CLI');
        if (error instanceof Error) {
          logger.debug(error.message);
        }
        process.exit(1);
      }
    });
}

async function getCredentials() {
  const questions = [
    {
      type: 'input',
      name: 'appId',
      message: 'What is your Freshfield App ID?',
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'App ID cannot be empty';
        }
        return true;
      }
    },
    {
      type: 'password',
      name: 'cliToken',
      message: 'What is your Freshfield CLI Token?',
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'CLI Token cannot be empty';
        }
        return true;
      }
    }
  ];

  const answers = await inquirer.prompt(questions);
  
  return {
    appId: answers.appId,
    cliToken: answers.cliToken
  };
} 