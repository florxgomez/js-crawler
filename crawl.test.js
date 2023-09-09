const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('./crawl');

test('returns normalized url with /', () => {
  expect(normalizeURL('https://blog.boot.dev/path/')).toBe(
    'blog.boot.dev/path'
  );
});

test('returns normalized url with capitals', () => {
  expect(normalizeURL('https://BLOG.boot.dev/path/')).toBe(
    'blog.boot.dev/path'
  );
});

test('returns normalized url with http', () => {
  expect(normalizeURL('http://BLOG.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('getURLsFromHTML absolute', () => {
  const inputURL = 'https://blog.boot.dev';
  const inputBody =
    '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>';

  expect(getURLsFromHTML(inputBody, inputURL)).toEqual([
    'https://blog.boot.dev/',
  ]);
});

test('getURLsFromHTML relative', () => {
  const inputURL = 'https://blog.boot.dev';
  const inputBody =
    '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>';

  expect(getURLsFromHTML(inputBody, inputURL)).toEqual([
    'https://blog.boot.dev/path/one',
  ]);
});

test('getURLsFromHTML with error', () => {
  const inputURL = 'https://blog.boot.dev';
  const inputBody =
    '<html><body><a href="path/one"><span>Boot.dev></span></a></body></html>';

  expect(getURLsFromHTML(inputBody, inputURL)).toEqual([]);
});
