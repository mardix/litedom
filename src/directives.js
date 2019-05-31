/**
 * reLift-HTML
 */

/** @type {object} */
const DIRECTIVES_LIST = {
  $for: r_for,
  $if: r_if
  //$class: r_class,
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
    for (const el2 of qall_d(el, directive)) {
      if (has_d(el2, directive)) {
        const value = get_d(el2, directive);
        directives[$dir](el2, value, directive);
      }
    }
  }
  return el;
}

const md = dir => `r-${dir}`;
const has_d = (el, dir) => el.hasAttribute(md(dir));
const get_d = (el, dir) => el.getAttribute(md(dir));
const rm_d = (el, dir) => el.removeAttribute(md(dir));
const q_d = (el, dir) => el.querySelector(`[${md(dir)}]`);
const qall_d = (el, dir) => el.querySelectorAll(`[${md(dir)}]`);
const beforeText = (el, text) => el.insertAdjacentText('beforebegin', text);
const afterText = (el, text) => el.insertAdjacentText('afterend', text);
const wrapAround = (el, before, after) => {
  beforeText(el, before);
  afterText(el, after);
};

/**
 * r-if directive
 * @param {HTMLElement} el
 * @param {string} value
 * @param {string} directive
 * @returns {void}
 */
function r_if(el, value, directive) {
  rm_d(el, directive);
  beforeText(el, `\${${value} ? `);
  const rElse = el.nextElementSibling;
  if (rElse && has_d(rElse, 'else')) {
    wrapAround(el, `\``, `\``);
    rm_d(rElse, 'else');
    wrapAround(rElse, `:\``, `\`}`);
  } else {
    wrapAround(el, `\``, `\`:\`\`}`);
  }
}

/**
 * r-for director
 * @todo: add for else => r-else for for, it's an if condition that test the length,
 * @param {HTMLElement} el
 * @param {string} value
 * @param {string} directive
 * @returns {void}
 */
function r_for(el, value, directive) {
  const groups = /(.*)\s+(in)\s+(.*)$/.exec(value);
  if (groups.length === 4) {
    const sel = groups[1].replace('(', '').replace(')', '');
    const query = groups[3];
    wrapAround(el, `\${${query}.map(function(${sel}) { return \``, `\`}.bind(this)).join('')}`);
    rm_d(el, directive);
  }
}

/**
 * r-class directive
 * <div r-class="clsName:condition; clsName2: condition2"></div>
 * <div r-class="hide: this.item > 5; show-my-ownclass: x === y"></div>
 * @param {HTMLElement} el
 * @param {string} value
 * @param {string} directive
 * @returns {void}
 */
function r_class(el, value, directive) {
  const klass = value
    .split(';')
    .map(v => v.split(':', 2).map(e => e.trim()))
    .map(v => `\${${v[1]} ? '${v[0]}': ''}`)
    .join(' ');
  const classList = el.getAttribute('class') || '' + ` ${klass}`;
  el.setAttribute('class', classList);
  rm_d(el, directive);
}
