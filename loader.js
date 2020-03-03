const fetch = require('node-fetch')
const {documentId, figmaToken} = require('./figma.config')

async function load(url) {
    const res = await fetch(url, {headers: {
        'X-Figma-Token': figmaToken,
    }})
    return res.json()
}

function loadRoot() {
    return load(`https://api.figma.com/v1/files/${documentId}/`)
}

/**
 * @param {Array<string>} ids 
 */
async function loadNodes(ids) {
    const res = await load(`https://api.figma.com/v1/files/${documentId}/nodes?ids=${ids.join(',')}`)
    return Object.values(res.nodes)
}

/**
 * @param {Array<string>} ids 
 */
async function loadNodes2(ids) {
    const res = await load(`https://api.figma.com/v1/files/${documentId}/nodes?ids=${ids.join(',')}`)
    return res.nodes
}

/**
 * @param {string} nodeId 
 */
async function loadNode(nodeId) {
    const nodes = await loadNodes([nodeId])
    return nodes[0]
}

function loadSvg(nodeId) {
    return load(`https://api.figma.com/v1/images/${documentId}?ids=${nodeId}&format=svg`)
}

module.exports = {
    load,
    loadRoot,
    loadNode,
    loadNodes,
    loadNodes2,
    loadSvg,
}