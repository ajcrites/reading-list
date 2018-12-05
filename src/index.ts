import * as MarkdownIt from 'markdown-it';
import * as taskLists from 'markdown-it-task-lists';
import { JSDOM } from 'jsdom';
import * as mkdirp from 'mkdirp-promise';
import { join } from 'path';
const fsPromises = require('fs').promises;
const { readFile, writeFile } = fsPromises;

(async () => {
  const md = new MarkdownIt({
    linkify: true,
  });

  const parser = md.use(taskLists);

  await mkdirp('build');
  const html = parser.render(await readFile('README.md', 'utf-8'));
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  await Promise.all(
    [].slice.call(doc.querySelectorAll('a[href]')).map(async elem => {
      const url = elem.textContent.trim();
      // Only update title if we haven't already set a different title
      if (url === elem.getAttribute('href')) {
        try {
          const contentDom = await JSDOM.fromURL(url);
          const contentDoc = contentDom.window.document;

          const title = contentDoc.querySelector('title');
          if (title && title.textContent.trim()) {
            elem.textContent = title.textContent.trim();
          }
        } catch {}
      }
    }),
  );

  const head = doc.querySelector('head');
  head.innerHTML = await readFile(join(__dirname, '/head.html'));

  await writeFile('build/index.html', dom.serialize());
  await writeFile(
    'build/_redirects',
    ['http', 'https']
      .map(
        scheme =>
          `${scheme}://${
            process.env.TF_VAR_app_name
          }.netlify.com/* ${scheme}://${
            process.env.TF_VAR_site_name
          }/:splat 301!`,
      )
      .join('\n'),
  );
})();
