import Component, { __RewireAPI__ as Rewire } from '../src/component.js';

import { JSDOM } from 'jsdom';
const window = new JSDOM().window;
global.window = window;

function createHTML(text) {
  return new JSDOM(text).window.document.body;
}

const INITSTATE1 = {
  el: null,
  data: {
    a: 'a',
    b: 'b',
    c() {
      return null;
    },
    d() {},
    e() {},
  },
  method1() {},
  methodx() {},
  method3: () => null,
};

test('private:filterMethods', () => {
  const fn = Rewire.__get__('filterMethods');
  expect(fn(INITSTATE1)).toBeInstanceOf(Object);
  expect(Object.keys(fn(INITSTATE1)).length).toBe(3);
});

test('private:filterInitialState', () => {
  const fn = Rewire.__get__('filterInitialState');
  expect(fn(INITSTATE1.data)).toBeInstanceOf(Object);
  expect(Object.keys(fn(INITSTATE1.data)).length).toBe(2);
});

test('private:filterComputedState', () => {
  const fn = Rewire.__get__('filterComputedState');
  expect(fn(INITSTATE1.data)).toBeInstanceOf(Object);
  expect(Object.keys(fn(INITSTATE1.data)).length).toBe(3);
});

test('private:storeConnector', () => {
  const fn = Rewire.__get__('storeConnector');
  const store = fn({
    getState: () => {},
    subscribe: state => state => {},
  });
  const storeInstance = store({});
  expect(store).toBeInstanceOf(Function);
  expect(storeInstance).toBeInstanceOf(Function);
});

test('private:domConnector', () => {
  const fn = Rewire.__get__('domConnector');
  const template = '<div>Hello World</div>';
  const dom = fn(template);
  expect(dom).toBeInstanceOf(Object);
  expect(dom.html).toBe(template);
  expect(dom.render).toBeInstanceOf(Function);
});

// test('initialize', () => {
//   const template = `<div>Hello World</div>`;

//   const c = Component({
//     template,
//     tagName: 'my-tag',
//   });
//   expect(c).toBe(undefined);
// });
