import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf8')
);

// Create the asset file content
const assetFileContent = `<?php
return array(
    'dependencies' => array(
        'wp-element',
        'wp-components',
        'wp-i18n'
    ),
    'version' => '${packageJson.version}'
);
`;

// Ensure dist directory exists
const distDir = join(__dirname, '..', 'dist');
mkdirSync(distDir, { recursive: true });

// Write the asset file
writeFileSync(
    join(distDir, 'index.asset.php'),
    assetFileContent
);

console.log('Created index.asset.php file');