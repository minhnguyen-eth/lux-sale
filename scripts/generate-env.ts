import fs from 'fs';
import path from 'path';

const envPath = path.join(
  process.cwd(),
  'allure-results',
  'environment.properties'
);

const output = [
  `Environment=${process.env.ENVIRONMENT || 'Unknown'}`,
  `Author=${process.env.AUTHOR || 'Unknown'}`,
  `Platform=${process.env.PLATFORM || process.platform}`,
  `Browser=${process.env.BROWSER || 'Unknown'}`
].join('\n');

fs.mkdirSync(path.dirname(envPath), { recursive: true });
fs.writeFileSync(envPath, output + '\n', 'utf8');

console.log(`Generated environment file at ${envPath}`);
console.log(output);