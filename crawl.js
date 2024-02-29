const { JSDOM } = require('jsdom');

function normalizeURL(url) {
	try {
		const urlObject = new URL(url);
		let result = `${urlObject.hostname}${urlObject.pathname}`;
		if (result[result.length - 1] === '/') {
			return result.slice(0, result.length - 1);
		}
		return `${urlObject.hostname}${urlObject.pathname}`;
	} catch (err) {
		console.log('Error normalizing url: ', err.message);
		return null
	}
}

function getURLsFromHTML(htmlBody, baseURL) {
	const dom = new JSDOM(htmlBody);
	const a = dom.window.document.querySelectorAll('a');
	const result = [];
	a.forEach(tag => {
		const url = tag.getAttribute('href');
		if (url[0] === '/') {
			result.push(`${baseURL}${url}`);
		} else {
			result.push(tag.getAttribute('href'))
		}
	});
	return result;
}

module.exports = {
	normalizeURL,
	getURLsFromHTML
}
