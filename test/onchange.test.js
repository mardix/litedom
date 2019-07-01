import { objectOnChange } from '../src/utils.js';

test('set new property', () => {
  const initialData = {};
  const data = objectOnChange(initialData, () => {});
  data.name = 'Litedom';
  expect(data.name).toBe('Litedom');
});

test('set new property affecting initial source', () => {
  const initialData = {};
  const data = objectOnChange(initialData, () => {});
  data.name = 'Litedom';
  expect(initialData.name).toBe('Litedom');
});

test('get ___target___ #', () => {
  const initialData = {};
  const data = objectOnChange(initialData, () => {});
  data.name = 'Litedom';
  expect(data['#']).toEqual({ name: 'Litedom' });
});

test('objectOnChange callback function', done => {
  const initialData = {};
  const data = objectOnChange(initialData, () => {
    expect(data.name).toBe('Litedom');
    done();
  });
  data.name = 'Litedom';
});

test('with array', () => {
  const initialData = {
    myObj: {},
  };
  const data = objectOnChange(initialData, () => {});
  data.myObj.myArray = [1, 2, 3];
  expect(data.myObj.myArray.length).toEqual(3);
});
