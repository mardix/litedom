const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const EVENTS_LIST = [
  'keydown',
  'keypress',
  'keyup',
  'focus',
  'blur',
  'hover',
  'change',
  'input',
  'reset',
  'submit',
  'click',
  'dblclick',
  'mouseenter',
  'mouseleave',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'contextmenu',
  'select',
  'drag',
  'dragend',
  'dragenter',
  'dragstart',
  'dragleave',
  'drop',
  'cut',
  'copy',
  'paste',
];
const ATTR_EVENTS_LIST = 'r-on_events';
// to prevent conflict, name that may clash prefix them with $
const DIRECTIVES_LIST = {
  $for: r_for,
  $if: r_if,
  disabled: r_disabled,
  $class: r_class,
};

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
const replaceChild = (newEl, el) => el.parentNode.replaceChild(newEl, el);
const mkEventName = e => `r-on-${e}`;

function r_if(el, value, directive) {
  rm_d(el, directive);
  beforeText(el, `\${${value} ? `);
  const rElse = el.nextElementSibling;
  if (rElse && has_d(rElse, 'else')) {
    wrapAround(el, `\``, `\``);
    rm_d(rElse, 'else');
    wrapAround(rElse, `:\``, `\`}`);
  } else {
    wrapAround(el, `\``, `\`:\`\`}`);
  }
}

function r_for(el, value, directive) {
  const groups = /(.*)\s+(in)\s+(.*)$/.exec(value);
  if (groups.length === 4) {
    const sel = groups[1].replace('(', '').replace(')', '');
    const query = groups[3];
    wrapAround(el, `\${${query}.map(function(${sel}) { return \``, `\`}.bind(this)).join('')}`);
    rm_d(el, directive);
  }
}

function r_disabled(el, value, directive) {
  // /r\-disable\s*=(.*)\s*"/m
  const dir = 'disabled';
  //rm_d(el, dir);
  el.setAttribute(dir, `\${ ${value} ? true : false}`);
}

function r_class(el, value, directive) {
  if (!el.hasAttribute('class')) el.setAttribute('class', '');
  let cValue = el.getAttribute('class');
  // parse the value to make the condition
  el.setAttribute('class', cValue);
  rm_d(el, directive);
}

// ==================

/**
 * Patch baseTree with newTree
 */

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

// ==== EXPORTS ====

export const htmlToDom = html => new DOMParser().parseFromString(html, 'text/html').body.firstChild;
/**
 * Get a string and turn it into template literal
 * @param {string} tpl
 * @param {object} state
 */
export const parseLit = (tpl, state) => new Function(`return \`${tpl}\``).call(state);

export function parseDom(el, customDirectives = {}) {
  const directives = { ...customDirectives, ...DIRECTIVES_LIST };
  for (const $dir in directives) {
    const directive = $dir.replace('$', '');
    for (const el2 of qall_d(el, directive)) {
      if (has_d(el2, directive)) {
        const value = get_d(el2, directive);
        directives[$dir](el2, value, directive);
      }
    }
  }
  return el;
}

export function tokenizeEvents(selector) {
  /**
   * '@call'
   * Wildcard events, base of the type of the element it will assign the right event name
   * ie: on input element, '@call' will turn into 'r-on-input' and 'r-on-paste'
   * on AHREF, '@call' will turn into 'r-on-click'
   */
  for (const el of selector.querySelectorAll('[\\@call]')) {
    const method = el.getAttribute('@call');
    el.removeAttribute('@call');
    let evnts = ['click'];
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) evnts = ['input', 'paste'];
    else if (el instanceof HTMLInputElement) evnts = ['change'];
    else if (el instanceof HTMLFormElement) evnts = ['submit'];
    else if (el instanceof HTMLAnchorElement) el.setAttribute('href', 'javascript:void(0);');
    let eventsList = (el.getAttribute(ATTR_EVENTS_LIST) || '').split(',').filter(v => v);
    eventsList = eventsList.concat(evnts);
    el.setAttribute(ATTR_EVENTS_LIST, eventsList.join(','));
    for (const e of evnts) {
      el.setAttribute(mkEventName(e), method);
    }
  }
  // Regular event list
  for (const e of EVENTS_LIST) {
    for (const el of selector.querySelectorAll(`[\\@${e}]`)) {
      const eventsList = (el.getAttribute(ATTR_EVENTS_LIST) || '').split(',').filter(v => v);
      eventsList.push(e);
      el.setAttribute(ATTR_EVENTS_LIST, eventsList.join(','));
      el.setAttribute(mkEventName(e), el.getAttribute(`@${e}`));
      el.removeAttribute(`@${e}`);
      if (el instanceof HTMLAnchorElement) el.setAttribute('href', 'javascript:void(0);');
    }
  }
}

export function bindEvents(selector, context) {
  function mapEvents(selector) {
    Array.from(selector.querySelectorAll(`[${ATTR_EVENTS_LIST}]`)).map(el => applyEvents(el));
  }

  function observer(mutations) {
    for (const mutation of mutations) {
      for (const el of mutation.removedNodes) {
        applyEvents(el, true);
      }
      if (mutation.addedNodes.length > 0) {
        mapEvents(mutation.target);
      }
    }
  }

  function handler(method) {
    const e = arguments[1];
    const eType = e.type;
    try {
      e.preventDefault();
      context[method].call(context, e);
    } catch (err) {
      console.error(`Events Handler Error: '${method}()' on '${eType}'`, err);
    }
  }

  function applyEvents(el, remove = false) {
    if (!el || !el.getAttribute) return;
    (el.getAttribute('r-on_events') || '')
      .split(',')
      .filter(v => v)
      .map(e => {
        el[`on${e}`] = remove ? undefined : handler.bind(this, el.getAttribute(mkEventName(e)));
      });
  }

  const options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
  };
  const mutationsObserver = new MutationObserver(observer);
  mutationsObserver.observe(selector, options);
  mapEvents(selector);
  return mutationsObserver;
}

/**
 *
 * @returns {boolean} true for any changes
 */
export function patchDom(newTree, baseTree = null) {
  walkNode(newTree, baseTree);
  //[mergeAttrs(baseTree, newTree), ].some(v => !v);
  return false;
}
