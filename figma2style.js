#!/usr/bin/env node
require('dotenv').config();
const libPath = `${__dirname}/scripts/FE/figma-to-style/`;
const fs = require('fs');
const shell = require('shelljs');

const getStylesArtboard = require(libPath + 'lib/get-styles-artboard.js');
const getSpacers = require(libPath + 'lib/get-spacers.js');
const StyleDictionary = require('style-dictionary').extend(libPath + 'config.js');

const devToken = process.env.FIGMA_DEV_TOKEN || process.argv[1];
const fileKey = process.env.FIGMA_FILE_KEY || process.argv[2];
const type = process.env.FIGMA_TYPE || process.argv[3];
const spacerArg = process.env.FIGMA_SPACER_ARG || process.argv[4];

if (!devToken){
	return console.log('Please set FIGMA_DEV_TOKEN in .env');
}
if (!fileKey){
	return console.log('Please set FIGMA_FILE_KEY in .env');
}

let spacersId;
if (spacerArg && spacerArg.indexOf('spacers') !== -1) {
	spacersId = spacerArg.slice(spacerArg.indexOf('=')+1, spacerArg.length);
}

let query = {
	url: {
		host: 'api.figma.com',
		protocol: 'https',
	}
}

async function figma2style() {
	console.log('> We start. It can take up to 15 min. Please wait...');
	const style = await getStylesArtboard(fileKey, query.url);
	let result = style;

	if (spacersId && type === 'files') {
		const spacers = await getSpacers(spacersId, fileKey, query.url);
		result = {
			...style,
			size: {
				...style.size,
				spacers
			}
		}
	}

	shell.exec(`rm -rf ${libPath}json/token.json`);
	const pathWriteFile = `${libPath}json/token.json`;

	const targetDir = 'src/app/assets/sass/figma'

	if (!fs.existsSync(targetDir)){
		fs.mkdirSync(targetDir, { recursive: true });
	}

	fs.writeFile(pathWriteFile, JSON.stringify(result), (err) => {
		if (err) console.log(err);
		StyleDictionary.cleanAllPlatforms();
		console.log(`> Ok, we finish! And wrote file ${pathWriteFile}`);
		console.log('> Now, we will compile the styles for you! -->');
		shell.exec(`${__dirname}/node_modules/.bin/style-dictionary build -c ${__dirname}/scripts/FE/figma-to-style/config.js`);
	});
}

figma2style().catch((err) => {
	console.error(err);
	console.error(err.stack);
});
