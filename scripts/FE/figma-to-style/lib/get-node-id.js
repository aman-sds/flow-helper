const URL = require('url');
const fetch = require('node-fetch');
const headers = new fetch.Headers();
headers.append('X-Figma-Token', process.env.FIGMA_DEV_TOKEN);

module.exports = async function (node_id, file_key, URLformat) {
	URLformat = {
		...URLformat,
		pathname: `/v1/files/${file_key}/nodes`,
		query: {
			...URLformat.query,
			ids: node_id
		}
	}

	const result = await fetch(`${URL.format(URLformat).toString()}`, { headers });
	const figmaTreeStructure = await result.json();

	return figmaTreeStructure.nodes[node_id];
}
