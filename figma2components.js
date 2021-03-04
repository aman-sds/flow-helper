#!/usr/bin/env node
require('dotenv').config()
const fetch = require('node-fetch');
const fs = require('fs');
const figma = require('./scripts/FE/figma-to-components/figma');

const headers = new fetch.Headers();

const devToken = process.env.FIGMA_DEV_TOKEN;
const fileKey = process.env.FIGMA_FILE_KEY;

if (!devToken){
  return console.log('Please set FIGMA_DEV_TOKEN in .env');
}
if (!fileKey){
  return console.log('Please set FIGMA_FILE_KEY in .env');
}

headers.append('X-Figma-Token', devToken);

const baseUrl = 'https://api.figma.com';

const vectorMap = {};
const vectorList = [];
const vectorTypes = ['VECTOR', 'LINE', 'REGULAR_POLYGON', 'ELLIPSE', 'STAR'];

function preprocessTree(node) {
  let vectorsOnly = node.name.charAt(0) !== '#';
  let vectorVConstraint = null;
  let vectorHConstraint = null;

  function paintsRequireRender(paints) {
    if (!paints) return false;

    let numPaints = 0;
    for (const paint of paints) {
      if (paint.visible === false) continue;

      numPaints++;
      if (paint.type === 'EMOJI') return true;
    }

    return numPaints > 1;
  }

  if (paintsRequireRender(node.fills) ||
    paintsRequireRender(node.strokes) ||
    (node.blendMode != null && ['PASS_THROUGH', 'NORMAL'].indexOf(node.blendMode) < 0)) {
    node.type = 'VECTOR';
  }

  const children = node.children && node.children.filter((child) => child.visible !== false);
  if (children) {
    for (let j=0; j<children.length; j++) {
      if (vectorTypes.indexOf(children[j].type) < 0) vectorsOnly = false;
      else {
        if (vectorVConstraint != null && children[j].constraints.vertical != vectorVConstraint) vectorsOnly = false;
        if (vectorHConstraint != null && children[j].constraints.horizontal != vectorHConstraint) vectorsOnly = false;
        vectorVConstraint = children[j].constraints.vertical;
        vectorHConstraint = children[j].constraints.horizontal;
      }
    }
  }
  node.children = children;

  if (children && children.length > 0 && vectorsOnly) {
    node.type = 'VECTOR';
    node.constraints = {
      vertical: vectorVConstraint,
      horizontal: vectorHConstraint,
    };
  }

  if (vectorTypes.indexOf(node.type) >= 0) {
    node.type = 'VECTOR';
    vectorMap[node.id] = node;
    vectorList.push(node.id);
    node.children = [];
  }

  if (node.children) {
    for (const child of node.children) {
      preprocessTree(child);
    }
  }
}

async function main(baseUrl, fileKey, headers) {
  console.log('> We start. It can take up to 15 min. Please wait...');
  let resp = await fetch(`${baseUrl}/v1/files/${fileKey}`, {headers});
  let data = await resp.json();

  const doc = data.document;
  const canvas = doc.children[0];
  let html = '';
  const importDir = 'common/components/figma'
  const targetDir = `src/${importDir}`

  if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (let i=0; i < canvas.children.length; i++) {
    const child = canvas.children[i];
    if (child.name.charAt(0) === '#'  && child.visible !== false) {
      const child = canvas.children[i];
      preprocessTree(child);
    }
  }

  let guids = vectorList.join(',');
  data = await fetch(`${baseUrl}/v1/images/${fileKey}?ids=${guids}&format=svg`, {headers});
  const imageJSON = await data.json();

  const images = imageJSON.images || {};
  if (images) {
    let promises = [];
    let guids = [];
    for (const guid in images) {
      if (images[guid] == null) continue;
      guids.push(guid);
      promises.push(fetch(images[guid]).catch(e => {console.error(e); return {}}));
    }

    let responses = await Promise.all(promises);
    promises = [];
    for (const resp of responses) {
      resp.text && promises.push(resp.text());
    }

    responses = await Promise.all(promises);
    for (let i=0; i<responses.length; i++) {
      const gradientId = Math.floor(Math.random()*10**10);
      images[guids[i]] = responses[i].replace(/paint.*_linear/g, a => `${a}_${gradientId}`);
      // images[guids[i]] = responses[i].replace('<svg ', '<svg preserveAspectRatio="none" ');
    }
  }

  const componentMap = {};
  const stylesMap = {};
  let contents = `import React, { PureComponent } from 'react';\n`;
  let nextSection = '';

  for (let i=0; i<canvas.children.length; i++) {
    const child = canvas.children[i]
    if (child.name.charAt(0) === '#' && child.visible !== false) {
      const child = canvas.children[i];
      figma.createComponent(child, images, componentMap, stylesMap);
      nextSection += `export class Master${child.name.replace(/\W+/g, "")} extends PureComponent {\n`;
      nextSection += "  render() {\n";
      nextSection += `    return <div className="master" style={{backgroundColor: "${figma.colorString(child.backgroundColor)}"}}>\n`;
      nextSection += `      <C${child.name.replace(/\W+/g, "")} {...this.props} nodeId="${child.id}" />\n`;
      nextSection += "    </div>\n";
      nextSection += "  }\n";
      nextSection += "}\n\n";
    }
  }

  const imported = {};
  for (const key in componentMap) {
    const component = componentMap[key];
    const name = component.name;
    if (!imported[name]) {
      contents += `import { ${name} } from '${importDir}/${name}';\n`;
    }
    imported[name] = true;
  }
  contents += "\n";
  contents += nextSection;
  nextSection = '';

  contents += `export function getComponentFromId(id) {\n`;

  for (const key in componentMap) {
    if (componentMap[key].instance) contents += `  if (id === "${key}") return ${componentMap[key].instance};\n`;
    if (componentMap[key].doc) nextSection += componentMap[key].doc + "\n";
  }

  contents += "  return null;\n}\n\n";
  contents += nextSection;

  const path = "src/figmaComponents.ts";
  fs.writeFile(path, contents, function(err) {
    if (err) console.log(err);
    console.log(`wrote ${path}`);
  });

  const stylesDir = 'src/app/assets/sass/figma'

  if (!fs.existsSync(stylesDir)){
    fs.mkdirSync(stylesDir, { recursive: true });
  }

  const stylesPath = `${stylesDir}/_classes.scss`;
  const styleContent = Object.keys(stylesMap).map(className =>
    `.${className} ${stylesMap[className]}`
  ).join('\n\n');

  fs.writeFile(stylesPath, styleContent, function(err) {
    if (err) console.log(err);
    console.log(`wrote ${stylesPath}`);
  });
}

main(baseUrl, fileKey, headers).catch((err) => {
  console.error(err);
  console.error(err.stack);
});
