/** reLift-HTML */
// @ts-check

import emerj from './emerj.js';
import { tokenizeEvents, bindEvents } from './events.js';
import { parseDirectives } from './directives.js';
import {
  computeState,
  isFn,
  parseLit,
  htmlToDom,
  getAttrs,
  objectOnChange,
  set,
  get,
  toStrLit,
  decodeHTMLStringForDirective,
} from './utils.js';

const RESERVED_KEYS = [
  'data',
  'el',
  'isShadow',
  'template',
  'created',
  'updated',
  'removed',
  '$store',
  'props',
  'prop',
  'tagName',
];

/**
 * Filter all methods from the initial object
 * @param {object} obj
 * @returns {object}
 */
const filterMethods = obj =>
  Object.keys(obj)
    .filter(k => !RESERVED_KEYS.includes(k))
    .filter(k => isFn(obj, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: obj[cK] }), {});

/**
 * Filter initial state
 * @param {Object} obj
 * @return {object} initial state
 */
const filterInitialState = obj =>
  Object.keys(obj)
    .filter(k => !isFn(obj, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: obj[cK] }), {});

/**
 *
 * @param {object} obj
 * @returns {function[]}
 */
const filterComputedState = obj =>
  Object.keys(obj)
    .filter(k => isFn(obj, k))
    .map(k => computeState(k, obj[k]));

/**
 * @typedef {Object} StateManagementType - The state management definition
 * @property {function} getState - a function that returns the current state
 * @property {function} subscribe - function to subscribe that returns a function
 *
 * Connect to an external store to share state
 * @param {StateManagementType} store store Instance, must have getState() and subscribe()
 * @return {function} to create an instance of the store to react on the element
 */
const storeConnector = store => data => {
  data.$store = store.getState();
  return store.subscribe(x => (data.$store = { ...store.getState() }));
};

/**
 * Receiving a template it
 * @param {string} template
 * @returns {{html: string, render: function }}
 */
const domConnector = template => {
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
function __$bindInput(e) {
  /** @type {HTMLElement} el */
  const el = e.target;
  const key = el.getAttribute('r-data-key');
  if (el.type === 'checkbox') {
    const obj = get(this.data, key) || [];
    set(this.data, key, el.checked ? obj.concat(el.value) : obj.filter(v => v != el.value));
  } else if (el.options && el.multiple) {
    set(this.data, key, [].reduce.call(el, (v, o) => (o.selected ? v.concat(o.value) : v), []));
  } else {
    set(this.data, key, el.value);
  }
}

export default function Component(options = {}) {
  const opt = {
    /** @type {boolean} if false Web Component will be custom element, else shadow dom*/
    isShadow: false,
    /** @type {string} the element tag name */
    tagName: null,
    /** @type {object} local state data */
    data: {},
    /** @type {string} */
    template: null,
    /** @type {{getState: function, subscribe: function }} for global store/state manager */
    $store: { getState: () => {}, subscribe: () => () => {} },
    /** @type {function} lifecycle */
    created() {},
    /** @type {function} lifecycle */
    updated() {},
    /** @type {function} lifecycle */
    removed() {},
    /** @type {any} */
    ...options,
  };

  const store = storeConnector(opt.$store);
  const dom = domConnector(opt.template);
  const methods = filterMethods(opt);
  const initialState = filterInitialState(opt.data);
  const computedState = filterComputedState(opt.data);

  /** @type {function} update the computed states */
  const updateComputedState = state => computedState.forEach(s => s(state));

  /**
   * Define and Register the WebComponent
   */
  window.customElements.define(
    opt.tagName.toLowerCase(),
    class extends HTMLElement {
      constructor() {
        super();
        // with Shadow dom or leave as CUSTOM ELEMENT
        /** @type {HTMLElement|ShadowRoot} */
        this.$root = opt.isShadow ? this.attachShadow({ mode: 'open' }) : this;
      }

      /**
       * When element is added
       * @returns {void}
       */
      connectedCallback() {
        this.state = { ...this.state, ...initialState, prop: getAttrs(this) };
        const data = objectOnChange(this.state, () => {
          updateComputedState(this.state);
          if (dom.render(this.$root, this.state)) {
            opt.updated.call(this.context);
          }
        });

        this.disconnectStore = store(data);
        this.$root.innerHTML = dom.html;

        // context contains methods and properties to work on the element
        this.context = { ...methods, data, el: this.$root, prop: this.state.prop, $store: opt.$store };

        // Bind events
        bindEvents(this.$root, { ...this.context, __$bindInput });

        // Initial setup + first rendering
        updateComputedState(this.state);
        dom.render(this.$root, this.state);
        opt.created.call(this.context);
      }

      /**
       * When element is removed
       * @returns {void}
       */
      disconnectedCallback() {
        opt.removed.call(this.context);
        this.disconnectStore();
      }
    }
  );
}
