// Litedom
// @ts-check

/**
 * Turn camelCase to kebab-case
 * kebabCase('userId') => "user-id"
 * kebabCase('waitAMoment') => "wait-a-moment"
 * kebabCase('TurboPascal') => "turbo-pascal"
 * @param {string} s
 * @returns {string}
 */
export const kebabCase = s => s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

/**
 * Convert string to camelCase
 * user-id => userId
 * wait-a-moment => waitAMoment
 * wait a moment => waitAMoment
 * wait_a_moment => waitAMoment
 * @param {string} s
 * @returns {string}
 */
export const camelCase = s => s.replace(/[-_\s+]([a-z])/g, g => g[1].toUpperCase());

/**
 * Turn an object into a stylemap to be used in inline css
 * {
 *  "font-size": "12px",
 *  backgroundColor: 'purple',
 *  margin: '0 0 !important'
 * } => font-size: 12px; background-color: purple; margin: 0 0 !important
 * @param {object} o
 * @returns {string}
 */
export const styleMap = o =>
  Object.keys(o)
    .map(k => `${kebabCase(k)}: ${o[k]};`)
    .join(' ');

/**
 * Set a value in an object via dot notation
 * @param {object} obj
 * @param {string} path
 * @param {any} value
 * @returns {void}
 */
export const set = (obj, path, value) => {
  let ref = obj;
  const keys = path.split('.');
  while (keys.length) {
    const key = keys.shift();
    ref[key] = keys.length ? (ref[key] ? ref[key] : {}) : value;
    ref = ref[key];
  }
};
/**
 * Get a value in an object via dot notation
 * @param {object} obj
 * @param {string} path
 * @returns {any}
 */
export const get = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

/**
 * Check if an object is a function
 * @param {object} o
 * @returns {boolean}
 */
export const isFn = o => typeof o === 'function';

/**
 * isObjKeyFn isFunction
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
export const isObjKeyFn = (obj, key) => obj && isFn(obj[key]);

/**
 * check if an object is HTMLElement
 * @param {any} obj
 * @returns
 */
export const isElement = obj => obj instanceof HTMLElement;

/**
 * Return a HTMLElement
 * @param {any} el
 * @returns {HTMLElement}
 */
export const selector = el => (typeof el === 'string' ? document.querySelector(el) : el);

const windowStyle = el => window.getComputedStyle(el);

/**
 * Check if an element has visibility:hidden
 * @param {HTMLElement} el
 * @returns {boolean}
 */
export const isVisibilityHidden = el => windowStyle(el).visibility === 'hidden';

/**
 * Check if an element has display:none
 * @param {HTMLElement} el
 * @returns {boolean}
 */
export const isDisplayNone = el => windowStyle(el).display === 'none';

/**
 * Turn an HTML string into HTMLElement
 * @param {string} html
 * @returns {HTMLElement}
 */
export const htmlToDom = html => new DOMParser().parseFromString(html, 'text/html').body; //.firstChild;

/**
 * Get a string and turn it into template literal
 * @param {string} tpl
 * @returns {function}
 *
 * x = parseLit(string)
 * x(state) // to update
 */
export const parseLit = tpl => state => new Function(`return \`${tpl}\``).call(state);

/**
 * Convert a string that contains {...} to ${...}
 * @param {string} str
 * @returns {string}
 */
