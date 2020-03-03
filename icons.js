const fs = require('fs')
const fetch = require('node-fetch')
const {loadNode, loadNodes2, loadSvg} = require('./loader')

async function loadIcons(id, colors) {
    const iconsPage = await loadNode(id)
    const components = iconsPage.components
    const ids = Object.keys(components)

    const svgUrls = await loadSvg(ids.join(','))
    const nodes = await loadNodes2(ids)

    const icons = []
    for (const id of ids)
    {
        const iconUrl = svgUrls.images[id]
        const svgColors = Object.values(nodes[id].styles)
            .map(v => colors[v.name])
            .filter(v => v)

        const iconInfo = fetch(iconUrl)
            .then(res => res.text())
            .then(iconText => ({
                name: components[id].name,
                text: iconText,
                svgColors,
            }))
        icons.push(iconInfo)
    }

    const iconsData = await(Promise.all(icons))
    let i = 0
    for (const icon of iconsData) 
    {
        const componentName = icon.name.replace(/[/ ]+/g, '')
        const filename = componentName + '.js'

        let svgText = icon.text
        for (const color of icon.svgColors)
        {
            svgText = svgText.replace(new RegExp(color.value, 'g'), `var(${color.cssName})`)
        }
        
        const component = `
/**
* @param {TemplateLiteralFn} html
*/
function ${componentName}(html) {
    return html\`
${svgText}\`
}

export {
    ${componentName},
}
`

        fs.writeFileSync(`icons/${filename}`, component, {
            encoding: 'utf-8'
        })    
    }
}

module.exports = {
    loadIcons,
}