/**
 * reLift-HTML
 */

// @ts-check

import Component from './component.js';
import { randomChars, selector } from './utils.js';

const error = msg => new Error(`reLift-HTML Error: ${msg}`);

/**
 * Generate random custom element tag
 * @returns {string}
 */
const genRandomCustomElementTagName = () => `relift-ce-${randomChars()}`;

/**
 * reLiftHTML default function initializer
 * @params {object} the configuration
 */
function reLift(options) {
  const opt = {
    /**
     * el
     * @type {HTMLElement | string}
     * The target element for inplace element where it will be displayed at.
     * If $template is null, it will use the el#innerHTML as template.
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
     * the template if the template string to use to create the component.
     * If it exists along with $el, $el will be the target, but use $template as template
     * This take precedence over $el#innerHTML */
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
    el.style.display = 'block';
    if (!opt.template) opt.template = el.innerHTML;
    el.innerHTML = '';
    if (!hasTagName) {
      const tagEl = document.createElement(opt.tagName);
      if (opt.refId) tagEl.setAttribute('ref-id', opt.refId);
      el.parentNode.replaceChild(tagEl, el);
    }
  }

  if (!opt.template) throw error(`missing 'template' option or 'el' are not valid elements`);
  Component(opt);
}

/**
 *
 * @param {object|array} config object of reLift options or array of relift options
 */
export default function(config) {
  if (Array.isArray(config)) config.map(o => reLift(o));
  else reLift(config);
}
