const { JSDOM } = require('jsdom');

function crawlPage(url) {
	fetch(url, {
		mode: 'cors'
	}).then(data => {
		if (data.status >= 400) {
			console.error(`Unable to reach ${url}, check again or try again later...`);
			return;
		}
		if (!data.headers.get('content-type').includes('text/html')) {
			console.error(`Did not recieve HTML from request, check ${url} and try again...`);
			return;
		}
		return data.text()
	}).then(body => {
		console.log(body);
	});
}

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
	const dom = new JSDOM(htmlBody)
	const a = dom.window.document.querySelectorAll('a')
	const result = [];
	a.forEach(link =>  {
		if (link.href[0] === '/') {
			try {
				result.push(new URL(link.href, baseURL).href)
			} catch (err){
				console.log(`${err.message}: ${link.href}`)
			}
		} else {
			try {
				result.push(new URL(link.href).href)
			} catch (err){
				console.log(`${err.message}: ${link.href}`)
			}
		}
	});
	return result;
}

module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage
}
