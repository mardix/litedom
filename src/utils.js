// reLift-HTML
// @ts-check

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
 * isFn isFunction
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
export const isFn = (obj, key) => obj && typeof obj[key] === 'function';

/**
 * Return a HTMLElement
 * @param {any} el
 * @returns {HTMLElement}
 */
export const selector = el => (typeof el === 'string' ? document.querySelector(el) : el);

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
 * To decode html string for directive
 * change &lt; + &gt;  to < + > respectively
 * @param {string} str
 * @returns {string}
 */
export const decodeHTMLStringForDirective = str => str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
/**
 * Returns all attributes into an object
 * @param {HTMLElement} el
 * @returns {object}
 */
export const getAttrs = el =>
  Object.freeze(
    Array.from(el.attributes)
      .map(e => ({ [e.name]: e.value }))
      .reduce((pV, cK) => ({ ...pV, ...cK }), {})
  );

const proxyTarget = '___target___';
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
