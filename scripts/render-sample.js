import fs from 'fs';
import { compileCyberCard } from '../src/lib/cardCompiler.js';
import { MOCK_OCTOCAT } from '../src/lib/github.js';

const cyberSvg = compileCyberCard(MOCK_OCTOCAT, { theme: 'cybercore' });
const toxicSvg = compileCyberCard(MOCK_OCTOCAT, { theme: 'toxic' });

fs.writeFileSync('./cybercore-card.svg', cyberSvg);
fs.writeFileSync('./toxic-card.svg', toxicSvg);

console.log('Sample Cybercore SVGs generated successfully!');
console.log('cybercore-card.svg size:', cyberSvg.length, 'bytes');
console.log('toxic-card.svg size:', toxicSvg.length, 'bytes');
