import fs from 'fs';
import path from 'path';

const dir = 'allure-results';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const content = `
Environment=${process.env.ENVIRONMENT}
Author=${process.env.AUTHOR}
Platform=${process.env.PLATFORM}
Browser=${process.env.BROWSER}
`.trim();

fs.writeFileSync(
  path.join(dir, 'environment.properties'),
  content
);

console.log('environment.properties generated');
