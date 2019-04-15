const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const regexForMatch = /(.*)\s+(in)\s+(.*)$/;
const md = dir => `r-${dir}`;
const has_d = (el, dir) => el.hasAttribute(md(dir));
const get_d = (el, dir) => el.getAttribute(md(dir));
const rm_d = (el, dir) => el.removeAttribute(md(dir));
const q_d = (el, dir) => el.querySelector(`[${md(dir)}]`);
const qall_d = (el, dir) => el.querySelectorAll(`[${md(dir)}]`);
const beforeText = (el, text) => el.insertAdjacentText('beforebegin', text);
const afterText = (el, text) => el.insertAdjacentText('afterend', text);
const wrapAround = (el, before, after) => {
  beforeText(el, before);
  afterText(el, after);
};

const directives = {
  for: directive_for,
  if: directive_if,
  disabled: directive_disabled,
};

export function parseDom(el) {
  for (const dir in directives) {
    for (const el2 of qall_d(el, dir)) {
      directives[dir](el2);
    }
  }
  return el;
}

function directive_if(el) {
  if (has_d(el, 'if')) {
    const val = get_d(el, 'if');
    rm_d(el, 'if');
    beforeText(el, `\${${val} ? `);
    const rElse = el.nextElementSibling;
    if (rElse && has_d(rElse, 'else')) {
      wrapAround(el, `\``, `\``);
      rm_d(rElse, 'else');
      wrapAround(rElse, `:\``, `\`}`);
    } else {
      wrapAround(el, `\``, `\`:\`\`}`);
    }
  }
}

function directive_for(el) {
  if (has_d(el, 'for')) {
    const val = get_d(el, 'for');
    const groups = regexForMatch.exec(val);
    if (groups.length === 4) {
      const sel = groups[1];
      const query = groups[3];
      wrapAround(el, `\${${query}.map(function(${sel}) { return \``, `\`}.bind(this)).join('')}`);
      rm_d(el, 'for');
    }
  }
}

function directive_disabled(el) {
  const dir = 'disabled';
  if (has_d(el, dir)) {
    const query = get_d(el, dir);
    rm_d(el, dir);
    el.setAttribute(dir, `\${ ${query} ? true : false}`);
  }
}

//----------
/**
 * Patch baseTree with newTree
 */

/**
 *
 * @returns {boolean} true for any changes
 */
export function patchDom(newTree, baseTree = null) {
  [mergeAttrs(baseTree, newTree), walkNode(newTree, baseTree)].some(v => !v);
  return false;
}

const isProxy = node => node && node.dataset && node.dataset.proxy !== undefined;

const mergeAttrs = (baseNode, newNode) => {
  const oldAttrs = baseNode.attributes;
  const newAttrs = newNode.attributes;

  const changes = [
    // old attrs
    Array.from(oldAttrs)
      .filter(attr => !(attr in newAttrs))
      .map(attr => !baseNode.removeAttribute(attr)),
    // new attrs
    Array.from(newAttrs)
      .filter(attr => !(attr in oldAttrs) && !(oldAttrs[attr] === newAttrs[attr]))
      .map(attr => !baseNode.setAttribute(attr, newAttrs[attr])),
  ];
  return changes.some(v => v);
};

const updateAttr = (newNode, baseNode, name) => {
  if (newNode[name] !== baseNode[name]) {
    baseNode[name] = newNode[name];
    newNode[name] ? baseNode.setAttribute(name, '') : baseNode.removeAttribute(name);
    return true;
  }
};

const isNodeSame = (a, b) => {
  if (a.id) return a.id === b.id;
  if (a.isSameNode) return a.isSameNode(b);
  if (a.tagName !== b.tagName) return false;
  if (a.type === TEXT_NODE) return a.nodeValue === b.nodeValue;
  return false;
};

