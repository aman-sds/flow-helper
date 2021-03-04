const URL = require('url');
const fetch = require('node-fetch');
const headers = new fetch.Headers();
headers.append('X-Figma-Token', process.env.FIGMA_DEV_TOKEN);

module.exports = async function (file_key, URLformat) {
	URLformat = {
		...URLformat,
		pathname: `/v1/files/${file_key}`
	}
	const result = await fetch(`${URL.format(URLformat).toString()}`, { headers });
	const figmaTreeStructure = await result.json();
	if (figmaTreeStructure.status === 403){
		console.log('Wrong FIGMA_DEV_TOKEN', figmaTreeStructure)
	}

	return figmaTreeStructure;
}
