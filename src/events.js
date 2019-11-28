/**
 * Litedom
 */
// @ts-check

import { isFn, get } from './utils.js';

/**
 * Holds all the browser's event list, ie: click, mouseover, keyup
 * @type {Array}
 */

const EVENTS_LIST = [];
for (const key in document) {
  const isEvent = document[key] === null || isFn(document[key]);
  if (key.startsWith('on') && isEvent) EVENTS_LIST.push(key.substring(2));
}

/** @type {string} attribute to hold all events name */
const ATTR_EVENTS_LIST = 'ld--elist';

/**
 * Make an event name
 * @param {string} e the event name
 * @returns {string}
 */
const mkEventName = e => `ld-on-${e}`;

/**
 * Tokenize all the events, change @* to ld-on-*
 * @param {HTMLElement} selector
 * @returns {void}
 */
export function tokenizeEvents(selector) {
  /**
   * '@call'
   * Wildcard events, base of the type of the element it will assign the right event name
   * ie: on input element, '@call' will turn into 'ld-on-input' and 'ld-on-paste'
   * on AHREF, '@call' will turn into 'ld-on-click'
   *
   * '@bind'
   * For two way data binding in input elements
   *
   */
  for (const el of selector.querySelectorAll('[\\@call], [\\@bind]')) {
    let method = el.getAttribute('@call');
    const isBind = el.hasAttribute('@bind');
    el.removeAttribute('@call');
    if (isBind) {
      el.setAttribute('ld--bind', el.getAttribute('@bind'));
      el.removeAttribute('@bind');
      method = '__$bindInput';
    }

    let evnts = ['click'];
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) evnts = ['input', 'paste'];
    else if (el instanceof HTMLSelectElement) evnts = ['change'];
    else if (el instanceof HTMLFormElement) evnts = ['submit'];
    else if (el instanceof HTMLAnchorElement) el.setAttribute('href', 'javascript:void(0);');
    let eventsList = (el.getAttribute(ATTR_EVENTS_LIST) || '').split(',').filter(v => v);
    eventsList = eventsList.concat(evnts);
    el.setAttribute(ATTR_EVENTS_LIST, eventsList.join(','));
    for (const e of evnts) {
      el.setAttribute(mkEventName(e), method);
    }
  }
  // Regular event list
  for (const e of EVENTS_LIST) {
    for (const el of selector.querySelectorAll(`[\\@${e}]`)) {
      const eventsList = (el.getAttribute(ATTR_EVENTS_LIST) || '').split(',').filter(v => v);
      eventsList.push(e);
      el.setAttribute(ATTR_EVENTS_LIST, eventsList.join(','));
      el.setAttribute(mkEventName(e), el.getAttribute(`@${e}`));
      el.removeAttribute(`@${e}`);
      if (el instanceof HTMLAnchorElement) el.setAttribute('href', 'javascript:void(0);');
    }
  }
}

/**
 * Bind events to all elements with r-on-*
 * @param {Element|ShadowRoot} selector The element to look
 * @param {Object} context object of function to bind the events to
 * @returns {MutationObserver}
 */
export function bindEvents(selector, context) {
  function mapEvents(selector) {
    Array.from(selector.querySelectorAll(`[${ATTR_EVENTS_LIST}]`)).map(el => {
      (el.getAttribute(ATTR_EVENTS_LIST) || '')
        .split(',')
        .filter(v => v)
        .map(e => {
          el[`on${e}`] = evnt => {
            evnt.preventDefault();
            const method = el.getAttribute(mkEventName(e));
            context[method].call(context, evnt);
          };
        });
    });
  }

  // set initial values
  Array.from(selector.querySelectorAll(`[ld--bind]`)).map(el => {
    const value = get(context.data, el.getAttribute('ld--bind'));
    try {
      if (el.tagName === 'INPUT' && ['radio', 'checkbox'].includes(el.type)) {
        if (value.includes(el.value)) {
          el.checked = true;
        }
      } else {
        el.value = value;
      }
    } catch (e) {
      //
    }
  });

  const mutationsObserver = new MutationObserver(mutations => {
    [...mutations]
      .filter(m => m.addedNodes.length > 0)
      .map(m2 => m2.target)
      .map(t => mapEvents(t));
  });
  mutationsObserver.observe(selector, {
    attributes: true,
    childList: true,
    subtree: true,
  });
  mapEvents(selector);
  return mutationsObserver;
}
