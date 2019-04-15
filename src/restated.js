/**
 * reStated is a simple state manager.
 *
 *
 * Features:
 * - state management
 * - mutators
 * - selectors
 * - subscription
 *
 * @param {object} mutators
 *
 * Usage
 *
 * const store = reStated({
 *
 *  //-- State
 *  count: 0,
 *  key: 'something',
 *
 *  //-- Selectors
 *  // Selectors are not mutable, must return value
 *  // the value will be assigned to the key name
 *  $selectors: {
 *      newCount: (state) => state.count,
 *  },
 *
 *  //-- Action Mutators
 *  // functions added to the store state become mutator
 *  // only mutators can mutate the state
 *  // can be async
 *  increment: state => state.count+1,
 *  decrement: state => state.count-1,
 *  setName: (state, firstName) => { state.firstName = firstName; }
 *  fetch: async (state) => state.data = await.fetch(...)
 *  ...
 * })
 *
 * //-- run action mutators
 * store.increment();
 * store.setName('Joe')
 *
 * // actions can be chained
 * store.increment().setName('Joe')
 *
 * //-- Access state
 * store.$getState()
 *
 * //-- Subscription
 * store.$subscribe(state => console.log(state))
 *
 * //-- Unsubscribe
 * const s = store.$subscribe(state => console.log(state))
 * s(); // unsubscribe
 *
 * // Reserved keys
 * any object key with '$' prefix is reserved and not be
 * part of mutators.
 * ie:
 *  - $selectors: {object}
 *
 */

/**
 * Compare two state
 * @param {object} s1
 * @param {object} s2
 * @returns {boolean}
 */
const compState = (s1, s2) => JSON.stringify(s1) === JSON.stringify(s2);

/**
 * export the state to POJO
 * @param {Proxy} state
 * @return {object}
 */
const exportState = state => state.___obj___;

/**
 * isFn isFunction
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
const isFn = (obj, key) => obj && typeof obj[key] === 'function';
/**
 * Object observer for changes
 * @param {object} object
 * @param {function} onChange
 */
const objectOnChange = (object, onChange) => {
  const reservedKeys = ['sort', 'reverse', 'splice', 'pop', 'shift', 'push'];
  let blocked = false;
  const handler = {
    get(target, property, receiver) {
      try {
        if (property === '___obj___') return { ...target };
        return new Proxy(target[property], handler);
      } catch (err) {
        return Reflect.get(target, property, receiver);
      }
    },
    defineProperty(target, property, descriptor) {
      if (property === '___obj___') {
        return false;
      }
      const result = Reflect.defineProperty(target, property, descriptor);
      if (!blocked) {
        onChange();
      }
      return result;
    },
    apply(target, thisArg, argsList) {
      if (reservedKeys.includes(target.name)) {
        blocked = true;
        const result = Reflect.apply(target, thisArg, argsList);
        onChange();
        blocked = false;
        return result;
      }
    },
  };
  return new Proxy(object, handler);
};

/**
 * Memoize a selector
 * @param {reStated} state
 * @param {string} key
 * @param {function} fn
 */
const memoizeSelector = (key, fn) => {
  let prevState = null;
  let prevValue = undefined;
  let value = undefined;
  return state => {
    const exportedState = exportState(state);
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

/**
 * reStated
 * @param {Object} mutators
 */
export default function reStated(mutators = {}) {
  const subscribers = [];
  const mutatorsKeys = Object.keys(mutators);

  const initState = mutatorsKeys
    .filter(v => !isFn(mutators, v))
    .filter(v => !v.startsWith('$'))
    .reduce((pV, cV) => ({ ...pV, [cV]: mutators[cV] }), {});

  const actions = mutatorsKeys
    .filter(v => isFn(mutators, v))
    .reduce(
      (pV, cV) => ({
        ...pV,
        [cV]: (...args) => {
          mutators[cV].call(this, state, ...args);
          return actions;
        },
      }),
      {}
    );

  const selectors = Object.keys(mutators.$selectors || {})
    .filter(v => isFn(mutators.$selectors, v))
    .map(key => memoizeSelector(key, mutators.$selectors[key]));

  let state = objectOnChange(initState, () => {
    selectors.forEach(s => s(state));
    subscribers.forEach(s => s(exportState(state)));
  });

  return {
    ...actions,
    $getState: () => exportState(state),
    $subscribe(listener) {
      subscribers.push(listener);
      return () => subscribers.splice(subscribers.indexOf(listener), 1);
    },
  };
}
