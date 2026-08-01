// scripts/check-links.mjs
// Verifies every external repoUrl/liveUrl in project frontmatter resolves,
// and that the resume PDF ships in dist/. Run after `npm run build`.
import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const PROJECTS_DIR = 'src/content/projects';
const DIST_RESUME = 'dist/SA_Resume.pdf';

function extractUrls(frontmatter) {
  const urls = [];
  for (const match of frontmatter.matchAll(/^(repoUrl|liveUrl):\s*(\S+)/gm)) {
    urls.push(match[2]);
  }
  return urls;
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (res.status === 405 || res.status === 403) {
      // Some hosts (e.g. GitHub) reject HEAD; retry with GET.
      const getRes = await fetch(url, { method: 'GET', redirect: 'follow' });
      return getRes.ok;
    }
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  let failed = false;

  try {
    await access(DIST_RESUME);
  } catch {
    console.error(`FAIL  ${DIST_RESUME} does not exist — resume will 404 in production.`);
    failed = true;
  }

  const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith('.md'));
  const urls = new Set();
  for (const file of files) {
    const content = await readFile(join(PROJECTS_DIR, file), 'utf-8');
    const frontmatter = content.split('---')[1] ?? '';
    for (const url of extractUrls(frontmatter)) urls.add(url);
  }

  const results = await Promise.all(
    [...urls].map(async (url) => [url, await checkUrl(url)])
  );

  for (const [url, ok] of results) {
    if (!ok) {
      console.error(`FAIL  ${url}`);
      failed = true;
    } else {
      console.log(`OK    ${url}`);
    }
  }

  if (failed) {
    console.error('\nLink check failed.');
    process.exit(1);
  }
  console.log('\nAll links resolved.');
}

main();
