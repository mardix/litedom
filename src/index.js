/**
 * reLift-HTML
 */

import emerj from './emerj.js';
import onChange from './onchange.js';
import { tokenizeEvents, bindEvents } from './events.js';
import { parseDirectives } from './directives.js';
import { computeState, isFn, parseLit, htmlToDom, debounce } from './utils.js';

/**
 *
 * @param {HTMLElement} el
 * @param {string|null} template
 * @param {object} context
 */
function dom(el, template = null, context = {}) {
  if (template) el.innerHTML = template;
  const node = el.cloneNode(true);
  tokenizeEvents(node);
  parseDirectives(node);
  el.innerHTML = node.innerHTML;
  bindEvents(el, context);
  const lit = parseLit(node.outerHTML);
  return state => {
    const newNode = htmlToDom(lit(state));
    return emerj(el, newNode);
  };
} 

export default function reLiftHTML(opt = {}) {
  const reservedKeys = ['data', 'el', 'template', 'created', 'updated', '$store'];
  const conf = {
    el: null /** @type {HTMLElement} The dom element to bind */,
    data: {} /** @type {object} local state data */,
    template: null /** @type {string} */,
    created: () => {} /** @type {function} triggered on initialization */,
    updated: () => {} /** @type {function} triggered on update */,
    $store: {} /** @type {getState, subscribe} for global store/state manager */,
    ...opt,
  };

  const el = typeof conf.el === 'string' ? document.querySelector(conf.el) : conf.el;
  if (!(el instanceof HTMLElement))
    throw new Error(`reLift-HTML setup error: 'el' is not a DOM Element. >> el: ${conf.el}`);

  const template = conf.template ? conf.template : el.innerHTML;

  /** Extract all methods to be used in the context */
  const methods = Object.keys(conf)
    .filter(k => !reservedKeys.includes(k))
    .filter(k => isFn(conf, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: conf[cK] }), {});

  /** initialState */
  const initialState = Object.keys(conf.data)
    .filter(k => !isFn(conf.data, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: conf.data[cK] }), {});

  /** computedState */
  const computedState = Object.keys(conf.data)
    .filter(k => isFn(conf.data, k))
    .map(k => computeState(k, conf.data[k]));

  const updateComputedState = state => computedState.forEach(s => s(state));

  /** @type {object} the application state */
  let state = { $store: {}, ...initialState };

  /**
   * Shared state
   * @type {getState(), subscribe()}
   */
  let store = undefined;
  if (Object.keys(conf.$store).length) {
    store = conf.$store;
    state.$store = conf.$store.getState();
    conf.$store.subscribe(x => {
      state.$store = conf.$store.getState();
      updateComputedState(state);
      render();
    });
  }

  /** To re-render and run updated() */
  // Exploring whether to debounce render or not
  //const render = debounce((updated=true) => updateDom({...state}), 100)
  function render(runUpdated=true) {
    if (updateDom({...state}) && runUpdated) {
      conf.updated.call(context); // lifecycle: udpated
    }
  }

  /** data proxy */
  const data = onChange(state, () => {
    updateComputedState(state);
    render();
  });

  /** @type {object} context (events action methods) to be used in the  template */
  const context = { ...methods, el, data, render, store };


  /** Bind the dom and attach the method context */
  const updateDom = dom(el, template, context);

  /** DOM Ready */
  document.addEventListener('DOMContentLoaded', () => {
    updateComputedState(state); // Make sure computed state are available
    render(false); // initial rendering
    conf.created.call(context); // lifecycle: created
    el.style.display = 'block'; // if the element is hidden, let's show it now
  });
}
