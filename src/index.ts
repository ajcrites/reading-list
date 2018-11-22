import * as MarkdownIt from 'markdown-it';
import * as taskLists from 'markdown-it-task-lists';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const md = new MarkdownIt({
  linkify: true,
});

const parser = md.use(taskLists);

mkdirSync('reading-list');
writeFileSync(
  'reading-list/index.html',
  parser.render(readFileSync('README.md', 'utf-8')),
);
