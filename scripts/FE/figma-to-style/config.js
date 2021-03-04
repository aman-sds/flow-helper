module.exports = {
	"source": [
		__dirname + "/json/**/*.json"
	],
	"platforms": {
		"scss": {
			"transformGroup": "scss",
			"buildPath": "src/app/assets/sass/figma/",
			"transforms": ["attribute/cti", "name/cti/kebab", "time/seconds", "size/px", "color/css"],
			"files": [{
				"destination": "_variables.scss",
				"format": "scss/variables"
			}]
		}
	}
}
