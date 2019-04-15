// reBindDom

import { parseDom, patchDom } from './dom-utils.js';
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

export default function bind(el, klass = {}) {
  const node = el.cloneNode(true);
  tokenizeEvents(node);
  parseDom(node);
  el.innerHTML = node.innerHTML;
  bindEvents(el, klass);
  const tpl = node.innerHTML;
  return state => {
    const newHtml = parseLit(tpl, state);
    const newNode = new DOMParser().parseFromString(newHtml, 'text/html').body;
    patchDom(newNode, el);
  };
}

/**
 * Get a string an turn it into template literal
 * @param {string} tpl
 * @param {object} state
 */
function parseLit(tpl, state) {
  return new Function(`return \`${tpl}\``).call(state);
}

const mkEventName = e => `r-on-${e}`;

function tokenizeEvents(selector) {
  for (const e of EVENTS_LIST) {
    for (const el of selector.querySelectorAll(`[\\@${e}]`)) {
      const eventsList = (el.getAttribute('r-on_events') || '').split(',').filter(v => v);
      eventsList.push(e);
      el.setAttribute('r-on_events', eventsList.join(','));
      el.setAttribute(mkEventName(e), el.getAttribute(`@${e}`));
      el.removeAttribute(`@${e}`);
      if (el instanceof HTMLAnchorElement) el.setAttribute('href', 'javascript:void(0);');
    }
  }
}

function bindEvents(selector, context) {
  function mapEvents(selector) {
    Array.from(selector.querySelectorAll(`[r-on_events]`)).map(el => applyEvents(el));
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
