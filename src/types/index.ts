export interface Config {
  appId?: string;
  cliToken?: string;
  debug?: boolean;
}

export interface GitCommit {
  message: string;
  date: string;
  files: string[];
  stats: {
    additions: number;
    deletions: number;
  };
}

export interface FreshFieldRequest {
  commits: GitCommit[];
}

export interface FreshFieldResponse {
  type: 'success' | 'error';
  text: string;
  data?: {
    id: string;
    appId: string;
    description: string;
    email?: {
      body: string;
      sentStatus: string;
      subject: string;
    } | null;
    features: Array<{
      description: string;
      icon: string;
      id: string;
      name: string;
      type: string;
    }>;
    status: string;
    title: string;
    appName: string;
  };
}

export interface UpdateOptions {
  method: 'date-range' | 'commit-count';
  startDate?: string;
  endDate?: string;
  commitCount?: number;
}

export interface InitOptions {
  appId: string;
  cliToken: string;
  yes?: boolean;
}

export interface CommandContext {
  debug: boolean;
  config: Config;
} 