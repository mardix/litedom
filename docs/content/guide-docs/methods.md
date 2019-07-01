## Methods

[TOC]

You can define your own methods in the instance. 

Method can be used to be accessed by other methods via `this.$method-name(...args)`, or can be used as events methods in the instance of `@click="$method-name"`


#### Properties

{% include "content/guide-docs/_method-properties.md" %}

### Defined Method

The example below showcases how methods can be used.

```js

<div id="root">
  <a @click="sayHello" href="#">Say Hello!</a>

  <input 
    type="text" 
    name="color" 
    @call="changeColor" 
    $value="this.defaultColor"
  > 

</div>

<script type="module">

  Litedom({
    el: '#root',
    data: {
      defaultColor: '#FFFFFF'
    },

    sayHello(event) {
      console.log('Hello World!');
    },

    changeColor(event) {
      const color = event.target.value;
      this.setBgColor(color);
    },

    setBgColor(color) {
      this.el.style.background = color;
    },

  })

</script>

```


### Async method

You can also setup Async methods with the `async/await`. 


```js

  Litedom({
    el: '#root',
    
    async loadData() {
      this.data.status = 'loading...';
      const data = await fetch('url');
      const data = await resp.data;
      this.data.status = 'loading completed!';
    },

    async created(event) {
      await this.loadData();
    },

  })


```