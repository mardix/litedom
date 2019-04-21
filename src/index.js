/**
 * reLift
 * A view library,
 * Template literal + State Management
 */
import { onChange, memoize, isFn } from './utils.js';
import { tokenizeEvents, parseDom, parseLit, bindEvents, htmlToDom, patchDom } from './dom-utils.js';
import reLiftState from './relift-state.js';
export { reLiftState };

/**
 *
 * @param {*} el
 * @param {*} context
 * @param {*} template
 */
function dom(el, context = {}, template = null) {
  if (template) el.innerHTML = template;
  const node = el.cloneNode(true);
  tokenizeEvents(node);
  parseDom(node);
  el.innerHTML = node.innerHTML;
  bindEvents(el, context);
  const tpl = node.outerHTML;
  return state => {
    const newHtml = parseLit(tpl, state);
    const newNode = htmlToDom(newHtml);
    return patchDom(newNode, el);
  };
}

export default function reLiftHTML(opt = {}) {
  const reservedKeys = ['data', 'el', 'template', 'store', 'mounted', 'updated'];
  const conf = {
    data: {} /** @type {object} local state data */,
    el: document.body /** @type {HTMLElement} The dom element to bind */,
    template: null /** @type {string} */,
    store: {} /** @type {reStated} For global state. Must have subscribe() and getState() */,
    mounted: () => {} /** @type {function} triggered on initialization */,
    updated: () => {} /** @type {function} triggered on update */,
    ...opt,
  };

  const el = typeof conf.el === 'string' ? document.querySelector(conf.el) : conf.el;
  if (!(el instanceof HTMLElement))
    throw new Error(`reLiftHTML setup error: 'el' is not a DOM Element. >> el: ${conf.el}`);

  const template = conf.template ? conf.template : el.innerHTML;

  /** Extract all methods to be used in the context */
  const methods = Object.keys(conf)
    .filter(k => !reservedKeys.includes(k))
    .filter(k => !k.startsWith('$'))
    .filter(k => isFn(conf, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: conf[cK] }), {});

  /** initialState */
  const initialState = Object.keys(conf.data)
    .filter(k => !isFn(conf.data, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: conf.data[cK] }), {});

  /** computedState */
  const computedState = Object.keys(conf.data)
    .filter(k => isFn(conf.data, k))
    .map(key => memoize(key, conf.data[key]));

  function updateComputedState(state) {
    computedState.forEach(s => s(state));
  }

  /** @type {object} the application state */
  let state = { $store: {}, ...initialState };

  /** @type {reStated} */
  let store = undefined;
  if (Object.keys(conf.store).length) {
    store = conf.store;
    state.$store = conf.store.$getState();
    conf.store.$subscribe(data => {
      state.$store = conf.store.$getState();
      updateComputedState(state);
      render();
    });
  }

  /** data proxy */
  const data = onChange(state, () => {
    updateComputedState(state);
    render();
  });

  /** @type {object} context (events action methods) to be used in the  template */
  const context = { ...methods, el, data, render, store };

  /** To re-render and run updated() */
  function render() {
    if (updateDom(state)) {
      conf.updated.call(context); // lifecycle: udpated
    }
  }

  /** Bind the dom and attach the method context */
  const updateDom = dom(el, context, template);

  /** DOM Ready */
  document.addEventListener('DOMContentLoaded', () => {
    updateComputedState(state);
    updateDom(state); // initial rendering
    conf.mounted.call(context); // lifecycle: created
    el.style.display = 'block'; // if the element is hidden, let's show it now
  });
}
