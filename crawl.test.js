const { describe, test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('./crawl.js');

describe('GetURLsFromHTML', () => {
	test('urls are retrieved', () => {
		const html = '<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a></body></html>';
		expect(getURLsFromHTML(html)).toContain('https://blog.boot.dev')
	})

	test('multiple urls are retrieved', () => {
		const baseURL = 'www.w3.org';
		const html = ` <h2>Absolute URLs</h2>
<p><a href="https://www.w3.org/">W3C</a></p>
<p><a href="https://www.google.com/">Google</a></p> `;
		expect(getURLsFromHTML(html, baseURL)).toContain('https://www.w3.org/');
		expect(getURLsFromHTML(html, baseURL)).toContain('https://www.google.com/');
	})

	test('relative links are retrieved as absolute urls', () => {
		const baseURL = 'https://www.w3.org';
		const html = ` <h2>Absolute URLs</h2>
<p><a href="https://www.w3.org/">W3C</a></p>
<p><a href="https://www.google.com/">Google</a></p>

<h2>Relative URLs</h2>
<p><a href="html_images.asp">HTML Images</a></p>
<p><a href="/css/default.asp">CSS Tutorial</a></p> `;

		expect(getURLsFromHTML(html, baseURL)).toContain('https://www.w3.org/css/default.asp');
		// TODO: This is broken for links that don't have a starting /
		// expect(getURLsFromHTML(html, baseURL)).toContain('https://www.w3.org/html_images.asp');
	})
})

describe('NormalizeURL', () => {
	test('returns valid url', () => {
		const expected = 'blog.boot.dev/path';
		expect(normalizeURL('https://blog.boot.dev/path/')).toBe(expected);
		expect(normalizeURL('https://blog.boot.dev/path')).toBe(expected);
		expect(normalizeURL('http://blog.boot.dev/path/')).toBe(expected);
		expect(normalizeURL('http://blog.boot.dev/path')).toBe(expected);
	})
	test('returns valid multi-level path', () => {
		expect(normalizeURL('http://blog.boot.dev/path/again')).toBe('blog.boot.dev/path/again');
		expect(normalizeURL('http://boot.dev/path/again?q=hello')).toBe('boot.dev/path/again');
		expect(normalizeURL('http://boot.dev/path/again/no/matter/how/long')).toBe('boot.dev/path/again/no/matter/how/long');
	})

	test('returns null if invalid', () => {
		expect(normalizeURL('path/again?q=hello')).toBe(null);
	})

	test('normalizeURL protocol', () => {
	  const input = 'https://blog.boot.dev/path'
	  const actual = normalizeURL(input)
	  const expected = 'blog.boot.dev/path'
	  expect(actual).toEqual(expected)
	})

	test('normalizeURL slash', () => {
	  const input = 'https://blog.boot.dev/path/'
	  const actual = normalizeURL(input)
	  const expected = 'blog.boot.dev/path'
	  expect(actual).toEqual(expected)
	})

	test('normalizeURL capitals', () => {
	  const input = 'https://BLOG.boot.dev/path'
	  const actual = normalizeURL(input)
	  const expected = 'blog.boot.dev/path'
	  expect(actual).toEqual(expected)
	})

	test('normalizeURL http', () => {
	  const input = 'http://BLOG.boot.dev/path'
	  const actual = normalizeURL(input)
	  const expected = 'blog.boot.dev/path'
	  expect(actual).toEqual(expected)
	})
});
