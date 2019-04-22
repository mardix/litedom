
import onChange from '../src/onchange.js';

test('set new property', () => {
  const initialData = {};
  const data = onChange(initialData, () => {});
  data.name = 'reLiftHTML';
  expect(data.name).toBe('reLiftHTML');
})

test('set new property affecting initial source', () => {
  const initialData = {};
  const data = onChange(initialData, () => {});
  data.name = 'reLiftHTML';
  expect(initialData.name).toBe('reLiftHTML');
})

test('get ___target___', () => {
  const initialData = {};
  const data = onChange(initialData, () => {});
  data.name = 'reLiftHTML';
  expect(data.___target___).toEqual({name: 'reLiftHTML'});
})

test('onChange callback function', done => {
  const initialData = {};
  const data = onChange(initialData, () => {
    expect(data.name).toBe('reLiftHTML');
    done();
  });
  data.name = 'reLiftHTML';
})

test('with array', () => {
  const initialData = {
    myObj: {}
  };
  const data = onChange(initialData, () => {});
  data.myObj.myArray = [1, 2, 3]
  expect(data.myObj.myArray.length).toEqual(3);
})
