import { parseDirectives } from '../src/directives.js';
import { decodeHTMLStringForDirective } from '../src/utils.js';

import { JSDOM } from 'jsdom';

function createHTML(text) {
  return new JSDOM(text).window.document.body;
}

test('r-if', () => {
  const root = createHTML(`<body><div id='root'><span :if='this.a === b'>Hello</span></div></body>`);
  parseDirectives(root);
  const result = '<div id="root">${this.a === b ? `<span>Hello</span>`:``}</div>';
  expect(root.innerHTML).toBe(result);
});

test('greater & lesser than', () => {
  const root = createHTML(`<body><div id='root'><span :if='this.a > b'>Hello</span></div></body>`);
  const rootB = createHTML(`<body><div id='root'><span :if='this.a < b'>Hello</span></div></body>`);
  const rootC = createHTML(`<body><div id='root'><span :if='this.a >= b'>Hello</span></div></body>`);
  const rootD = createHTML(`<body><div id='root'><span :if='this.a <= b'>Hello</span></div></body>`);
  parseDirectives(root);
  parseDirectives(rootB);
  parseDirectives(rootC);
  parseDirectives(rootD);

  expect(root.innerHTML).toBe('<div id="root">${this.a &gt; b ? `<span>Hello</span>`:``}</div>');
  expect(rootB.innerHTML).toBe('<div id="root">${this.a &lt; b ? `<span>Hello</span>`:``}</div>');
  expect(rootC.innerHTML).toBe('<div id="root">${this.a &gt;= b ? `<span>Hello</span>`:``}</div>');
  expect(rootD.innerHTML).toBe('<div id="root">${this.a &lt;= b ? `<span>Hello</span>`:``}</div>');
});

test('greater & lesser than when decoded', () => {
  const root = createHTML(`<body><div id='root'><span :if='this.a > b'>Hello</span></div></body>`);
  const rootB = createHTML(`<body><div id='root'><span :if='this.a < b'>Hello</span></div></body>`);
  const rootC = createHTML(`<body><div id='root'><span :if='this.a >= b'>Hello</span></div></body>`);
  const rootD = createHTML(`<body><div id='root'><span :if='this.a <= b'>Hello</span></div></body>`);
  parseDirectives(root);
  parseDirectives(rootB);
  parseDirectives(rootC);
  parseDirectives(rootD);

  expect(decodeHTMLStringForDirective(root.innerHTML)).toBe(
    '<div id="root">${this.a > b ? `<span>Hello</span>`:``}</div>'
  );
  expect(decodeHTMLStringForDirective(rootB.innerHTML)).toBe(
    '<div id="root">${this.a < b ? `<span>Hello</span>`:``}</div>'
  );
  expect(decodeHTMLStringForDirective(rootC.innerHTML)).toBe(
    '<div id="root">${this.a >= b ? `<span>Hello</span>`:``}</div>'
  );
  expect(decodeHTMLStringForDirective(rootD.innerHTML)).toBe(
    '<div id="root">${this.a <= b ? `<span>Hello</span>`:``}</div>'
  );
});

test('r-if else', () => {
  const root = createHTML(
    `<body><div id='root'><span :if='this.a === b'>Hello</span><span :else>World</span></div></body>`
  );
  parseDirectives(root);
  const result = '<div id="root">${this.a === b ? `<span>Hello</span>`:`<span>World</span>`}</div>';
  expect(root.innerHTML).toBe(result);
});

test('r-if no immidiate else', () => {
  const root = createHTML(
    `<body><div id='root'><span :if='this.a === b'>Hello</span><span>Something Else</span><span r-else>World</span></div></body>`
  );
  parseDirectives(root);
  const result =
    '<div id="root">${this.a === b ? `<span>Hello</span>`:``}<span>Something Else</span><span r-else="">World</span></div>';
  expect(root.innerHTML).toBe(result);
});

test('for', () => {
  const root = createHTML(`<body><div id='root'><ul><li :for="item in this.items">{item}</li></ul></div></body>`);
  parseDirectives(root);
  const result =
    '<div id="root"><ul>${this.items.map(function(item) { return `<li>{item}</li>`}.bind(this)).join(\'\')}</ul></div>';
  expect(root.innerHTML).toBe(result);
});

test('inner for', () => {
  const root = createHTML(
    `<body><div id='root'><ul><li :for="item in this.items"><ul><li :for="item2 in item">{item2}</li></ul></li></ul></div></body>`
  );
  parseDirectives(root);
  const result =
    "<div id=\"root\"><ul>${this.items.map(function(item) { return `<li><ul>${item.map(function(item2) { return `<li>{item2}</li>`}.bind(this)).join('')}</ul></li>`}.bind(this)).join('')}</ul></div>";
  expect(root.innerHTML).toBe(result);
});

test('for with if', () => {
  const root = createHTML(
    `<body><div id='root'><ul><li :for="item in this.items">{item} <span :if="x === y">Yes</span></li></ul></div></body>`
  );
  parseDirectives(root);
  const result =
    '<div id="root"><ul>${this.items.map(function(item) { return `<li>{item} ${x === y ? `<span>Yes</span>`:``}</li>`}.bind(this)).join(\'\')}</ul></div>';
  expect(root.innerHTML).toBe(result);
});

test('textContent with text', () => {
  const root = createHTML(
    `<body><div id='root'><p :text="{this.a}"></p></div>`
  );
  parseDirectives(root);
  const result = '<div id="root"><p>{this.a}</p></div>';
  expect(root.innerHTML).toBe(result);
});
