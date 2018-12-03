import * as MarkdownIt from 'markdown-it';
import * as taskLists from 'markdown-it-task-lists';
import { JSDOM } from 'jsdom';
import * as mkdirp from 'mkdirp-promise';
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
  const metaCharset = doc.createElement('meta');
  const metaViewport = doc.createElement('meta');
  metaCharset.setAttribute('charset', 'UTF8');
  metaViewport.setAttribute('name', 'viewport');
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
  head.appendChild(metaCharset);
  head.appendChild(metaViewport);
  await writeFile('build/index.html', dom.serialize());
})();
