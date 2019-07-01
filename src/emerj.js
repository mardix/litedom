/**
 * emerj
 * https://github.com/bryhoyt/emerj
 */

import { getAttrs, isElement } from './utils.js';

const getNodesByKey = (parent, makeKey) =>
  Array.from(parent.childNodes)
    .filter(e => makeKey(e))
    .map(e => ({ [makeKey(e)]: e }))
    .reduce((pV, cK) => ({ ...pV, ...cK }), {});

/**
 *
 * @param {HTMLElement} node
 */
const nodeRefKey = node => (isElement(node) && node.hasAttribute('ref-key') ? node.getAttribute('ref-key') : node.id);

export default function merge(base, modified, opts = {}) {
  opts = { key: node => nodeRefKey(node), ...opts };
  if (typeof modified === 'string') {
    const html = modified;
    modified = document.createElement(base.nodeName);
    modified.innerHTML = html;
  }
  const nodesByKeyOld = getNodesByKey(base, opts.key);
  let idx;
  for (idx = 0; modified.firstChild; idx++) {
    const newNode = modified.removeChild(modified.firstChild);
    if (idx >= base.childNodes.length) {
      base.appendChild(newNode);
      continue;
    }
    let baseNode = base.childNodes[idx];

    const newKey = opts.key(newNode);
    if (opts.key(baseNode) || newKey) {
      const match = newKey && newKey in nodesByKeyOld ? nodesByKeyOld[newKey] : newNode;
      if (match !== baseNode) baseNode = base.insertBefore(match, baseNode);
    }
    if (baseNode.nodeType !== newNode.nodeType || baseNode.tagName !== newNode.tagName) {
      base.replaceChild(newNode, baseNode);
    } else if ([Node.TEXT_NODE, Node.COMMENT_NODE].indexOf(baseNode.nodeType) >= 0) {
      if (baseNode.textContent !== newNode.textContent) baseNode.textContent = newNode.textContent;
    } else if (baseNode !== newNode) {
      const attrsBase = getAttrs(baseNode);
      const attrsNew = getAttrs(newNode);
      for (const attr in attrsBase) {
        if (!(attr in attrsNew)) baseNode.removeAttribute(attr);
      }
      for (const attr in attrsNew) {
        if (!(attr in attrsBase && attrsBase[attr] === attrsNew[attr])) baseNode.setAttribute(attr, attrsNew[attr]);
      }
      merge(baseNode, newNode);
    }
  }
  while (base.childNodes.length > idx) {
    base.removeChild(base.lastChild);
  }
  return true;
}
