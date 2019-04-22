/**
 * isFn isFunction
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
export const isFn = (obj, key) => obj && typeof obj[key] === 'function';

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
 * Compare two state
 * @param {object} s1
 * @param {object} s2
 * @returns {boolean}
 */
const compState = (s1, s2) => JSON.stringify(s1) === JSON.stringify(s2);

/**
 * selectorMemoizer a Proxy selector
 * @param {string} key
 * @param {function} fn
 * @return {function onChangeProxy}
 * ie: myMem = selectorMemoizer(k, (state) => return value)
 * myMem(state)
 */
export const selectorMemoizer = (key, fn) => {
  let prevState = null;
  let prevValue = undefined;
  let value = undefined;
  return state => {
    const exportedState = state.___target___ ? { ...state.___target___ } : { ...state };
    if (!prevState || !compState(prevState, exportedState)) {
      prevState = exportedState;
      value = fn(prevState);
    }
    if (prevValue !== value) {
      prevValue = value;
      state[key] = value;
    }
  };
};
