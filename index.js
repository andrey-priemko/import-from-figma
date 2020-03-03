const {loadRoot} = require('./loader')
const {writeColors, writeColorsByPageId} = require('./colors')
const {writeFonts, writeFontsByPageId} = require('./fonts')
const {loadIcons} = require('./icons')



async function loadDocument() {
    const json = await loadRoot()
    const styles = json.styles

	// writeColors(styles)
	const colors = await writeColorsByPageId('1:2') // Components -> Color
	// writeFonts(styles)
	writeFontsByPageId('2:7') // Components -> Title and texts

	loadIcons('65:812', colors) // Icons & Illustrations -> Icons
}

loadDocument()
