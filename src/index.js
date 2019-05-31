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
    /** @type {HTMLElement | string} a string or a html for query selector. Place holder of the component when inline */
    el: null,
    /** @type {boolean} when true it will use the el.innerHTML as the template */
    asTemplate: false,
    /** @type {string} */
    tagName: null,
    /** @type {boolean|null} */
    isShadow: null,
    /** @type {string} the template string to use to create the component */
    template: null,
    ...options
  };
  let el = null;

  /**
   * Create the template string
   */

  opt.isShadow = opt.isShadow === null ? opt.asTemplate : opt.isShadow;

  if (opt.el) {
    el = selector(opt.el);
    el.style.display = 'block';
    opt.tagName = opt.tagName || (opt.asTemplate ? el.getAttribute('tag-name') : genRandomCustomElementTagName());
    if (!opt.template) {
      opt.template = opt.asTemplate ? el.innerHTML : el.outerHTML;
    }
    if (opt.asTemplate) {
      el.innerHTML = '';
    } else {
      el.parentNode.replaceChild(document.createElement(opt.tagName), el);
    }
  }
  opt.tagName = opt.tagName || genRandomCustomElementTagName();

  if (!opt.template) throw error(`missing 'template' option or 'el' are not valid elements`);
  if (!opt.tagName) throw error(`missing 'tagName'`);
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
