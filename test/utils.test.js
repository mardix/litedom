import { isFn, htmlToDom, parseLit, computeState } from '../src/utils.js';

describe('isFn', () => {
  test('is a function', () => {
    const o = {
      fn: () => {},
    };
    expect(isFn(o, 'fn')).toBe(true);
  });

  test('not a function', () => {
    const o = {
      fn: 1
    };
    expect(isFn(o, 'fn')).toBe(false)
  })
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

describe('computeState', () => {
  test('instantialize must return a function', () => {
    expect(computeState('name', (state) => {})).toBeInstanceOf(Function)
  });

  test('computeState should mutate the state via returned value', () => {
    const data = {
      name: 'HTML',
    };
    const m = computeState('value', (state) => { return `OK ${state.name}`});
    m(data);
    expect(data.value).toBe('OK HTML')
  });  
})