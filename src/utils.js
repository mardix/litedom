// reLift-HTML

/**
 * isFn isFunction
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
export const isFn = (obj, key) => obj && typeof obj[key] === 'function';

/**
 * Turn an HTML string into HTMLElement
 * @param {string} html 
 * @return {HTMLElement}
 */
export const htmlToDom = html => new DOMParser().parseFromString(html, 'text/html').body.firstChild;

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
 * Create a function that receive data to create computed state
 * @param {string} key 
 * @param {function} fn 
 * myCs = computeState(('fullName', (state) => return state.name) => )
 * myCs({name: 'Mardix'})
 * myCs.fullName -> Mardix
 */
export const computeState = (key, fn) => state => state[key] = fn({...state})

