/**
 * reLift-HTML
 */

// @ts-check

import Component from './component.js';
import { randomChars, selector} from './utils.js';

const error = (msg) => new Error(`reLift-HTML Error: ${msg}`);

/**
 * reLiftHTML default function initializer
 * @param {object} options 
 */
export default function (options = {}) {
  const opt = {
    el: null,
    /** @type {boolean} */
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

  if (!opt.template) {
    el = selector(opt.el);
    el.style.display = 'block'; 
    opt.template = opt.asTemplate ? el.innerHTML : el.outerHTML;
    opt.tagName = opt.tagName || (opt.asTemplate ? el.getAttribute('tag-name') : `relift-ce-${randomChars()}`);    
  }
  
  if (opt.el && !opt.isShadow) {
    el = selector(opt.el);
    el.style.display = 'block';
    opt.template = opt.template || el.outerHTML;
    opt.tagName = opt.tagName || `relift-ce-${randomChars()}`;
    el.parentNode.replaceChild(document.createElement(opt.tagName), el);  
  } 

  if (!opt.template) throw error(`missing 'template' option or 'el' are not valid elements`);
  if (!opt.tagName) throw error(`missing 'tagName'`);
  Component(opt);
}
