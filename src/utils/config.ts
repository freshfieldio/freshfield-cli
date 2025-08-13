import Conf from 'conf';
import { Config } from '../types/index.js';

// Constants
export const FRESHFIELD_API_URL = 'https://app.freshfield.io';

const config = new Conf<Config>({
  projectName: 'freshfield-cli',
  schema: {
    appId: {
      type: 'string',
      default: undefined
    },
    cliToken: {
      type: 'string',
      default: undefined
    },
    debug: {
      type: 'boolean',
      default: false
    }
  }
});

export class ConfigManager {
  static get(): Config {
    return config.store;
  }

  static set(key: keyof Config, value: Config[keyof Config]): void {
    config.set(key, value);
  }

  static getValue<K extends keyof Config>(key: K): Config[K] {
    return config.get(key);
  }

  static has(key: keyof Config): boolean {
    return config.has(key);
  }

  static delete(key: keyof Config): void {
    config.delete(key);
  }

  static clear(): void {
    config.clear();
  }

  static getPath(): string {
    return config.path;
  }
} 