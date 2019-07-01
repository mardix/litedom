import {
  isFn,
  isObjKeyFn,
  htmlToDom,
  parseLit,
  computeState,
  set,
  get,
  toStrLit,
  randomChars,
  kebabCase,
  camelCase,
  styleMap,
  immu,
} from '../src/utils.js';

describe('isFn', () => {
  test('isFn', () => {
    const fn = () => {};
    expect(isFn(fn)).toBe(true);
  });
});

describe('isObjKeyFn', () => {
  test('is a function', () => {
    const o = {
      fn: () => {},
    };
    expect(isObjKeyFn(o, 'fn')).toBe(true);
  });

  test('not a function', () => {
    const o = {
      fn: 1,
    };
    expect(isObjKeyFn(o, 'fn')).toBe(false);
  });
});

describe('parseLit', () => {
  test('to return a function', () => {
    expect(parseLit('Hello ${this.name}')).toBeInstanceOf(Function);
  });
  test('Hello ${this.name} === Hello world', () => {
    expect(parseLit('Hello ${this.name}')({ name: 'world' })).toBe('Hello world');
  });
  test('Template literal stuff', () => {
    expect(parseLit('${1 + 1}')()).toBe('2');
  });
});

describe('htmlToDom', () => {
  test('div to HTMLElement', () => {
    const div = '<div>Hello World</div>';
    expect(htmlToDom(div)).toBeInstanceOf(HTMLElement);
  });
  test('div to return same outerHTML div', () => {
    const div = '<body><div>Hello World</div></body>';
    expect(htmlToDom(div).outerHTML).toBe(div);
  });
});

describe('computeState', () => {
  test('instantialize must return a function', () => {
    expect(computeState('name', state => {})).toBeInstanceOf(Function);
  });

  test('computeState should mutate the state via returned value', () => {
    const data = {
      name: 'HTML',
    };
    const m = computeState('value', state => {
      return `OK ${state.name}`;
    });
    m(data);
    expect(data.value).toBe('OK HTML');
  });
});

describe('SET', () => {
  test('Set simple key value', () => {
    const o = {};
    set(o, 'key', 'value');
    expect(o.key).toBe('value');
  });

  test('Set dot notation', () => {
    const o = {};
    set(o, 'key.key2.key3', 10);
    expect(o.key.key2.key3).toBe(10);
  });

  test('Set dot notation to be object', () => {
    const o = {};
    set(o, 'key.key2.key3', 10);
    expect(o.key.key2).toBeInstanceOf(Object);
  });
});

describe('GET', () => {
  test('Get simple key value', () => {
    const o = {
      key: 'value',
    };
    expect(get(o, 'key')).toBe('value');
  });

  test('Get dot notation', () => {
    const o = {
      key: {
        key2: {
          key3: 10,
        },
      },
    };
    expect(get(o, 'key.key2.key3')).toBe(10);
  });

  test('Set dot notation to be object', () => {
    const o = {
      key: {
        key2: {
          key3: 10,
        },
      },
    };
    expect(get(o, 'key.key2')).toBeInstanceOf(Object);
  });

  test('Set dot notation to be undefined', () => {
    const o = {
      key: {
        key2: {
          key3: 10,
        },
      },
    };
    expect(get(o, 'key.key2.k4')).toBe(undefined);
  });
});

describe('toStrLit', () => {
  test('string to string', () => {
    expect(toStrLit('hello world')).toBe('hello world');
  });

  test('string with var', () => {
    expect(toStrLit('hello {key}')).toBe('hello ${key}');
  });

  test('string with var with method inside', () => {
    expect(toStrLit('hello {key.aFunction()}')).toBe('hello ${key.aFunction()}');
  });

  test('string with var with properties', () => {
    expect(toStrLit('hello {key.val.something }')).toBe('hello ${key.val.something }');
  });

  test('string with var with operations', () => {
    expect(toStrLit('hello {key.val.something + y + z}')).toBe('hello ${key.val.something + y + z}');
  });

  test('string with var with ternary', () => {
    expect(toStrLit('hello {this.x ? y : z}')).toBe('hello ${this.x ? y : z}');
  });

  test('string with var with inside space left', () => {
    expect(toStrLit('hello  {  key}')).toBe('hello  ${  key}');
  });

  test('string with var with inside space left', () => {
    expect(toStrLit("hello <div id='{key}'></div>")).toBe("hello <div id='${key}'></div>");
  });

  test('string with var with inside space right', () => {
    expect(toStrLit('hello  {  key   }')).toBe('hello  ${  key   }');
  });

  test('string with var with inside space right 2', () => {
    expect(toStrLit('hello  {key   }')).toBe('hello  ${key   }');
  });

  test('string with var with leading extra space', () => {
    expect(toStrLit('hello  {key}')).toBe('hello  ${key}');
  });

  test('string with var with trailing extra space', () => {
    expect(toStrLit('hello  {key}   ')).toBe('hello  ${key}   ');
  });

  test('string with $', () => {
    expect(toStrLit('hello ${key}')).toBe('hello ${key}');
  });

  test('string with $$', () => {
    expect(toStrLit('hello $${key}')).toBe('hello $${key}');
  });

  test('string with $ with a method inside', () => {
    expect(toStrLit('hello ${key.aFunction()}')).toBe('hello ${key.aFunction()}');
  });

  test('string with $ with ternary', () => {
    expect(toStrLit('hello ${this.x ? y : z}')).toBe('hello ${this.x ? y : z}');
  });
});

describe('randomChars', () => {
  test('Default length 7', () => {
    expect(randomChars().length).toBe(7);
  });

  test('Length 10', () => {
    expect(randomChars(10).length).toBe(10);
  });
});

describe('kebabCase', () => {
  test('hello', () => {
    expect(kebabCase('hello')).toBe('hello');
  });

  test('hello-world', () => {
    expect(kebabCase('hello-world')).toBe('hello-world');
  });

  test('helloWorld', () => {
    expect(kebabCase('helloWorld')).toBe('hello-world');
  });

  test('helloworld', () => {
    expect(kebabCase('helloworld')).toBe('helloworld');
  });

  test('helloAWorld', () => {
    expect(kebabCase('helloAWorld')).toBe('hello-a-world');
  });

  test('HelloWorld', () => {
    expect(kebabCase('HelloWorld')).toBe('hello-world');
  });

  test('HelloABCWorld', () => {
    expect(kebabCase('HelloABCWorld')).toBe('hello-a-b-c-world');
  });
});

describe('camelCase', () => {
  test('hello', () => {
    expect(camelCase('hello')).toBe('hello');
  });

  test('hello-world', () => {
    expect(camelCase('hello-world')).toBe('helloWorld');
  });

  test('hello_world', () => {
    expect(camelCase('hello_world')).toBe('helloWorld');
  });

  test('hello world', () => {
    expect(camelCase('hello world')).toBe('helloWorld');
  });

  test('hello my world', () => {
    expect(camelCase('hello my world')).toBe('helloMyWorld');
  });
});

describe('styleMap', () => {
  test('stylemap', () => {
    const s = {
      color: 'blue',
      topLine: 'yellow',
      'bottom-dash': 'red',
      'font-size': '12px',
      backgroundColor: 'purple',
      textSize: '2em',
      margin: '0 20 40 30 !important',
    };

    expect(styleMap(s)).toBe(
      'color: blue; top-line: yellow; bottom-dash: red; font-size: 12px; background-color: purple; text-size: 2em; margin: 0 20 40 30 !important;'
    );
  });
});
