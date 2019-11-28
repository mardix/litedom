/**
 * Litedom
 */

// @ts-check

import Component from './component.js';
import {
  randomChars,
  selector,
  isDisplayNone,
  isVisibilityHidden,
} from './utils.js';

const error = msg => new Error(`Litedom Error: ${msg}`);

/**
 * Generate random custom element tag
 * @returns {string}
 */
const genRandomCustomElementTagName = () => `litedom-${randomChars()}`;

/**
 * Litedom default function initializer
 * @param {object} options the configuration
 */
function Litedom(options) {
  const opt = {
    /**
     * el
     * @type {HTMLElement | string}
     * The target element for inplace element where it will be displayed at.
     * If $template is omitted or null, it will use the el#innerHTML as template.
     * To select in-place element, provide $refId which can be retrieved using
     * document.querySelector('[ref-id="the-refId-provided"]')
     * */
    el: null,
    /**
     * refId
     * @type {string | null}
     * A unique identifier to allow us to select the in-place element.
     * Only when using $el for in-place element. Custom element won't have it
     * To select in-place element, provide $refId which can be retrieve using
     * document.querySelector('[ref-id="the-refId-provided"]')
     *  */
    refId: null,
    /**
     * template
     * @type {string}
     * the template is the template string to use to create the component.
     * If it exists along with $el, $el will be the target, but it will use $template as template
     * This take precedence over $el#innerHTML
     * Omit $template to use $el#innerHTML as template*/
    template: null,
    /**
     * tagName
     * @type {string}
     * The tagname leave as null for in-place element.
     * A string for custom element */
    tagName: null,
    /**
     * shadowDOM
     * @type {boolean}
     * To indicate this element is self-contained as shadow dom */
    shadowDOM: false,
    ...options,
  };
  let el = null;

  const hasTagName = !!opt.tagName;
  opt.tagName = opt.tagName || genRandomCustomElementTagName();

  if (opt.el) {
    el = selector(opt.el);

    /**
     * To prevent the flickering of the element or showing placeholders,
     * it's recommended to set
     * visibility:hidden or display:none to hide before rendering
     * This will make sure it's removed
     */
    if (isVisibilityHidden(el)) el.style.visibility = 'visible';
    if (isDisplayNone(el)) el.style.display = '';

    if (!opt.template) opt.template = el.innerHTML;
    el.innerHTML = '';
    if (!hasTagName) {
      const tagEl = document.createElement(opt.tagName);
      if (opt.refId) tagEl.setAttribute('ref-id', opt.refId);
      el.parentNode.replaceChild(tagEl, el);
    }
  }

  if (!opt.template)
    throw error(`missing 'template' option or 'el' are not valid elements`);
  Component(opt);
}

/**
 *
 * @param {object|array} config object of Litedom options or array of options
 * @param {object} sharedOptions, to share global options, ie: $store, $router, $events
 */
export default (options, sharedOptions = {}) => {
  if (Array.isArray(options))
    options.map(o => Litedom({ ...sharedOptions, ...o }));
  else Litedom(options);
};
