import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { build } from 'esbuild';

const css = await readFile('src/styles.css', 'utf8');
const html = await readFile('index.html', 'utf8');
await writeFile('index.html', html.replace(/<style>[\s\S]*?<\/style>/, () => `<style>\n${css}\n</style>`));
await build({
  entryPoints: ['src/motion.js'], outfile: 'assets/site-motion.js',
  bundle: true, minify: true, format: 'esm', target: 'es2020', legalComments: 'eof',
});
// Only public files referenced by the page enter the hosting output.
const output = await readFile('index.html', 'utf8');
await mkdir('dist/assets', { recursive: true });
await writeFile('dist/index.html', output);
const assets = new Set([...output.matchAll(/(?:src|srcset|poster|href)="(assets\/[^" ]+)/g)].map(m => m[1]));
assets.add('assets/og-image.jpg');
await Promise.all([...assets].map(asset => copyFile(asset, `dist/${asset}`)));
console.log('CSS e animações compilados. Site estático pronto em dist/.');
