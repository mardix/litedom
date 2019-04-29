
## Lifecycle

[TOC]

For every instance that gets created, reLift-HTML provides two lifecycle methods that get added during the initialization.

All lifecycle methods have:

#### Properties

{% include "guide-docs/_method-properties.md" %}

### created

`created` runs **once** on `DOMContentLoaded`. At the time of running, the DOM is ready, you can query elements. 

It is also the place to initialize some async call, ajax etc.

```
  reLiftHTML({
    el: '#root',
    data: {

    },
    created() {
      //... code here
    }
  })
```

#### Example with async

```
  reLiftHTML({
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

```
  reLiftHTML({
    el: '#root',
    data: {

    },
    updated() {
      //... code 
    }
  })
```

#### Example of count LI

```
  reLiftHTML({
    el: '#root',
    data: {
      totalLis: 0
    },
    updated() {
      const lis = this.el.querySelectorAll('li');
      this.data.totalLis = lis.length;
    }
  })
```