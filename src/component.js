/** Litedom */
// @ts-check

import { bindEvents } from './events.js';
import { getAttrs, objectOnChange, styleMap, immu } from './utils.js';
import {
  filterMethods,
  filterComputedState,
  filterInitialState,
  filterGlobal$Object,
  storeConnector,
  bindPublicMethodsToContext,
  domConnector,
  __$bindInput,
} from './component-helpers.js';

/**
 * Private context included data and functions
 * to exist only in the render function
 */
const renderContext = {
  __$styleMap: styleMap,
};

export default function Component(options = {}) {
  const opt = {
    /**
     * @type {boolean}
     * if false Web Component will be custom element, else shadow dom*/
    shadowDOM: false,
    /**
     * @type {string}
     * the element tag name */
    tagName: null,
    /**
     * @type {object}
     * local state data */
    data: {},
    /**
     * @type {string}
     * The template*/
    template: null,
    /**
     * @type {{getState: function, subscribe: function }}
     * for global store/state manager */
    $store: { getState: () => undefined, subscribe: () => () => {} },
    /**
     * @type {function}
     * lifecycle */
    created() {},
    /**
     * @type {function}
     * lifecycle */
    updated() {},
    /**
     * @type {function}
     * lifecycle */
    removed() {},
    /**
     * @type {any}
     * */
    ...options,
  };

  const store = storeConnector(opt.$store);
  const dom = domConnector(opt.template);
  const methods = filterMethods(opt);
  const initialState = filterInitialState(opt.data);
  const computedState = filterComputedState(opt.data);
  const gobal$Object = filterGlobal$Object(opt);

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
        /**
         * @type {Element|ShadowRoot}
         * use a custom element or shadow dom */
        this.$root = opt.shadowDOM ? this.attachShadow({ mode: 'open' }) : this;
      }

      /**
       * When element is added
       * @returns {void}
       */
      connectedCallback() {
        this.$eventHooks = {
          updated: [],
          removed: [],
        };

        this._state = {
          ...this._state,
          ...initialState,
          prop: getAttrs(this, true),
        };

        const data = objectOnChange(this._state, () => {
          updateComputedState(this._state);
          if (dom.render(this.$root, { ...this._state, ...renderContext })) {
            opt.updated.call(this.context);
            //this._dispatchEventHooks('updated');
          }
        });

        this.disconnectStore = store(data);
        this.$root.innerHTML = dom.html;

        // context contains methods and properties to work on the element
        this.context = {
          ...methods,
          ...gobal$Object,
          data,
          el: this.$root,
          prop: this._state.prop,
          $store: opt.$store,
        };

        // Bind events
        bindEvents(this.$root, { ...this.context, __$bindInput });

        // Bind all the exports methods so it can be accessed in the element
        bindPublicMethodsToContext(this, methods, this.context);

        // Initial setup + first rendering
        updateComputedState(this._state);
        dom.render(this.$root, { ...this._state, ...renderContext });
        opt.created.call(this.context);
      }

      /**
       * When element is removed
       * @returns {void}
       */
      disconnectedCallback() {
        opt.removed.call(this.context);
        this.disconnectStore();
        //this._dispatchEventHooks('removed');
        this.$eventHooks = [];
      }

      /**
       * Getter data
       * @returns {object} immutable object
       */
      get data() {
        return immu(this._state);
      }

      // $on(hook, callback) {
      //   this.$eventHooks[hook].push(callback);
      //   return () => this.$eventHooks[hook].splice(this.$eventHooks[hook].indexOf(callback), 1);
      // }

      // _dispatchEventHooks(hook) {
      //   if (hook in this.$eventHooks) this.$eventHooks[hook].forEach(s => s(this.data));
      // }
    }
  );
}
