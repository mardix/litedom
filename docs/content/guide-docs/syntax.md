
## Syntax

[TOC]

### Create Custom Element

Custom Element create reusable element by specifying a `tagName` (custom tag).


```html
<script type="module">
  import Litedom from '//unpkg.com/litedom';

  const template = `
    Counting {this.count}
  `;

  Litedom({
    template,
    tagName: `my-counter`,
    data: {
      count: 0
    },
    created() {
      this.data.count = this.prop.start || 0;
      setInterval(_=> {
        this.data.count++;
      }, 1000)
    }
  })
</script>

<!-- HTML -->

<!-- this will start at 5 -->
<my-counter start=5></my-counter>

<!-- this will start at 13 -->
<my-counter start=13></my-counter>

```


### Create Inline Element

Inline element gets created if a `tagName` was not provided, and the `el` is refering to the element on the page. 


```html
<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    el: `#root`,
    data: {
      count: 0
    },
    created() {
      setInterval(_=> {
        this.data.count++;
      }, 1000)
    }
  })
</script>

<!-- HTML -->
<!-- this will be relifted and shown in place -->
<div id="root">
  Hello I'm inline and counting: {this.count}
</div>

```

### Text/Data Binding

Expression are placed within `{...}` and are updated whenever the `data` values are changed, making `data` reactive.

```html

<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    el: `#root`,
    data: {
      name: 'Litedom',
      license: 'MIT',
      timestamp: Date.now()
    }
  })
</script>

<!-- HTML -->
<div id="root">
  <div>Library: {this.name}</div>
  <div>License: {this.license}</div>
  <div>Timestamp: {this.timestamp}</div>

  <div>Template literal evaluation {1 + 1}</div>

  <!-- real template literal, can do everything -->
  <div>Library Upper: {this.name.toUpperCase()}</div>

  <!-- with HTML data attribute -->
  <div data-license="{this.license}">{this.license.toUpperCase()}</div>
</div>

```




### If/Else Conditional

For conditional use `:if` and `:else`

```html

<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    el: `#root`,
    data: {
      count: 0
    },
    created() {
      setInterval(_=> {
        this.data.count++;
      }, 1000)
    }
  })
</script>

<!-- HTML -->
<div id="root">
  Hello I'm inline and counting: {this.count}

  <span :if="this.count % 2 === 0">This Even</span>
  <span :else>This Odd</span>

</div>

```

### For loop

For For-loop use `:for`

```html
<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    el: `#root`,
    data: {
      items: [
        'bread',
        'butter',
        'sugar',
        'drink',
        'cake'
      ]
    }
  })
</script>

<!-- HTML -->
<div id="root">
  <h2>This is the list</h2>

  <ul>
    <li :for="item in this.items">I want {item}</li>
  </ul>

</div>

```


### Event Listeners: @event-name

To create an event listener, use `@$event-name` as an attribute in the element. 

```html
<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    el: `#root`,
    sayHello(event) {
      console.log('Hello World!')
    }
  })
</script>

<!-- HTML -->
<div id="root">
  <a @click="sayHello" href="#">Say Hello!</a>
</div>

```

### Two-Way Data Binding

Two-way data binding is set on form elements, with `@bind` pointing to the data to be updated. 

```html
<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    el: `#root`,
    data: {
      name: ''
    }
  })
</script>

<!-- HTML -->
<div id="root">
  <div>Name: {this.name}</div>

  <div>Enter name: <input type="text" @bind="name"></div>
</div>

```


### Lifecycle

Lifecycle put some hooks on the component and get executed based on what happens

```html
<script type="module">
  import Litedom from '//unpkg.com/litedom';

  const template = `
    Counting {this.count || 'no count'}
  `;

  Litedom({
    template,
    tagName: `my-counter`,
    created() {
      // runs once, when the element is added
    },
    updated() {
      // run each time the dom is updated from the data
    },
    removed() {
      // when the element is removed from the page
    }
  })
</script>

```