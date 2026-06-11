import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const baseUrl =
  process.env.LIGHTHOUSE_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';
const paths = (process.env.LIGHTHOUSE_PATHS ?? '/feed')
  .split(',')
  .map((path) => path.trim())
  .filter(Boolean);
const outDir = resolve(process.env.LIGHTHOUSE_OUT_DIR ?? 'reports/lighthouse');
const minimumScore = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? 0.9);

await mkdir(outDir, { recursive: true });

let belowThreshold = false;
const chrome = await launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  for (const path of paths) {
    const url = new URL(path, baseUrl).href;
    const name = path.replace(/^\//, '').replace(/[^a-z0-9-]+/gi, '-') || 'root';
    const result = await lighthouse(url, {
      port: chrome.port,
      output: ['html', 'json'],
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      logLevel: 'info',
    });

    if (!result) throw new Error(`Lighthouse did not return a result for ${url}`);

    const [html, json] = Array.isArray(result.report) ? result.report : [result.report, ''];
    await writeFile(resolve(outDir, `${name}.html`), html);
    await writeFile(resolve(outDir, `${name}.json`), json);

    const categories = result.lhr.categories;
    const accessibility = categories.accessibility?.score ?? 0;
    const bestPractices = categories['best-practices']?.score ?? 0;
    const performance = categories.performance?.score ?? 0;
    const seo = categories.seo?.score ?? 0;

    console.log(
      [
        `Lighthouse ${url}`,
        `accessibility=${Math.round(accessibility * 100)}`,
        `best-practices=${Math.round(bestPractices * 100)}`,
        `performance=${Math.round(performance * 100)}`,
        `seo=${Math.round(seo * 100)}`,
      ].join(' '),
    );

    if (accessibility < minimumScore || bestPractices < minimumScore) {
      belowThreshold = true;
      console.warn(
        `Lighthouse soft threshold missed for ${url}: accessibility and best-practices should be >= ${Math.round(
          minimumScore * 100,
        )}`,
      );
    }
  }
} finally {
  await chrome.kill();
}

if (belowThreshold) {
  console.warn('Lighthouse thresholds are report-only for now; not failing this run.');
}
