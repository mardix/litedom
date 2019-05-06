import { isFn, htmlToDom, parseLit, computeState, set, get } from '../src/utils.js';

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

describe('SET', () => {
  test('Set simple key value', () => {
    const o = {};
    set(o, 'key', 'value');
    expect(o.key).toBe('value')
  })

  test('Set dot notation', () => {
    const o = {};
    set(o, 'key.key2.key3', 10);
    expect(o.key.key2.key3).toBe(10)
  })

  test('Set dot notation to be object', () => {
    const o = {};
    set(o, 'key.key2.key3', 10);
    expect(o.key.key2).toBeInstanceOf(Object);
  });

}) 



describe('GET', () => {
  test('Get simple key value', () => {
    const o = {
      key: 'value'
    };
    expect(get(o, 'key')).toBe('value')
  })

  test('Get dot notation', () => {
    const o = {
      key: {
        key2: {
          key3: 10
        }
      }
    };
    expect(get(o, 'key.key2.key3')).toBe(10)
  })

  test('Set dot notation to be object', () => {
    const o = {
      key: {
        key2: {
          key3: 10
        }
      }
    };
    expect(get(o, 'key.key2')).toBeInstanceOf(Object);
  });

  test('Set dot notation to be undefined', () => {
    const o = {
      key: {
        key2: {
          key3: 10
        }
      }
    };
    expect(get(o, 'key.key2.k4')).toBe(undefined);
  });
}) 
