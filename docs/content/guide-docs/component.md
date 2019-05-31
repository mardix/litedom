## Component

[TOC]

**reLift-HTML** turns your application into smaller composable fully compliant **Web Component** (Custom Element + Shadow DOM), which can be used as embeddable elements or Custom Elements with Custom Tags to be reused.

### Embeddable Elements

_Embeddable Elements_ is set in place by using the current DOM element section to turn it into reactive. An emebeddable element is not intended to be reused. It also requires the `el` to be set.

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',
    data: {
      world: 'World',
    },
  });
</script>

<div id="root">
  Hello {this.world}
</div>
```

### Custom Element

_Custom Element_ is set using a Custom Tag, which can be reused in multiple places. And also, as Custom Element, it allows you to place your component in an external JS file.

Unlike embeddable element, Custom Element requires a `tagName` and a `template` to

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    template: `Hello {this.world} {this.prop.name}! <br>`,
    tagName: 'hello-world',
    data: {
      world: 'World',
    },
  });
</script>

<!-- usage -->

<hello-world name="Mardix"></hello-world>

<hello-world name="Sebastien"></hello-world>

<hello-world name="Samien"></hello-world>
```

### Initialize

The recommended way to import **reLift-HTML** is via ESM javascript, where we specify the type `module` in the script tag, and we import it from **unpkg.com**

Make sure `type="module"` exists in the script tag (`<script type="module">`).

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML((options = object | array));
</script>
```

or

```html
<script type="module" src="$PATH/script.esm.js"></script>
```

### Configurations

`reLiftHTML` function accepts one argument which can be of:

**Object**: as a plain object, it contains the config to create and initialize the element.

```js
reLiftHTML({
  template: '...',
  tagName: 'component-x',
});
```

**Array**: as an array, it accepts an array of configs, to create and initialize multiple elements at once.

```js
const componentA = {
  template: '...',
  tagName: 'component-a',
};
const componentB = {
  template: '',
  tagName: 'component-b',
};

reLiftHTML([componentA, componentB]);
```

#### Config Properties

#### **`el`**:

[*string|HTMLElement*]
To be used mainly when creating Embeddable Elements.

This is where the view instance will be created and rendered. By default, it will use the innerHTML of the element as `template`.
This can be html selector , ie `#someId`, `[some-data-attribute]`. Or a query selector `document.querySelector('#myId')`.

#### **`tagName`**:

[*string*]
Name for the new custom element. Note that custom element names must contain a hyphen. `my-counter` will be used as `<my-counter></my-counter>`

#### **`data`**:

[*object*]
Is the application state. All data in here are reactive. Whenever a property is added, updated or removed it will trigger the update of the DOM (if necessary).
Values are expected to be the type string, number, plain object, boolean, null, undefined or _function_.
In the case of a function, it will become a computated data.

#### **`created`**

[*function*]
This is a lifecycle hook method. It runs once the component is added on the page.

#### **`updated`**

[*function*]
This is a lifecycle hook method. It runs each time the data or the store update the component's state.

#### **`removed`**

[*function*]
This is a lifecycle hook method. It runs once the component is removed from the page.

#### **`template`**

[*string*]
A string/text for the body of the element. It contains all the markup to be displayed. When creating Custom Element.

#### **`asTemplate`**:

[*boolean:false*]
To be used along with `el`, when set to `true` it will turn the component into the Custom Tag to be used.

#### **`isShadow`**:

[*boolean:false*]
By default elements are created as normal Custom Element. To set the web component as Shadow Dom, set `isShadow` to `true`.

#### **`$store`**:

[*state management interface*]
Unlike `data` store is where to hook a shared store manager, ie: reStated, Redux. The store instance must have the methods `getState()` and `subscribe(callback:function)`.

### Methods

Along the lifecycle methods `created` and `mounted`, you have the ability to define your own methods.

The defined methods are set with the rest of the options.

**WARNING**:
When creating methods don't use arrow functions such as `created: () => this.sayHello(),`. Since arrow function doesn't have a `this`, `this` will be treated as any other variable and will often result in error such as `Uncaught TypeError: Cannot read property of undefined` or `Uncaught TypeError: this.myMethod is not a function`

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#root',
    data: {},
    created() {
      this.sayHello('reLiftHTML');
    },
    sayHello(name) {
      console.log(`Hello ${name}`);
    },
  });
</script>

<div id="root"></div>
```

### Properties

Inside of the lifecycle and defined methods, you have access to the following properties:

#### **`this.el`**

Is the instance root element. It allows you to safely query, manipulate the instance's DOM elements.

```js
reLiftHTML({
  // will run each time there is a re-render
  updated() {
    const allLis = this.el.querySelectorAll('li');
    console.log(allList.length);
  },
});
```

#### **`this.data`**

Gives you access to the reactive `data`. You can get, set and delete properties.
Whenever a `data` is updated it will trigger re-render (if necessary). You don't have to pre define a property in `data` to make it reactive.

```js
reLiftHTML({
  data: {
    name: '',
  },
  methodA() {
    this.data.name = 'Mardix'; // setter
    console.log(this.data.location); // getter
    this.data.myArray = [];
    this.data.myArray.push(1);
    console.log(this.data.myArray.length);
  },
});
```

#### **`this.prop`**

Props are the attributes that were set during initialization

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    tagName: `my-counter`,
    template: `Counting: {this.count}`,
    data: {
      count: 0,
    },
    created() {
      this.data.count = this.prop.start || 0;

      setTimeout(() => {
        this.data.count++;
      }, 1000);
    },
  });
</script>

<my-counter start="5"></my-counter>
```

#### **`this.render`**

A function to manually re-render.

```js
reLiftHTML({
  methodA() {
    /* do something, then... */
    this.render();
  },
});
```

#### **`...this.$defined-methods`**

The other methods you have defined

```js
reLiftHTML({
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
