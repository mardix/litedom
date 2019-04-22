// reLiftState

import { selectorMemoizer, isFn } from './utils.js';
import onChange from './onchange.js';

/**
 * reLiftState
 * @param {object} initialState
 * @param {object function} mutators
 */
export default function reLiftState(initialState = {}, mutators = {}) {
  const subscribers = [];

  const initState = Object.keys(initialState)
    .filter(v => !isFn(initialState, v))
    .reduce((pV, cV) => ({ ...pV, [cV]: initialState[cV] }), {});

  /** Selectors, computed functions that accept the state as arg. Must return value */
  const selectors = Object.keys(initialState)
    .filter(v => isFn(initialState, v))
    .map(k => selectorMemoizer(k, initialState[k]));

  const actions = Object.keys(mutators)
    .filter(v => isFn(mutators, v))
    .reduce(
      (pV, cV) => ({
        ...pV,
        [cV]: (...args) => {
          mutators[cV].call(this, state, ...args);
          return actions; // to allow chainability
        },
      }),
      {}
    );

  let state = onChange(initState, () => {
    selectors.forEach(memoizedSel => memoizedSel(state));
    subscribers.forEach(s => s(state.___target___));
  });

  /** Initialize selectors */
  selectors.forEach(memoizedSel => memoizedSel(state));

  return {
    ...actions,
    $getState: () => state.___target___,
    $subscribe(listener) {
      subscribers.push(listener);
      return () => subscribers.splice(subscribers.indexOf(listener), 1);
    },
  };
}
