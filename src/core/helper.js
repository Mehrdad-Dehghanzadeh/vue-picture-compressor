/**
 * @summary selector for element
 * @param {String} selector media selector to selecting 
 */
export function $(selector) {
    return document.querySelector(selector)
}

/**
 * @summary remove node 
 * @param {DOM} node DOM element for remove
 */
export function removeNode(node) {
    if (typeof  node === 'string'){
        $(node).parentNode.removeChild($(node))
    }
    if (typeof  node === 'object') {
        node.parentNode.removeChild(node)
    }
}