import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PackageJson {
  name: string;
  version: string;
  description: string;
}

export function getPackageJson(): PackageJson {
  const packagePath = join(__dirname, '../../package.json');
  const packageContent = readFileSync(packagePath, 'utf-8');
  return JSON.parse(packageContent);
} 