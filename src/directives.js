/**
 * reLift-HTML
 */

// to prevent conflict, name that may clash prefix them with $
const DIRECTIVES_LIST = {
  $for: r_for,
  $if: r_if,
  $value: r_value,
  //disabled: r_disabled,
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
const replaceChild = (newEl, el) => el.parentNode.replaceChild(newEl, el);

/** r-if */
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

/** r-for */
function r_for(el, value, directive) {
  const groups = /(.*)\s+(in)\s+(.*)$/.exec(value);
  if (groups.length === 4) {
    const sel = groups[1].replace('(', '').replace(')', '');
    const query = groups[3];
    wrapAround(el, `\${${query}.map(function(${sel}) { return \``, `\`}.bind(this)).join('')}`);
    rm_d(el, directive);
  }
}

/** r-value */
function r_value(el, value, directive) {
  return
  const v = `\${${value}}`
  (el.nodeName === 'TEXTAREA') ? (el.innerHTML = v) : el.setAttribute('value', v);
  rm_d(el, directive);
}

/** r-disabled */
function r_disabled(el, value, directive) {
  // /r\-disable\s*=(.*)\s*"/m
  const dir = 'disabled';
  //rm_d(el, dir);
  el.setAttribute(dir, `\${ ${value} ? true : false}`);
}

/** r-class */
function r_class(el, value, directive) {
  if (!el.hasAttribute('class')) el.setAttribute('class', '');
  let cValue = el.getAttribute('class');
  // parse the value to make the condition
  el.setAttribute('class', cValue);
  rm_d(el, directive);
}


/** r-value */
function r_valueX(el, value, directive) {
  const nodeName = el.nodeName.toLowerCase();
  const d_default = get_d(el, 'default') || '';
  if (has_d(el, 'default')) rm_d(el, 'default');

  if (nodeName === 'textarea') {
    el.innerHTML = `\${${value}}`;
  } else if (nodeName === 'input') {
    if (['radio', 'checkbox'].includes(el.getAttribute('type'))) {
      //el.setAttribute('checked', `\$${(Array.isArray(${value}) ? value : [value] ).includes('5') ? 'checked' : ''\`}}`);
    } else {
      el.setAttribute('value', `\${${value}}`);
    }
  }
  rm_d(el, directive);
}

function r_checked(el, value, directive) {
  // <input type="radio" r-checked="this.something" value>
}