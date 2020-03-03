const fs = require("fs")
const {loadNode, loadNodes} = require('./loader')

/**
 * @param {number} rgbValue 
 */
function formatHex(rgbValue) {
	return rgbValue
		.toString(16)
		.padStart(2, 0)
		.toLocaleUpperCase()
}

/**
 * @param {{
 *   r: number,
 *   g: number,
 *   b: number,
 * }} color 
 * @param {number} opacity 
 */
function formatColor(color, opacity) {
	const r = Math.round(color.r * 255)
	const g = Math.round(color.g * 255)
	const b = Math.round(color.b * 255)

	if (typeof opacity == 'number')
	{
		return `rgba(${r}, ${g}, ${b}, ${opacity})`
	}

    return `#${formatHex(r)}${formatHex(g)}${formatHex(b)}`
}

/**
 * @param {Object} styles
 */
async function writeColors(styles) {
    const fillKeys = Object.keys(styles)
        .filter(v => styles[v].styleType == 'FILL')

    const fillNodes = (await loadNodes(fillKeys))
        .map(v => ({
            name: v.document.name,
            cssName: `--color-${v.document.name.toLocaleLowerCase().replace(/[ /%()+#,".]+/g, '-')}`,
            value: formatColor(
                v.document.fills[0].color, 
                v.document.fills[0].opacity
            ),
        }))

    const content = `:root {
	${fillNodes
        .map(fill => `${fill.cssName}: ${fill.value};`)
        .join('\n\t')
    }
}`
	fs.writeFileSync('css/_colorVariables.css', content, {
		encoding: 'utf-8'
    })
    
    const colors = {}
    fillNodes.forEach(color => {
        colors[color.name] = {
            cssName: color.cssName,
            value: color.value,
        }
    })

    return colors
}

async function writeColorsByPageId(id) {
    const colorsNode = await loadNode(id)
    return writeColors(colorsNode.styles)
}

module.exports = {
    writeColors,
    writeColorsByPageId,
}