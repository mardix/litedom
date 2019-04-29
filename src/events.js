/**
 * reLift-HTML
 */


const EVENTS_LIST = []; 
for (const key in document) {
  const isEvent = document[key] === null || typeof document[key] === 'function';
  if (key.startsWith('on') && isEvent) EVENTS_LIST.push(key.substring(2))
}
const ATTR_EVENTS_LIST = 'r-events-list';
const mkEventName = e => `r-on-${e}`;

export function tokenizeEvents(selector) {
  /**
   * '@call'
   * Wildcard events, base of the type of the element it will assign the right event name
   * ie: on input element, '@call' will turn into 'r-on-input' and 'r-on-paste'
   * on AHREF, '@call' will turn into 'r-on-click'
   */
  for (const el of selector.querySelectorAll('[\\@call]')) {
    const method = el.getAttribute('@call');
    el.removeAttribute('@call');
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

export function bindEvents(selector, context) {
  function mapEvents(selector) {
    Array.from(selector.querySelectorAll(`[${ATTR_EVENTS_LIST}]`)).map(el => {
      (el.getAttribute(ATTR_EVENTS_LIST) || '')
        .split(',')
        .filter(v => v)
        .map(e => {
          el[`on${e}`] = (evnt) => {
            evnt.preventDefault();
            const method = el.getAttribute(mkEventName(e)) 
            context[method].call(context, evnt);
          }
        });
    });
  }

  const mutationsObserver = new MutationObserver(mutations => {
    [...mutations]
      .filter(m => m.addedNodes.length > 0)
      .map(m2 => m2.target)
      .map(t => mapEvents(t));
  });
  mutationsObserver.observe(selector, {
    attributes: true,
    childList: true,
    subtree: true
  });
  mapEvents(selector);
  return mutationsObserver;
}
