# flow-helper

To start using:

- yarn add --dev @axmit/flow-helper

- Start using

```yarn new FE | BE``` - create empty project

```yarn sync FE | BE``` - sync config files

```yarn mr``` - create new MR 

```yarn figma2style``` - get styles/variables from Figma

# Figma to Style
## Introduction

First, you should create a `.env ` file, where you write access token key

```sh
FIGMA_DEV_TOKEN=11111-38ebb60d-baf8-455f-808c-f9a2519a1c7c
FIGMA_FILE_KEY=
FIGMA_TYPE=
FIGMA_SPACER_ARG=
```

Then change `<YOUR_TOKEN>` in `.env` file to your personal access token key

Token key you can take in [this](https://www.figma.com/developers/docs#authentication).
You can create a temporary access token by clicking right there on `Get personal access token` or read how to make permanent access token.

## Install

Run this command:

```
yarn install
```

Then, you should run the script and you will need a file key.
The file key can be parsed from any Figma file url: `https://www.figma.com/file/${file_key}/${title}`.

Run command in terminal

```
yarn figma2style
```
Wait for the script to finish...

In root directory you can see folder `src/app/assets/sass/figma` where are the generated `scss` file.

## Options (NOT IMPLEMENTED YET)

If you work in Figma with a big team, and you have team styles, you can take them.
The teams key can be parsed from any Figma team url: `https://www.figma.com/files/team/${teams_key}/${title}`

```
node main.js ${teams_key} teams
```

If your Figma file has a "node element" with "spacers geometry", you can also add them to generate styles.

```
node main.js ${file_key} files spacers=${node_id}
```

> The node_id key can be parsed from any Figma team url: `https://www.figma.com/file/${file_key}/${title}?node-id=${node_id}`

If you want to customize more accurate style generation and not only on `Web` but also `iOS` and `Android`.

Change the configuration in the file `config.json`

Read more about all possible settings here in [Style Dictionary](https://amzn.github.io/style-dictionary/#/README)

#### Version
```
yarn -v 1.16.0

node -v 10.16.0
```
