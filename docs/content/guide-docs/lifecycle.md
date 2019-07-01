
## Lifecycle

[TOC]

For every instance that gets created, Litedom provides two lifecycle methods that get added during the initialization.

All lifecycle methods have:

#### Properties

{% include "content/guide-docs/_method-properties.md" %}

### created

`created` runs **once** when the Custom Element is added to the page. At the time of running, the DOM is ready, you can query elements. 

It is also the place to initialize some async call, ajax etc.

```js
  Litedom({
    created() {
      //... code here
    }
  })
```

#### Example with async

```js
  Litedom({
    el: '#root',
    data: {
      loading: false,
      loaded: false,
      results: []
    },
    async created() {
      // Could be used on the page to show spinner
      this.loading = true;
      this.loaded = false;

      const data = await fetch('some-url');
      const result = await data.json();
      this.data.results = results;

      // Tell the page everything is good to go
      this.loading = false;
      this.loaded = true;      
    }
  })
```

### updated

`updated` runs only each time the state updates the DOM. This is a place to do any computations after an update.

```js
  Litedom({
    updated() {
      //... code 
    }
  })
```

#### Example of count LI

```js
  Litedom({
    data: {
      totalLis: 0
    },
    updated() {
      const lis = this.el.querySelectorAll('li');
      this.data.totalLis = lis.length;
    }
  })
```

### removed

`removed` runs **once** when the Custom Element is removed from the page.

It is also the place to do some cleanup, remove intervals etc.

```js
  Litedom({
    removed() {
      //... code here
    }
  })
```