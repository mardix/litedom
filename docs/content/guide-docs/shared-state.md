## Shared State

[TOC]

To share state with multiple instances, it's recommended to have a state manager such as <a href="https://github.com/mardix/restated" target="_blank">**\*RESTATED**</a>, Redux, or look through this <a href="https://www.javascriptstuff.com/state-managers/" target="_blank">List of State Managers</a>

### State Manager Interface

For the to be hooked in reLift-HTML, it must have the following methods:

**`getState()`** : To return the full state of the store.

**`subscribe(callback:function)`**: A subscription method that will execute each the state is updated.

If the state manager doesn't provide these methods by default, you can extend it yourself.

```js
const myStateManager = new somethingSomething();

// Now the store contains getState() and subscribe(callback)
const store = {
  getState() {
    return myStateManager.state;
  },
  subscribe(callback) {
    return myStateManager.onChange(callback);
  },
  ...myStateManager,
};
```

### Setup

```js
reLiftHTML({
  el: '#root',
  data: {},
  $store: STORE_INSTANCE,
});
```

### In Methods

The store is exposed in the methods by `this.$store`, which is the object that was passed. Therefor you can access anything from it.

```js
reLiftHTML({
  el: '#root',
  data: {},
  $store: STORE_INSTANCE,
  doSomething() {
    this.$store.doSomething();
  },
});
```

### In Template

To access properties from the store, `this.$store` is exposed and contain the values from `$store.getState()`.

```
  <div id="root">
    {this.$store.fullName}
  </div>
```

### Example with **reStated**

---

**reStated**

An ambitiously tiny flux-like library to manage your state.

Inspired by Redux and Vuex, **reStated** removes the boilerplate and keep it simple and flat.

Unlike Redux, you don't need to return a new immutable object. You can mutate the state in place, and you definitely don't need to define a reducer. The action mutator is both your action and your reducer "at the same damn time" (Future's song)

Unlike Vuex, you don't need to have actions and mutations. You can only mutate the state via your actions mutators which are just function that pass as first argument the current state to be mutated.

Learn more about <a href="https://github.com/mardix/restated" target="_blank">**RESTATED**</a>

---

This is how we can use shared state with reStated.

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';
  import reStated from '//unpkg.com/restatedjs';

  const store = reStated({
    state: {
      name: (state) => state.account.name || '',
      account: [],
    },

    changeName(state, name) {
      state.name = name;
    },

    async loadAccount(state) {
      state.status = 'loading';

      const resp = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const data = await resp.json();

      // will be shared as this.$store.account
      state.account = data;

      state.status = 'done';
    },
  });

  // #rootA
  reLiftHTML({
    el: '#rootA',
    data: {},
    $store: store,
    loadAccount() {
      this.$store.loadAccount();
    },
  });

  // #rootB
  reLiftHTML({
    el: '#rootB',
    data: {},
    $store: store,
  });
</script>

<div id="rootA">
  Hello {this.$store.name}!

  <button @call="loadAccount">Load Account</button>
</div>

<div id="rootB">
  <h2>Companies</h2>
  <ul r-if="this.$store.account.company">
    <li r-for="item in Object.keys(this.$store.account.company)">{this.$store.account.company[item]}</li>
  </ul>
</div>
```
