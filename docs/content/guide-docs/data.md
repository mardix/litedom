## Data

[TOC]

Data is at the core of the instance's reactivity. Whenever data is changed, it will trigger a re-render (if necessary).

Data is usally set during the instance's setup, under the `data` options.

#### **`data`**

[object]
Is the application state. All data in here are reactive. Whenever a property is added, updated or removed it will trigger the update of the DOM (if necessary).
Values are expected to be the type string, number, plain object, boolean, null, undefined or _function_.
In the case of a function, it will become a computed data.

```js
reLiftHTML({
  data: {
    firstName: 'Mardix',
    lastName: 'M.',
    fullName: (state) => `${state.firstName} ${state.lastName}`,
  },
});
```

Data in reLift-HTML is:

- **Accessible**: in the template and methods you have direct access to the data
- **Mutable**: in the methods you can mutate the data directly without setters, ie `this.data.aNumber = 1;` or `this.data.someArray.pop();`
- **Reactive**: whenever `this.data` is updated it will trigger a re-render (if necessary)
- **Dynamic**: you don't have to pre define properties during the instance setup, you can set new properties in some other places or when needed, and automatically it will be also become reactive.

### Template

In the template you have access to data via `this.#data-property-name`, where '#data-property-name' is the property name to access.

```html
<script type="module">
  reLiftHTML({
    el: '#root',
    data: {
      name: 'reLift-HTML',
    },
    created() {
      // Dynamically added
      this.data.todaysDate = new Date().toLocaleString();
    },
  });
</script>

<div id="root">
  <p>Hello {this.name}</p>
  <p>Date: {this.todaysDate}</p>
</div>
```

#### What about **`this`**

`this` in your template indicate the root context of the data. By not putting `this`, the variable will fall under the global object, which is the `window` in the browser. With `this` we keep the data in scope.

```html
<div id="root">
  <!-- use from data -->
  {this.firstName}

  <!-- fall under the global object/window -->
  {new Date().toLocaleString()}
</div>
```

### Local state

Local state is the data that the instance will use. It is set in the `data`. Whenever it is updated, it will trigger a re-render (if necessary).

In the template you have access to it via `{this.#data-property-name}` and in your methods it's via `this.data`;

The state/data is mutable only in the methods of your instance, which means you can directly update the properties. No need for this.set(key, value) or this.get(key).

You can do this:

```js
reLiftHTML({
  el: '#root',
  data: {
    name: 'reLift-HTML',
    count: 0,
  },
  sayHello() {
    console.log(this.data.name);
  },
  changeName(name) {
    this.data.name = name;
  },
  runCounter() {
    setInterval(() => {
      this.data.count++;
    }, 1000);
  },
  created() {
    this.runCounter();
  },
});
```

### Computed state

Computed state are data that will be created based on some other input, usually from the reactive `data`. Whenever the state is updated, the computed data will also be updated. Which makes computed data reactive.

Computed data are set as function that returns a value, which will be assigned to the name of the function in the `data` object.

```js
data: {
  firstName: 'Mardix',
  lastName: 'M.',

  // computed data, will be accessed via '{this.fullName}' or 'this.data.fullName'
  fullName: (state) => `${state.firstName} ${state.lastName}`,

  // computed data, will be accessed via '{this.totalChars}' or 'this.data.totalChars'
  totalChars: (state) => state.fullName.length,
}
```

In the example above, we now can access as properties: `this.data.fullName` and `this.data.totalChars`. In the template, `{this.fullName}` and `{this.totalChars}`

NOTE 1: You can't access the computed data as functions in your code.
NOTE 2: You can't mutate the state in the computed data funcion, nor access an instance's method in the computed data function.

Computed data function accept the current state as the only argument, and must return a value. The value will be assigned in the `data` with the function name. The data provided in the computed data is not mutable.

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',
    data: {
      firstName: 'Mardix',
      lastName: 'M.',
      fullName: (state) => `${state.firstName} ${state.lastName}`,
    },
  });
</script>

<div id="root">
  <p>Hello {this.fullName}</p>
</div>
```

### Two-Way Data Binding

You can use the `@bind` directive to create two-way data bindings on form input, textarea, and select elements. It automatically picks the correct way to update the element based on the input type. `@bind` is essentially syntax sugar for updating data on user input events.

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',
    data: {
      name: '',
      salutation: '',
    },
  });
</script>

<!-- HTML -->
<div id="root">
  <div>Hello {this.salutation} {this.name}</div>

  <!---- Form ---->

  <form>
    <div>Enter name: <input type="text" @bind="name" /></div>
    <div>
      Salutation:

      <label> <input type="radio" name="salutation" @bind="salutation" value="Mr." /> Mr. - </label>

      <label> <input type="radio" name="salutation" @bind="salutation" value="Mrs." /> Mrs. </label>
    </div>
  </form>
</div>
```

### Example of making Async call

The example below illustrate how we can make async call and at the same time setting the state to make it reactive.

```html
<div id="root">
  <div r-if="this.loadingStatus === 'loading'">Loading...</div>

  <div r-if="this.loadingStatus === 'done'">
    <p>Data loading successfully!</p>

    <ul>
      <li r-for="item in this.todos">{item.title}</li>
    </ul>
  </div>
</div>

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',
    data: {
      loadingStatus: null,
      todos: [],
    },

    async loadData() {
      this.data.loadingStatus = 'loading';

      const resp = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
      this.data.todos = await resp.json();

      this.data.loadingStatus = 'done';
    },

    created() {
      this.loadData();
    },
  });
</script>
```

### Shared state

To share state with multiple instances, please refer to the <a href="#shared-state">SHARED STATE</a> section in this guide.
