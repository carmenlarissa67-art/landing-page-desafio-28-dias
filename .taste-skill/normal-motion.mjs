// Audit adapter: Windows has reduced motion enabled. Test normal motion explicitly;
// the inspector's separate reduced-motion page still receives its original setting.
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const { Browser } = await import(pathToFileURL(join(process.env.USERPROFILE, '.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs')));
const newPage = Browser.prototype.newPage;
Browser.prototype.newPage = async function(options = {}) {
  const page = await newPage.call(this, options);
  await page.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: options.reducedMotion ? 'reduce' : 'no-preference' }],
  });
  return page;
};
