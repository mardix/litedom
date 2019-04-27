
## Shared State

[TOC]

---

reLift-HTML comes with a shared state manager called **reLiftState**, it allows
to share state between multiple instances of the reLiftHTML.

`reLiftState(state={}, mutators={})`

```
  <script type="module">
    import {reLiftState} from 

    const store = reListState(
        {
          name: '',
          lastName: '',
          fullName(state) => `${state.name} ${state.lastName}`
        },
        {
          changeName(state, name) {
            state.name = name;
          },
          changeLastName(state, lName) {
            state.lastName = lName;
          }
        }
    );

  </script>
```

---

# reLiftState

An ambitiously small state management library that follows the Flux pattern.

Inspired by Redux and Vuex, **reLiftState** removes the boilerplate
and keep it simple and flat. 

Unlike Redux, you don't need to return a new immutable object. 
You can mutate the state in place, and you definitely don't need to define a reducer. 
The action mutator is both your action and your reducer "at the same damn time" (Future's song)

Unlike Vuex, you don't need to have actions and mutations. 
You can only mutate the state via your actions mutators which are 
just function that pass as first argument the current state to be mutated.

Also via *selectors* **reLiftState** allows to you select part of the state to create new properties in the state.

And of course you can *subscribe* to the changes in the store.


---

## Features:
- **Flux pattern**: only one way data flow
- **mutators**: update the state in place
- **selectors**: select properties of the state to create new properties
- **subscription**: subscribe to changes in the store

---


### Create the store

```
import reLiftState from 'reLiftState-lib';
// import {reLiftState} from '//unpkg.com/relift-html';;

const store = reLiftState(
  // Initial state and selectors   
  {
    firstName: '',
    lastName: '',
    count: 0,

    // Selectors
    fullName(state) => `${state.firstName} ${state.lastName}
    
  }, 

  // Action mutators. The only place to mutate the state
  {
    setFirstName(state, firstName) {
      state.firstName = firstName;
    },
    setLastName(state, lastName) {
      state.lastName = lastName;
    },

    // Example on how to update an async state, with multiple status
    async makeAjaxCall(state, url) {
      state.pending = true; // The state will be mutated
      state.data = await fetch(url);
      state.pending = false; // The state will be mutated
    },

    // Other action mutators
    inc(state) => state.count++,
    dec(state) => state.count--,
  }

)

```

### Run actions mutators

Action mutators are functions that can mutate the state in place.

Action mutators can also be chained.

```
  store.setFirstName('Mardix');
  store.setLastName('M.')

  store.inc(); // will increment the count
  store.dec(); // will decrement the count

  // chainable
  store
    .inc()
    .makeAjaxCall()
    .dec();
  
```

### Restrieve the state

`reLiftState.$getState()` returns the state

```
  const myFullName = store.$getState().fullName;
  const firstName = store.$getState().firstName;
  console.log('Total count', store.$getState().count);

```

### Subscribe to changes

`reLiftState.$subscription(listener:function)` lets you listens to changes in the store

```

  const sub = store.$subscribe(state => {
    console.log(`I'm updated ${state.count}`)
  });

```

### Unsubscribe to changes

```
  const sub = store.$subscribe(state => {
    console.log(`I'm updated ${state.count}`)
  });

  // This will unsubscribe
  sub();

```

### Selectors

Selectors are function that select part of the state to create new properties. 
They are function defined along with the initial  state. 
The selected value will be assigned to the function's name

```
{
  // Initial state
  firstName: '',
  lastName: '',

  // Selectors
  fullName(state) => `${state.firstName} ${state.lastName}`
  ...
}
```

A new property `fullName` will be assigned to the state and will contain the 
returned value.


---
