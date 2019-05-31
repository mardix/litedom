## Methods

[TOC]

You can define your own methods in the instance.

Method can be used to be accessed by other methods via `this.$method-name(...args)`, or can be used as events methods in the instance of `@click="$method-name"`

#### Properties

{% include "guide-docs/_method-properties.md" %}

### Defined Method

The example below showcases how methods can be used.

```html
<div id="root">
  <button @click="sayHello">Say Hello!</button>

  <input type="text" name="color" @call="changeColor" r-value="this.defaultColor" />
</div>

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',
    data: {
      defaultColor: '#fff',
    },

    sayHello(event) {
      console.log('Hello World!');
    },

    changeColor(event) {
      const color = event.target.value;
      this.setBgColor(color);
    },

    setBgColor(color) {
      this.el.children.root.style.background = color;
    },
  });
</script>
```

### Async method

You can also setup Async methods with the `async/await`.

```js
<div id="root">
  {this.status}
</div>

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',

    async loadData() {
      this.data.status = 'loading...';

      await fetch('https://jsonplaceholder.typicode.com/todos/1').then((r) => r.json());

      this.data.status = 'loading completed!';
    },

    async created(event) {
      await this.loadData();
    },
  });
</script>
```
