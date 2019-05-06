/**
 * reLift-HTML
 */

import emerj from './emerj.js';
import { tokenizeEvents, bindEvents } from './events.js';
import { parseDirectives } from './directives.js';
import { computeState, isFn, parseLit, htmlToDom, getAttrs, objectOnChange, randomChars, selector, set, get} from './utils.js';

const RESERVED_KEYS = [
  'data', 
  'el', 
  'templateString', 
  'template',
  'created', 
  'updated', 
  'removed',
  '$store', 
  '$attrs', 
  'tagName',
  'type'
];

const error = (msg) => new Error(`reLift-HTML Error: ${msg}`);

/**
 * Connect to an external store to share state
 * @param {store} store store Instance, must have getState() and subscribe()
 * @return {function} to create an instance of the store to react on the element
 */
const storeConnector = (store) => {
  return (state) => {
    state.$store = store.getState();
    return store.subscribe(x => state.$store = store.getState());
  }
}

/**
 * Receiving a template it 
 * @param {*} template 
 * @returns {object[html:string, render:function]}
 */
const domConnector = (template) => {
    const node = htmlToDom(template);
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

function reLiftHTML(options={}) {
  const opt = {
    /** @type {[CE|SD]} The type of element to create */
    type: 'CE',
    /** @type {string} the element tag name */
    tagName: null,
    /** @type {object} local state data */
    data: {}, 
    /** @type {string} */
    templateString: null, 
    /** @type {getState, subscribe} for global store/state manager */
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
  const dom = domConnector(opt.templateString);

  /** Extract all methods to be used in the context */
  const methods = Object.keys(opt)
    .filter(k => !RESERVED_KEYS.includes(k))
    .filter(k => isFn(opt, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: opt[cK] }), {});
    
  /** initialState */
  const initialState = Object.keys(opt.data)
    .filter(k => !isFn(opt.data, k))
    .reduce((pV, cK) => ({ ...pV, [cK]: opt.data[cK] }), {});

  /** computedState */
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
      this.$root = opt.type === 'SD' ? this.attachShadow({mode: 'open'}) : this;
    }

    /**
     * When element is added
     */
    connectedCallback(){
      this.state = {...this.state, ...initialState, $attr: getAttrs(this)};
      const data = objectOnChange(this.state, () => {
        updateComputedState(this.state);
        if (dom.render(this.$root, this.state)) {
          opt.updated.call(this.context);
        }
      });
      
      this.disconnectStore = store(data);
      this.$root.innerHTML = dom.html;

      // context contains methods and properties to work on the element
      this.context = { ...methods, $attr: this.state.$attr, el: this.$root, data}


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


/**
 * reLiftHTML default function initializer
 * @param {object} options 
 */
export default function (options = {}) {
  const opt = {
    el: null,
    tagName: null, 
    type: null,
    templateString: null,
    ...options
  };
  let el = null;

  /**
   * Create the template string
   */
  if (! opt.templateString) {
    if (opt.template) {
      el = selector(opt.template);
      opt.type = opt.type || 'SD';
      opt.tagName = opt.tagName || el.getAttribute('tag');
      opt.templateString = el.innerHTML;
    } else if (opt.el) {
      el = selector(opt.el);
      opt.type = opt.type || 'CE';
      opt.tagName = opt.tagName || `rel-${el.id}-${randomChars()}`;
      opt.templateString = el.outerHTML;    
    }     
  }

  if (opt.el && opt.type === 'CE') {
    el = selector(opt.el);
    opt.tagName = opt.tagName || `rel-${el.id}-${randomChars()}`;
    el.parentNode.replaceChild(document.createElement(opt.tagName), el);  
  } 

  if (!opt.templateString) throw error(`missing 'templateString' option or 'el|template' are not valid elements`);
  if (!opt.tagName) throw error(`missing 'tagName'`);
  reLiftHTML(opt);
}
