/**
 * Litedom
 */

/**
 * The order is important, specially for :for and :if
 * @type {object}
 * */
const DIRECTIVES_LIST = {
  $key: _key,
  $class: _class,
  $style: _style,
  $for: _for,
  $if: _if,
};

const md = dir => `\:${dir}`;
const has = (el, dir) => el.hasAttribute(md(dir));
const get = (el, dir) => el.getAttribute(md(dir));
const remove = (el, dir) => el.removeAttribute(md(dir));
const query = (el, dir) => el.querySelector(`[\\${md(dir)}]`);
const queryAll = (el, dir) => el.querySelectorAll(`[\\${md(dir)}]`);
const beforeText = (el, text) => el.insertAdjacentText('beforebegin', text);
const afterText = (el, text) => el.insertAdjacentText('afterend', text);
const wrapAround = (el, before, after) => {
  beforeText(el, before);
  afterText(el, after);
};

/**
 * Parse directives
 * @param {HTMLElement} el the element
 * @param {object} customDirectives custom directives to expand functionalities
 * @return {HTMLElement}
 */
export function parseDirectives(el, customDirectives = {}) {
  const directives = { ...customDirectives, ...DIRECTIVES_LIST };
  for (const $dir in directives) {
    const directive = $dir.replace('$', '');
    for (const el2 of queryAll(el, directive)) {
      if (has(el2, directive)) {
        const value = get(el2, directive);
        directives[$dir](el2, value, directive);
      }
    }
  }
  return el;
}

/**
 * :if directive
 * @param {HTMLElement} el
 * @param {string} value
 * @param {string} directive
 * @returns {void}
 */
function _if(el, value, directive) {
  remove(el, directive);
  beforeText(el, `\${${value} ? `);
  const rElse = el.nextElementSibling;
  if (rElse && has(rElse, 'else')) {
    wrapAround(el, `\``, `\``);
    remove(rElse, 'else');
    wrapAround(rElse, `:\``, `\`}`);
  } else {
    wrapAround(el, `\``, `\`:\`\`}`);
  }
}

/**
 * :for director
 * @todo: add for else => :else for for, it's an if condition that test the length,
 * @param {HTMLElement} el
 * @param {string} value
 * @param {string} directive
 * @returns {void}
 */
function _for(el, value, directive) {
  const groups = /(.*)\s+(in)\s+(.*)$/.exec(value);
  if (groups.length === 4) {
    const sel = groups[1].replace('(', '').replace(')', '');
    const query = groups[3];
    wrapAround(el, `\${${query}.map(function(${sel}) { return \``, `\`}.bind(this)).join('')}`);
    remove(el, directive);
  }
}

/**
 * :class directive
 * <div :class="clsName:condition; clsName2: condition2"></div>
 * <div :class="hide: this.item > 5; show-my-ownclass: x === y"></div>
 * @param {HTMLElement} el
 * @param {string} value
 * @param {string} directive
 * @returns {void}
 */
function _class(el, value, directive) {
  const klass = value
    .split(';')
    .map(v => v.split(':', 2).map(e => e.trim()))
    .map(v => `\${${v[1]} ? '${v[0]}': ''}`)
    .join(' ');
  const classList = (el.getAttribute('class') || '') + ` ${klass}`;
  el.setAttribute('class', classList);
  remove(el, directive);
}

/**
 * :key directive
 * <div :key="{index}"></div> will be change to <div ref-key="{index}">
 * to make sure iteration is rendered properly
 * @param {HTMLElement} el
 * @param {string} value
 * @param {string} directive
 * @returns {void}
 */
function _key(el, value, directive) {
  el.setAttribute('ref-key', value);
  remove(el, directive);
}

function _style(el, value, directive) {
  const oStyle = el.getAttribute('style') || '';
  const style = `\${function() { return this.__$styleMap(${value});}.call(this)}`;
  el.setAttribute('style', (oStyle ? oStyle + '; ' : '') + style);
  remove(el, directive);
}