export const toStrLit = str => str.replace(/\$?\{([^\;\{]+)\}/g, (_, expression) => `\${${expression}}`);

/**
 * Create a function that receive data to create computed state
 * @param {string} key
 * @param {function} fn
 * myCs = computeState(('fullName', (state) => return state.name) => )
 * myCs({name: 'Mardix'})
 * myCs.fullName -> Mardix
 */
export const computeState = (key, fn) => state => (state[key] = fn({ ...state }));

/**
 *
 * @param {function} callback
 * @param {number} time
 * @param {any} interval
 * @returns {any}
 */
export const debounce = (callback, time = 250, interval) => (...args) =>
  clearTimeout(interval, (interval = setTimeout(callback, time, ...args)));

/**
 * @type {array}
 */
const decodeHTMLList = [
  ['&lt;', '<'],
  ['&gt;', '>'],
  ['&amp;', '&'],
];

/**
 * To decode html string for directive
 * change &lt; + &gt;  to < + > respectively
 * @param {string} str
 * @returns {string}
 */
export const decodeHTMLStringForDirective = str =>
  decodeHTMLList.reduce((pV, cK) => pV.replace(new RegExp(cK[0], 'g'), cK[1]), str);

/**
 * Returns all attributes into an object
 * @param {HTMLElement} el
 * @param {boolean} camelCaseIt
 * @returns {object}
 */
export const getAttrs = (el, camelCaseIt = false) =>
  Object.freeze(
    Array.from(el.attributes)
      .map(e => ({ [camelCaseIt ? camelCase(e.name) : e.name]: e.value }))
      .reduce((pV, cK) => ({ ...pV, ...cK }), {})
  );

const proxyTarget = '#';
const isPrimitive = value => value === null || !['function', 'object'].includes(typeof value);

/**
 * Generate random chars. Mainly to use in webcomponent without name
 * @param {number} l the length
 * @return {string}
 */
export const randomChars = (l = 7) =>
  Math.random()
    .toString(36)
    .substr(2, l)
    .toLowerCase();

/**
 * objectOnChange
 * Observe an object change, and run onChange()
 * @param {*} object
 * @param {*} onChange
 */
export const objectOnChange = (object, onChange) => {
  let inApply = false;
  let changed = false;
  const propCache = new WeakMap();

  const handleChange = () => {
    if (!inApply) onChange();
    else if (!changed) changed = true;
  };

  const getOwnPropertyDescriptor = (target, property) => {
    let props = propCache.get(target);
    if (props) return props;

    props = new Map();
    propCache.set(target, props);

    let prop = props.get(property);
    if (!prop) {
      prop = Reflect.getOwnPropertyDescriptor(target, property);
      props.set(property, prop);
    }
    return prop;
  };

  const handler = {
    get(target, property, receiver) {
      if (property === proxyTarget) return target;
      const value = Reflect.get(target, property, receiver);
      if (isPrimitive(value) || property === 'constructor') return value;

      const descriptor = getOwnPropertyDescriptor(target, property);
      if (descriptor && !descriptor.configurable) {
        if (descriptor.set && !descriptor.get) return undefined;
        if (descriptor.writable === false) return value;
      }
      return new Proxy(value, handler);
    },

    set(target, property, value, receiver) {
      if (value && value[proxyTarget] !== undefined) value = value[proxyTarget];
      const previous = Reflect.get(target, property, receiver);
      const result = Reflect.set(target, property, value);
      if (previous !== value) handleChange();
      return result;
    },

    defineProperty(target, property, descriptor) {
      const result = Reflect.defineProperty(target, property, descriptor);
      handleChange();
      return result;
    },

    deleteProperty(target, property) {
      const result = Reflect.deleteProperty(target, property);
      handleChange();
      return result;
    },

    apply(target, thisArg, argumentsList) {
      if (!inApply) {
        inApply = true;
        const result = Reflect.apply(target, thisArg, argumentsList);
        if (changed) onChange();
        inApply = changed = false;
        return result;
      }
      return Reflect.apply(target, thisArg, argumentsList);
    },
  };
  const proxy = new Proxy(object, handler);
  return proxy;
};

/**
 * Deep copy object
 * @param {object} obj
 * @returns {object}
 */
function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  var temp = obj.constructor();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) temp[key] = immu(obj[key]);
  }
  return temp;
}

/**
 * Deep freezes object
 * @param {object} obj
 * @returns {object}
 */
function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  Object.keys(obj).forEach(function(name) {
    const prop = obj[name];
    if (prop !== null && typeof prop === 'object') deepFreeze(prop);
  });
  return Object.freeze(obj);
}

/**
 * Creates a deep immutable object
 * @param {object} obj
 * @returns {object}
 */
export const immu = obj => deepFreeze(deepCopy(obj));
