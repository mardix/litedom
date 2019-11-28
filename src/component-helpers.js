/**
 * Helpers for components
 */
import emerj from './emerj.js';
import { tokenizeEvents } from './events.js';
import { parseDirectives } from './directives.js';

import {
  computeState,
  isObjKeyFn,
  parseLit,
  htmlToDom,
  set,
  get,
  toStrLit,
  decodeHTMLStringForDirective,
} from './utils.js';

const RESERVED_KEYS = [
  'data',
  'el',
  'shadowDOM',
  'template',
  'created',
  'updated',
  'removed',
  '$store',
  'prop',
  'tagName',
];

/**
 * Filter all methods from the initial object
 * @param {object} obj
 * @returns {object}
 */
export const filterMethods = obj =>
  Object.keys(obj)
    .filter(k => !RESERVED_KEYS.includes(k))
    .filter(k => !k.startsWith('$'))
    .filter(k => isObjKeyFn(obj, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: obj[cK] }), {});

/**
 * Filter initial state
 * @param {Object} obj
 * @return {object} initial state
 */
export const filterInitialState = obj =>
  Object.keys(obj)
    .filter(k => !isObjKeyFn(obj, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: obj[cK] }), {});

/**
 *
 * @param {object} obj
 * @returns {function[]}
 */
export const filterComputedState = obj =>
  Object.keys(obj)
    .filter(k => isObjKeyFn(obj, k))
    .map(k => computeState(k, obj[k]));

/**
 * Filter all global objects with `$` prefix.
 * @param {object} obj
 * @returns {object}
 */
export const filterGlobal$Object = obj =>
  Object.keys(obj)
    .filter(k => k.startsWith('$'))
    .filter(k => !RESERVED_KEYS.includes(k))
    .reduce((pV, cK) => ({ ...pV, [cK]: obj[cK] }), {});

/**
 * @typedef {Object} StateManagementType - The state management definition
 * @property {function} getState - a function that returns the current state
 * @property {function} subscribe - function to subscribe that returns a function
 *
 * Connect to an external store to share state
 * @param {StateManagementType} store store Instance, must have getState() and subscribe()
 * @return {function} to create an instance of the store to react on the element
 */
export const storeConnector = store => data => {
  data.$store = store.getState();
  return store.subscribe(x => (data.$store = { ...store.getState() }));
};

/**
 * Bind public methods to the element context
 * @param {object} context
 * @param {object} methods
 * @param {object} contextState
 * @returns {void}
 */
export const bindPublicMethodsToContext = (context, methods, contextState) => {
  Object.keys(methods)
    .filter(k => !k.startsWith('_'))
    .map(k => (context[k] = methods[k].bind(contextState)));
};

/**
 * Receiving a template it
 * @param {string} template
 * @returns {{html: string, render: function }}
 */
export const domConnector = template => {
  const node = htmlToDom(toStrLit(template));
  parseDirectives(node);
  tokenizeEvents(node);
  const html = decodeHTMLStringForDirective(node.innerHTML);
  const lit = parseLit(html);
  return {
    html,
    render: (target, state) => {
      const newNode = htmlToDom(lit(state));
      return !target.isEqualNode(newNode) ? emerj(target, newNode) : false;
    },
  };
};

/**
 * For two-way data binding
 * This is an internal function to be used
 * @param {Event} e
 * @returns {void}
 */
export function __$bindInput(e) {
  /** @type {HTMLInputElement|any} el */
  const el = e.target;
  const key = el.getAttribute('ld--bind');
  if (el.type === 'checkbox') {
    const obj = get(this.data, key) || [];
    set(
      this.data,
      key,
      el.checked ? obj.concat(el.value) : obj.filter(v => v != el.value)
    );
  } else if (el.options && el.multiple) {
    set(
      this.data,
      key,
      [].reduce.call(el, (v, o) => (o.selected ? v.concat(o.value) : v), [])
    );
  } else {
    set(this.data, key, el.value);
  }
}
