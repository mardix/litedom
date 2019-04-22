import { isFn, htmlToDom, parseLit, selectorMemoizer } from '../src/utils.js';

describe('isFn', () => {
  test('isFn returns a bool', () => {
    const o = {
      fn: () => {},
    };
    expect(isFn(o, 'fn')).toBe(true);
  });
});

describe('parseLit', () => {
  test('to return a function', () => {
    expect(parseLit('Hello ${this.name}')).toBeInstanceOf(Function);
  });
  test('Hello ${this.name} === Hello world', () => {
    expect(parseLit('Hello ${this.name}')({name: 'world' })).toBe("Hello world");
  });
  test('Template literal stuff', () => {
    expect(parseLit('${1 + 1}')()).toBe('2');
  });
});

describe('htmlToDom', () => {
  test('div to HTMLElement', () => {
    const div = '<div>Hello World</div>';
    expect(htmlToDom(div)).toBeInstanceOf(HTMLElement)
  })
  test('div to return same outerHTML div', () => {
    const div = '<div>Hello World</div>';
    expect(htmlToDom(div).outerHTML).toBe(div)
  })
});

describe('selectorMemoizer', () => {
  test('instantialize must return a function', () => {
    expect(selectorMemoizer('name', (state) => {})).toBeInstanceOf(Function)
  });

  test('selectorMemoizer should mutate the state', () => {
    const data = {
      name: 'HTML',
    };
    const m = selectorMemoizer('value', (state) => { return `OK ${state.name}`});
    m(data);
    expect(data.value).toBe('OK HTML')
  });  
})