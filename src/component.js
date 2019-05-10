/**
 * reLift-HTML
 */

// @ts-check


import emerj from './emerj.js';
import { tokenizeEvents, bindEvents } from './events.js';
import { parseDirectives } from './directives.js';
import { computeState, isFn, parseLit, htmlToDom, getAttrs, objectOnChange, set, get, toStrLit} from './utils.js';

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
  'tagName'
];


/**
 * Connect to an external store to share state
 * @param {store} store store Instance, must have getState() and subscribe()
 * @return {function} to create an instance of the store to react on the element
 */
const storeConnector = (store) => {
  return (data) => {
    data.$store = store.getState();
    return store.subscribe(x => data.$store = {...store.getState()});
  }
}

/**
 * Receiving a template it 
 * @param {string} template 
 * @returns {{html: string, render: function }}
 */
const domConnector = (template) => {
    const node = htmlToDom(toStrLit(template));
    parseDirectives(node);
    tokenizeEvents(node);
    const html = node.innerHTML;
    const lit = parseLit(html);
    return {
      html, 
      render: (target, state) => {
        const newNode = htmlToDom(lit(state));
        return (!target.isEqualNode(newNode)) ? emerj(target, newNode) : false;
      }
    };
}

/**
 * For two-way data binding
 * This is an internal function to be used 
 * @param {Event} e 
 */
function __$bindInput (e) {
  /** @type {HTMLFormElement} el */
  const el = e.target;
  const key = el.getAttribute('r-data-key');
  if (el.type === 'checkbox') {
    const obj = get(this.data, key) || [];
    set(this.data, key, (el.checked) ? obj.concat(el.value) : obj.filter(v => v != el.value));
  } else if (el.options && el.multiple) {
    set(this.data, key, [].reduce.call(el, (v, o) => (o.selected ? v.concat(o.value) : v), []));
  } else {
    set(this.data, key, el.value);
  }
}

export default function Component(options={}) {
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
    $store: {getState: () => {}, subscribe: () => () => {}}, 
    /** @type {function} lifecycle */
    created(){}, 
    /** @type {function} lifecycle */
    updated(){},
    /** @type {function} lifecycle */
    removed(){},
    /** @type {any} */
    ...options,
  }

  const store = storeConnector(opt.$store);
  const dom = domConnector(opt.template);

  /** @type {object} object all methods to be used in the context */
  const methods = Object.keys(opt)
    .filter(k => !RESERVED_KEYS.includes(k))
    .filter(k => isFn(opt, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: opt[cK] }), {});
    
  /** @type {object} holds object of initial state */
  const initialState = Object.keys(opt.data)
    .filter(k => !isFn(opt.data, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: opt.data[cK] }), {});

  /** @type {function[]} holds array of function */
  const computedState = Object.keys(opt.data)
    .filter(k => isFn(opt.data, k))
    .map(k => computeState(k, opt.data[k]));

  /** @type {function} update the computed states */
  const updateComputedState = state => computedState.forEach(s => s(state));
  
  /**
   * Define and Register the WebComponent
   */
  window.customElements.define(opt.tagName.toLowerCase(), class extends HTMLElement {
    constructor() {
      super();
      // with Shadow dom or leave as CUSTOM ELEMENT
      /** @type {HTMLElement} */
      this.$root = (opt.isShadow ? this.attachShadow({mode: 'open'}) : this);
    }

    /**
     * When element is added
     */
    connectedCallback(){
      this.state = {...this.state, ...initialState, prop: getAttrs(this)};
      const data = objectOnChange(this.state, () => {
        updateComputedState(this.state);
        if (dom.render(this.$root, this.state)) {
          opt.updated.call(this.context);
        }
      });
      
      this.disconnectStore = store(data);
      this.$root.innerHTML = dom.html;

      // context contains methods and properties to work on the element
      this.context = { ...methods, data, el: this.$root, prop: this.state.prop, $store: opt.$store}

      // Bind events
      bindEvents(this.$root, {...this.context, __$bindInput});

      // Initial setup + first rendering
      updateComputedState(this.state);
      dom.render(this.$root, this.state);
      opt.created.call(this.context);
    }

    /**
     * When element is removed
     */
    disconnectedCallback() {
      opt.removed.call(this.context);
      this.disconnectStore();
    }
  })  

}
