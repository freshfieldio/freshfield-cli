#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';
import { getPackageJson } from './utils/package.js';
import { initCommand } from './commands/init.js';
import { updateCommand } from './commands/update.js';

// Get package info
const pkg = getPackageJson();

// Check for updates
const notifier = updateNotifier({ pkg: { name: pkg.name, version: pkg.version } });
notifier.notify();

const program = new Command();

program
  .name('freshfield')
  .description('CLI tool for Freshfield.io platform | share and manage changelogs & release notes generated from git commits')
  .version(pkg.version, '-v, --version')
  .option('-d, --debug', 'Enable debug mode');

// Add commands
initCommand(program);
updateCommand(program);

// Global error handler
program.exitOverride();

try {
  await program.parseAsync();
} catch (error) {
  console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
} 