import reLiftState from '../src/relift-state.js';

test('reLiftState is a function', () => {
  expect(reLiftState).toBeInstanceOf(Function);
});

test('reLiftState() store returns an object', () => {
  const store = reLiftState();
  expect(store).toBeInstanceOf(Object);
});

test('store.$subscribe is a function', () => {
  const store = reLiftState();
  expect(store.$subscribe).toBeInstanceOf(Function);
});

test('store.$getState() returns an object', () => {
  const store = reLiftState();
  expect(store.$getState()).toBeInstanceOf(Object);
});

test('store contains initial state', () => {
  const store = reLiftState({
    name: 'reLiftState',
    version: 'x.x.x',
  });
  expect(store.$getState().name).toBe('reLiftState');
});

test('store set selector', () => {
  const store = reLiftState({
    name: 'reLiftState',
    version: 'x.x.x',
    selectorName: state => `${state.name}-${state.version}`,
  });
  expect(store.$getState().selectorName).toBe('reLiftState-x.x.x');
});

test('store action is an action function', () => {
  const store = reLiftState(
    {},
    {
      action(state) {},
    }
  );
  expect(store.action).toBeInstanceOf(Function);
});

test('store run action, mutate state', () => {
  const store = reLiftState(
    {
      name: 'reLiftState',
      version: 'x.x.x',
      selectorName: state => `${state.name}-${state.version}`,
    },
    {
      changeVersion: state => (state.version = '1.0.0'),
    }
  );
  expect(store.$getState().selectorName).toBe('reLiftState-x.x.x');
  store.changeVersion();
  expect(store.$getState().selectorName).toBe('reLiftState-1.0.0');
});

test('store chain action is an action function', () => {
  const store = reLiftState(
    {},
    {
      action(state) {},
      action2(state) {},
      action3(state) {},
    },
  );
  expect(store.action().action2().action3).toBeInstanceOf(Function);
});

test('store chain action is an action function returning object of actions', () => {
  const store = reLiftState(
    {},
    {
      action(state) {},
      action2(state) {},
      action3(state) {},
    },
  );
  expect(store.action().action2().action3()).toBeInstanceOf(Object);
});