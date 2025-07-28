import { Command } from 'commander';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';
import { ConfigManager, FRESHFIELD_API_URL } from '../utils/config.js';
import { GitManager } from '../utils/git.js';
import { ApiManager } from '../utils/api.js';
import { createSpinner } from '../utils/spinner.js';
import { DisplayManager } from '../utils/display.js';
import { UpdateOptions } from '../types/index.js';

export function updateCommand(program: Command): void {
  program
    .command('update')
    .description('Generate new update draft from git commits')
    .action(async () => {
      try {
        if (!GitManager.isGitRepository()) {
          logger.error('Not in a git repository. Please run this command from a git repository.');
          process.exit(1);
        }

        const config = ConfigManager.get();
        if (!config.appId || !config.cliToken) {
          logger.error('FreshField credentials not configured. Please run "freshfield init" first.');
          process.exit(1);
        }

        logger.log('\n');
        logger.log('🥕 Freshfield.io');
        logger.info('Let\'s create new update draft from your git commits!');

        const updateMethod = await getUpdateMethod();
        
        const commits = await getCommits(updateMethod);
        
        if (commits.length === 0) {
          logger.warning('No commits found for the specified criteria.');
          return;
        }

        logger.log('\n');
        logger.success(`Found ${commits.length} commits to process`);

        const spinner = createSpinner('Generating update texts...');
        spinner.start();

        try {
          const response = await ApiManager.sendCommits(
            config.appId,
            config.cliToken,
            FRESHFIELD_API_URL,
            commits
          );

          spinner.succeed('Update texts generated successfully!');

          await DisplayManager.animateText(' Processing your new update...', 1500);
          
          DisplayManager.showSuccessBox(response);
          logger.log('\n');
          logger.warning('This is only a PRIVATE DRAFT. You can edit and publish it in your dashboard.');
          if (response.data?.id) {
            logger.warning(FRESHFIELD_API_URL + '/app/' + config.appId + '/#' + response.data.id);
          }
          
          
        } catch (error) {
          spinner.fail('Failed to generate update texts');
          if (error instanceof Error) {
            logger.error(error.message);
          }
          process.exit(1);
        }

      } catch (error) {
        logger.error('Update failed');
        if (error instanceof Error) {
          logger.debug(error.message);
        }
        process.exit(1);
      }
    });
}

async function getUpdateMethod(): Promise<UpdateOptions['method']> {
  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'How would you like to select commits?',
      choices: [
        { name: 'Date Range - Select commits between specific dates', value: 'date-range' },
        { name: 'Commit Count - Select last N commits', value: 'commit-count' },
        // { name: '⏳ Coming soon...', value: 'coming-soon', disabled: true }
      ]
    }
  ]);

  return method;
}

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

async function getCommits(method: UpdateOptions['method']): Promise<any[]> {
  if (method === 'date-range') {
    const { startDate, endDate } = await inquirer.prompt([
      {
        type: 'input',
        name: 'startDate',
        message: 'Start date (YYYY-MM-DD):',
        validate: (input: string) => {
          if (!dateRegex.test(input)) {
            return 'Please enter a valid date in YYYY-MM-DD format';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'endDate',
        message: 'End date (YYYY-MM-DD):',
        default: new Date().toISOString().split('T')[0],
        validate: (input: string) => {
          if (!dateRegex.test(input)) {
            return 'Please enter a valid date in YYYY-MM-DD format';
          }
          return true;
        }
      }
    ]);

    return GitManager.getCommitsByDateRange(startDate, endDate);
  } else if (method === 'commit-count') {
    const { commitCount } = await inquirer.prompt([
      {
        type: 'number',
        name: 'commitCount',
        message: 'How many recent commits to include?',
        default: 10,
        validate: (input: number) => {
          if (input < 1 || input > 100) {
            return 'Please enter a number between 1 and 100';
          }
          return true;
        }
      }
    ]);

    return GitManager.getCommitsByCount(commitCount);
  }

  throw new Error('Invalid method selected');
}

 