const updateInput = (newNode, baseNode) => {
  let newValue = newNode.value;
  const oldValue = baseNode.value;
  let updated = false;
  if (!newValue || newValue === 'undefined') {
    newValue = '';
  }
  updateAttr(newNode, baseNode, 'checked');
  updateAttr(newNode, baseNode, 'disabled');
  if (newValue !== oldValue) {
    updated = true;
    baseNode.setAttribute('value', newValue);
    baseNode.value = newValue;
  }
  if (newValue === 'null') {
    updated = true;
    baseNode.value = '';
    baseNode.removeAttribute('value');
  }
  if (!newNode.hasAttributeNS(null, 'value')) {
    updated = true;
    baseNode.removeAttribute('value');
  } else if (baseNode.type === 'range') {
    updated = true;
    baseNode.value = newValue;
  }
  return updated;
};

const updateTextarea = (newNode, baseNode) => {
  let updated = false;
  let newValue = newNode.value;
  if (!newValue || newValue === 'undefined') {
    newValue = '';
  }
  if (newValue !== baseNode.value) {
    baseNode.value = newValue;
    updated = true;
  }

  if (baseNode.firstChild && baseNode.firstChild.nodeValue !== newValue) {
    if (newValue === '' && baseNode.firstChild.nodeValue === baseNode.placeholder) {
      return;
    }
    baseNode.firstChild.nodeValue = newValue;
    updated = true;
  }
  return updated;
};
const updateForm = (nodeName, newNode, baseNode) => {
  switch (nodeName) {
    case 'INPUT':
      updateInput(newNode, baseNode);
      break;
    case 'OPTION':
      updateAttr(newNode, baseNode, 'selected');
      break;
    case 'TEXTAREA':
      updateTextarea(newNode, baseNode);
      break;
  }
};

const patchNode = (newNode, baseNode) => {
  const nodeType = newNode.nodeType;
  const nodeName = newNode.nodeName;
  if (nodeType === ELEMENT_NODE) {
    mergeAttrs(baseNode, newNode);
  }
  if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
    if (baseNode.nodeValue !== newNode.nodeValue) {
      baseNode.nodeValue = newNode.nodeValue;
    }
  }
  updateForm(nodeName, newNode, baseNode);
};

const updateNode = (newNode, baseNode) => {
  let oldChild, newChild, morphed, oldMatch;
  let offset = 0;
  let updated = true;
  for (let i = 0; ; i++) {
    oldChild = baseNode.childNodes[i];
    newChild = newNode.childNodes[i - offset];
    if (!oldChild && !newChild) {
      break;
    } else if (!newChild) {
      updated = true;
      baseNode.removeChild(oldChild);
      i--;
    } else if (!oldChild) {
      updated = true;
      baseNode.appendChild(newChild);
      offset++;
    } else if (isNodeSame(newChild, oldChild)) {
      morphed = walkNode(newChild, oldChild);
      if (morphed !== oldChild) {
        updated = true;
        baseNode.replaceChild(morphed, oldChild);
        offset++;
      }
    } else {
      oldMatch = null;
      for (let j = i; j < baseNode.childNodes.length; j++) {
        if (isNodeSame(baseNode.childNodes[j], newChild)) {
          oldMatch = baseNode.childNodes[j];
          break;
        }
      }
      if (oldMatch) {
        morphed = walkNode(newChild, oldMatch);
        if (morphed !== oldMatch) offset++;
        updated = true;
        baseNode.insertBefore(morphed, oldChild);

        // It's safe to morph two nodes in-place if neither has an ID
      } else if (!newChild.id && !oldChild.id) {
        morphed = walkNode(newChild, oldChild);
        if (morphed !== oldChild) {
          updated = true;
          baseNode.replaceChild(morphed, oldChild);
          offset++;
        }
      } else {
        if (isProxy(newChild) && !newChild.isSameNode(oldChild) && newChild.realNode) {
          updated = true;
          baseNode.insertBefore(newChild.realNode, oldChild);
        } else {
          updated = true;
          baseNode.insertBefore(newChild, oldChild);
        }
        offset++;
      }
    }
  }
  return updated;
};

const walkNode = (newNode, baseNode) => {
  if (!baseNode) return newNode;
  else if (!newNode) return null;
  else if (newNode.isSameNode && newNode.isSameNode(baseNode)) return baseNode;
  else if (newNode.tagName !== baseNode.tagName) return newNode;
  patchNode(newNode, baseNode);
  updateNode(newNode, baseNode);
  return baseNode;
};
