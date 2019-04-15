/**
 * reLift
 * A view library,
 * Template literal + State Manager
 */
import bindDom from './dom.js';
import reStated from './restated.js';

export { reStated };

export function reLift(opt = {}) {
  const conf = {
    /** @type {Element} The dom element to bind */
    el: document.body,

    /** @type {object} For global state. Must have subscribe() and getState() */
    store: {},

    /** @type {object} local state data */
    data: {},

    /** @type {object} object of function */
    methods: {},

    /** @type {function} triggered on initialization */
    created: () => {},

    /** @type {function} triggered on mount */
    mounted: () => {},

    /** @type {function} triggered on update */
    updated: () => {},

    ...opt,
  };

  const store = conf.store;

  /** @type {object} the application state */
  let state = { $store: {}, ...conf.data };
  if (conf.store) {
    state.$store = conf.store.$getState();
    conf.store.$subscribe(data => {
      state.$store = conf.store.$getState();
      render();
    });
  }

  /** @type {object} application scope to be accessed inside of callbacks via this.data, this.store */
  const self = {
    data: new Proxy(state, {
      get: (target, prop) => target[prop],
      set: (target, prop, value) => {
        target[prop] = value;
        render();
        return true;
      },
    }),
    render,
    $store: conf.store, // Use via this.$store and in the html ${this.$store}
    $emit: eventBusPub,
    $on: eventBusSub,
  };

  // Set scope in the actions, so the can be accessed via diff
  conf.methods = { ...conf.methods, ...self };

  // Bind the dom and attach the method context
  const updateDom = bindDom(conf.el, conf.methods);

  function render() {
    const updated = updateDom(state);
    // lifecycle: udpated
    if (updated) {
      conf.updated.call(self);
    }
  }

  // lifecycle: created
  conf.created.call(self);

  // LoDom is ready
  document.addEventListener('DOMContentLoaded', () => {
    // lifecycle: mounted
    conf.mounted.call(self);

    // initial rendering
    updateDom(state);

    // if the element is hidden, let's show it now
    conf.el.style.display = 'block';
  });
}

/**
 * Event Bus, for simple communication between
 * component without touching the store
 */
const eventBusSubscribers = {};
function eventBusSub(eventType, listener) {
  if (!eventBusSubscribers[eventType]) eventBusSubscribers[eventType] = [];
  eventBusSubscribers[eventType].push(listener);
  return () => eventBusSubscribers[eventType].splice(eventBusSubscribers[eventType].indexOf(listener), 1);
}
function eventBusPub(eventType, arg) {
  if (!eventBusSubscribers[eventType]) return;
  eventBusSubscribers[eventType].forEach(s => s(arg));
}
