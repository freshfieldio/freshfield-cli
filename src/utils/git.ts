import { execSync } from 'child_process';
import { GitCommit } from '../types/index.js';

export class GitManager {
  static getCommitsByDateRange(startDate: string, endDate: string): GitCommit[] {
    try {
      const command = `git log --since="${startDate}" --until="${endDate}" --pretty=format:"%H|%s|%aI" --numstat`;
      const output = execSync(command, { encoding: 'utf-8' });
      return this.parseGitLog(output);
    } catch (error) {
      throw new Error(`Failed to get commits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static getCommitsByCount(count: number): GitCommit[] {
    try {
      const command = `git log -n ${count} --pretty=format:"%H|%s|%aI" --numstat`;
      const output = execSync(command, { encoding: 'utf-8' });
      return this.parseGitLog(output);
    } catch (error) {
      throw new Error(`Failed to get commits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static getCommitFiles(commitHash: string): string[] {
    try {
      const command = `git show --name-only --pretty=format: ${commitHash}`;
      const output = execSync(command, { encoding: 'utf-8' });
      return output.trim().split('\n').filter(file => file.length > 0);
    } catch (error) {
      return [];
    }
  }

  static getCommitStats(commitHash: string): { additions: number; deletions: number } {
    try {
      const command = `git show --stat --format= ${commitHash}`;
      const output = execSync(command, { encoding: 'utf-8' });
      
      const statMatch = output.match(/(\d+) insertions?\(\+\), (\d+) deletions?\(-\)/);
      
      if (statMatch && statMatch[1] && statMatch[2]) {
        return {
          additions: parseInt(statMatch[1], 10),
          deletions: parseInt(statMatch[2], 10)
        };
      }
      
      return { additions: 0, deletions: 0 };
    } catch (error) {
      return { additions: 0, deletions: 0 };
    }
  }

  private static parseGitLog(output: string): GitCommit[] {
    const commits: GitCommit[] = [];
    const lines = output.trim().split('\n');
    
    let currentCommit: Partial<GitCommit> | null = null;
    
    for (const line of lines) {
      if (line.includes('|')) {
        const [hash, message, date] = line.split('|');
        
        if (currentCommit && currentCommit.message) {
          commits.push(currentCommit as GitCommit);
        }
        
        const commitHash = hash || '';
        currentCommit = {
          message: message || '',
          date: date || new Date().toISOString(),
          files: this.getCommitFiles(commitHash),
          stats: this.getCommitStats(commitHash)
        };
      }
    }
    
    if (currentCommit && currentCommit.message) {
      commits.push(currentCommit as GitCommit);
    }
    
    return commits;
  }

  static isGitRepository(): boolean {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
} 