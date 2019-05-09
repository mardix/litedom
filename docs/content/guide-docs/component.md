## Component

[TOC]

**reLift-HTML** allows you to split up your application into smaller, composable parts called components. The components are full web components standards. They can be either just Custom Element or Shadow DOM



During the initilization process, reLift-HTML needs to prepare the HTML to template literals, setup data observation, setup event listeners, do the first update of the DOM, runs lifecycle hooks.


### Setup

Setting up an instance starts by invoking `reLiftHTML` function, which accepts options.


```
<div id="root">

</div>

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',
    data: {

    },
    created() {
    },
    updated() {
    },
    template: null,
    store: null
  })
</script>
```

### Options

Every instance creation accepts the following options, with `el` being required.


#### **`el`**
REQUIRED [string|HTMLElement] 
This is where the view instance will be created and rendered. By default, it will use the innerHTML of the element as template.
This can be html selector , ie `#someId`, `[some-data-attribute]`. Or a query selector `document.querySelector('#myId')`. 


####  **`data`**
[object]
Is the application state. All data in here are reactive. Whenever a property is added, updated or removed it will trigger the update of the DOM (if necessary).
Values are expected to be the type string, number, plain object, boolean, null, undefined or *function*. 
In the case of a function, it will become a computated data.

#### **`created`**
[function]
This is a lifecycle hook method. It runs once the component is added on the page. 

#### **`updated`**
[function]
This is a lifecycle hook method. It runs each time the data or the store update the component's state. 

#### **`removed`**
[function]
This is a lifecycle hook method. It runs once the component is removed from the page. 

#### **`template`**
[string] 
A string/text that will be rendered in the `el` instance. By default the innerHTML of `el` will be used, but setting `template` allows you to provide your own template, and will overwrite the default behavior.  

#### **`$store`**: 
[state management interface]
Unlike `data` store is where to hook a shared store manager, ie: reStated, Redux. The store instance must have the methods `getState()` and `subscribe(callback:function)`. 


### Methods

Along the lifecycle methods `created` and `mounted`, you have the ability to define your own methods.

The defined methods are set with the rest of the options.

**WARNING**: 
When creating methods don't use arrow functions such as `created: () => this.sayHello(),`. Since arrow function doesn't have a `this`, `this` will be treated as any other variable and will often result in error such as `Uncaught TypeError: Cannot read property of undefined` or `Uncaught TypeError: this.myMethod is not a function` 

```
<div id="root">
</div>

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',
    data: {},
    created() {
      this.sayHello('reLiftHTML');
    },
    sayHello(name) {
      console.log(`Hello ${name}`)
    },

  })
</script>
```


### Properties

Inside of the lifecycle and defined methods, you have access to the following properties:

#### **`this.el`**
Is the instance root element. It allows you to safely query, manipulate the instance's DOM elements.

```js
  reLiftHTML({
    el: '#root',

    // will run each time there is a re-render
    updated() {
      const allLis = this.el.querySelectorAll('li');
      console.log(allList.length);
    }
  })
```

#### **`this.data`** 
Gives you access to the reactive `data`. You can get, set and delete properties.
Whenever a `data` is updated it will trigger re-render (if necessary). You don't have to pre define a property in `data` to make it reactive.


```js
  reLiftHTML({
    el: '#root',
    data: {
      name: ''
    },
    methodA() {
      this.data.name = 'Mardix'; // setter
      console.log(this.data.location) // getter
      this.data.myArray = [];
      this.data.myArray.push(1);
      console.log(this.data.myArray.length);
    }
  })
```

#### **`this.props`**

Props are the attributes that were set during initialization

```html
  <my-counter start=5></my-counter>

  <script>
  reLiftHTML({
    el: '#root',
    data: {
      count: 0
    },
    created() {
      this.data.count = this.props.start || 0;
      setTimeout(_=> { this.data.count++; }, 1000)
    }
  })  
  
  </script>
```


#### **`this.render`**
A function to manually re-render.

```js
  reLiftHTML({
    el: '#root',
    methodA() {
      /* do something, then... */
      this.render();
    }
  })
```

#### **`...this.$defined-methods`** 

```js
  reLiftHTML({
    el: '#root',
    methodA() {
      this.methodB();
    },
    methodB() {
      this.methodC();
    }
    methodC() {
      console.log(`I'm method C :)`)
    }
  })
```