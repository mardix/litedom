# Litedom


![npm (tag)](https://img.shields.io/npm/v/litedom/latest.svg?style=flat-square) ![Travis (.org) branch](https://img.shields.io/travis/mardix/litedom/master.svg?style=flat-square) [![gzip bundle size](http://img.badgesize.io/https://unpkg.com/litedom@latest/dist/litedom.es.js?compression=gzip&style=flat-square)](https://unpkg.com/litedom) ![NPM](https://img.shields.io/npm/l/litedom.svg?style=flat-square)

---

**Full Documentation**: https://litedom.js.org/ 

Discord/Chat: https://discord.gg/r3HqNYy

---

**Litedom** is an elegant Web Component library. 

At ~3.5kb gzip, it allows you to create Web Components/Custom Elements easily. Litedom can effortlessly be added into exitsing HTML page without the need to bring in the bloat of big frameworks.

With Litedom, you can create your own custom tag element to be reused throughout the application. 

Components created with Litedom are reactive. Litedom provides an internal state manager, a simple progressive templating language by leveraging Javascript Template Literals, provides a one way data flow, has two-way data biding and events handling, lifecycle, directives, stylemaps. It has no dependecies, no virtual DOM, no JSX, No build tool.

**Litedom** follows the Web Component V1 specs, which allows you to have Shadow Dom Spec, Custom Element Spec, HTML Template Spec and ES Module Spec. It is compatible with all modern browsers that support ES2015 (ES6), ESM (ES Module), Proxy, etc. 

**Litedom** is set to be easy, simple, and straightforward.

---

#### Example 1

A simple example that showcases how quickly a custom element can be created with full reactivity.

```html

<script type="module">
  import Litedom from '//unpkg.com/litedom';
  
  Litedom({
    tagName: 'hello-world',
    template: 'Hello {this.prop.name}!'
  });
</script>


<!-- Will display 'Hello Mardix!' -->
<hello-world name="Mardix"></hello-world>

```

#### Example 2

This example showcases a counter which contains a lifecycle.

```html

<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    // custom tag name
    tagName: 'my-counter',
    // template
    template: `Counting: {this.count}`,
    // reactive data
    data: {
      count: 0
    },
    // lifecycle method
    created(){
      // this.prop.start, properties from the element
      this.data.count = this.prop.start || 0;
      setInterval(_=> {
        this.data.count++;
      }, 1000)
    }
  });
</script>


<!-- the count will start at 5 for this custom element -->
<my-counter start=5></my-counter>

<!-- the count will start at 21 for this custom element -->
<my-counter start=21></my-counter>

```

#### Example 3: Using in-place template

An in-place template uses the content of the HTML Element as the template and will create the Component in place to be used. Use this if you have existing section on the HTML page and want to make it reactive. 

```html

<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    // The target element
    el: '#helloWidget', 
    // The reactive data
    data: {
      name: 'Litedom'
    }
  });
</script>

<div id="helloWidget">
  <div>Hello {this.name}</div>
  <div>Today's date: {new Date().toISOString().slice(0, 10)}</div>
</div>

```

#### Example 4

This demonstrates how we can interact with an element externally with javascript by using normal query selector.

```html


<!-- the count will start at 5 for this custom element -->
<my-counter id="myCounter1" start=5></my-counter>

<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    // custom tag name
    tagName: 'my-counter',
    // template
    template: `Counting: {this.count}`,
    // reactive data
    data: {
      count: 0
    },
    increment() {
      this.data.count++;
    },
    decrement() {
      this.data.count--;
    },
    // Lifecycle, when element is removed this method will be executed
    removed() {
      console.log('Element is removed')
    }
  });

  const el = document.querySelector('#myCounter1');

  // #data shows the data
  console.log('Show Data', el.data);

  // execute #increment() method, to increment the count
  el.increment();

  // execute #decrement() method, to decrement the count
  el.decrement();

  // remove the element off the page, the #removed method will be executed
  el.remove();

</script>

```


#### Example 5 - Directives: If/Else, For, Style, Class

```html

<style>
  .somAClass {
    color: blue
  }
  .myClassB {
    color: red
  }
</style>

<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    el: '#myContainer',
    // reactive data
    data: {
      count: 0,
      carsList: ['BMW', 'Mercedes', 'Audi', 'Tesla'],
      myStyle: {
        color: 'red',
        background: 'yellow'
      }
    },
    // lifecycle method
    created(){
      // this.prop.start, properties from the element
      this.data.count = this.prop.start || 0;
      setInterval(_=> {
        this.data.count++;
      }, 1000)
    }
  });

</script>

<div id="myContainer">

  <div>Counting {this.count}</div>

  <!-- if/else -->
  <div :if="this.count > 10">The count is greater than 10</div>
  <div :else>At least 10</div>

  <!-- for loop -->
  <ul>
    <li :for="car in this.carsList">{car}</li>
  </ul>

  <!-- style map -->
  <div :style="this.myStyle">
    The background will be yellow, the font will be red
  </div>

  <!-- Class -->
  <div :class="someClassA: this.count === 7; myClassB: this.count === 10">
    Will have .someClassA if count is 7, 
    will then have .myClassB when count is 10
  </div>
</div>

```

#### Example 6 - Two Way Data Binding + Computed Data

```html

<script type="module">
  import Litedom from '//unpkg.com/litedom';

  Litedom({
    el: '#myContainer',
    data: {
      name: '',
      lastName: '',
      fullName(state) {
        return `${state.name} ${state.lastName}`
      }
    }
  });

</script>

<div id="myContainer">
  Hello {this.name}. Your fullname is {this.fullName}

  <!-- as you type it will update #data.name -->
  <div><input type="text" @bind="name"></div>
  <div><input type="text" @bind="lastName"></div>

</div>

```

#### Example 7: Event Handling

```html
<script type="module">
  import Litedom from '//unpkg.com/litedom';
  
  Litedom({
    el: '#counterWidget',
    data: {
      count: 0
    },
    up() {
      this.data.count++;
    },
    down() {
      this.data.count--;
    }
  });

</script>



<div id="counterWidget">
  <h4>{this.count}</h4>

  <div>
    <button @click="down" class="button-outline">DOWN</button>
    <button @click="up" class="button-outline">UP</button>
  </div>

</div>



```


#### Example 8: Components in component

This is a more advanced example that showcases the usage of components in component. Also includes a for-loop

```html
<style style type="text/css">
  .circle {           
    border: thin solid black;
    border-radius: 60px;
    width:100px;
    height:100px;
    text-align: center;
    margin-bottom: 10px;
  }
</style>

<script type="module">
  import Litedom from '//unpkg.com/litedom';
  
  const circleComponent = {
    tagName: 'comp-circle',
    template: `
      <div class="circle">
        <span></span>
      </div>
    `,
    created() {
      this.el.querySelector('div').style.backgroundColor = this.prop.color;
    }
  }

  const mainComponent = {
    el: '#mainComponent',
    data: {
      colors: [
        '#ff0000',
        '#00ff00',
        '#ffff00'
      ]
    }
  }

  // Initialize all in one call
  Litedom([mainComponent, circleComponent]);

</script>

<div id="mainComponent">
  <comp-circle 
    :for="color, index in this.colors" 
    :key="{index}" 
    color="{color}">
  </comp-circle>
</div>

```

---

**Litedom** has no dependencies, no virtual DOM, and build tool; It suits developers who want something small, light, and simple but still follow the paradigm of the major libraries; For developers working on simple but dynamic static sites; When having React/Vuejs/Angular/(etc) is too much or when you just want to progressively upgrade your site without changing too much.

**Features**: Web Components, Custom Element, Template Literals, Reactive, Data Binding, One Way Data Flow, Two-way data binding, Event Handling, Props, Lifecycle, State Management, Computed Properties, Directives, Style Map and more.


**Litedom** turns the template into template string literal and doesn't have a virtual DOM, therefor it doesn't keep a DOM tree in memory. Instead it relies on the real DOM, and only mutates it in place whenever there is change. This tends to be memory efficient, and also reduces GC activities

---

## Compatibility

**Litedom** is a modern library for moden browsers that support ES2015 (ES6), Template Literals, Proxy, and all the fun stuff.

The library is written in ES2015, and will be delivered to you as such. To keep it small Litedom doesn't have any polyfills nor extra code to make new ES20xx features available in non modern browsers and will not work with browsers that don't support ES6, Template Literals, Proxy, etc. 

https://caniuse.com/#feat=es6

https://caniuse.com/#search=proxy

---

## Installation

The best way to import **Litedom** is via ESM JavaScript, where we specify the type as module, and we import it from **unpkg.com** 

Make sure `type="module"` exists in the script tag.

```html
<script type="module">
  import Litedom from '//unpkg.com/litedom';
  
  ...
</script>
```

Or by installing in your project

```
npm install litedom
```

```js
import Litedom from 'litedom';
```

---

## Usage

We will be using the ESM way, but the same applied if you were to install it via npm

```html
  <script type="module">
    import Litedom from '//unpkg.com/litedom';
    
    Litedom({
      el: '#counterWidget',
      data: {
        count: 0
      },
      up() {
        this.data.count++;
      },
      down() {
        this.data.count--;
      }
    });

  </script>

  <div class="container">
    <div class="row">
      <div class="column center">
        <h3 class="title">Counter</h3>
      </div>
    </div>
    <div class="row">
      <div class="column center" id="counterWidget">
        <div><h4>{this.count}</h4></div>
        <div>
          <button @click="down" class="button-outline">DOWN</button>
          <button @click="up" class="button-outline">UP</button>
        </div>
      </div>
    </div>
  </div>

```

The script above shows how easy it is to create a counter that goes UP or DOWN each time is clicked. You can try it yourself: https://jsfiddle.net/hdfup3cg/ 

---

## Documentation

Please refer to the full documentation site:

https://litedom.js.org 

---


## FAQ

#### How big is Litedom?

Litedom is very small. gzip: **~3.5kb**


#### Why yet another JavaScript library?

I'm an UI Tech Lead Application Engineer at Bank of America, who deals with many static sites, and see how stuff can sometimes be frustrating for team members when it come to choices. 

So, one week-end afternoon (4/20 weekend 2019 :), while working on a personal project using a static site generator, I thought it was way too much of an overhead to bring in something like Vue, React or Angular, just to make a small piece reactive on the personal static site. 

So I decided to create Litedom, to just be a simple drop-in view library that can make any sections of the site reactive without the overhead. I wanted my HTML to stay as is. No React, No Vue, just my HTML and me.

(BTW, See how many days since the last JavaScript framework: https://dayssincelastjavascriptframework.com/)

#### Who and when would someone use it?

- People who want something simple but still follow the paradigm of the major libraries
- For people working on simple but dynamic static site
- For blogs site 
- When having React/Vue/Angular/(etc.) is too much
- When you just want to progressively upgrade your site without changing too much.


#### Is it here to replace or does it compete with React, Vue etc?

Not at all. **Litedom** is targeting a different set of applications. Most of the time, specially when dealing with static site, you just want a little bit of stuff to be reactive, it could be something from or to an API, it could be something to manage application state or events.

Litedom wants to be your gateway to more advanced frameworks.

It follows the same paradigm as the big ones, just on a smaller scale.  


#### Features

- Very small
- Web Components (Custom Elements + Shadow DOM)
- Template literals
- Directives
- Data binding
- Two-way data binding (one way data flow)
- Computed properties
- Event Handling
- Lifecycle
- State management
- Stylemap
- HTML stays as is
- No JSX 
- No dependencies
- No virtual DOM
- No need for CLI
- No build, the real DOM does it!
---

### About Me

I'm Mardix, an inventor, a creator and a UI Tech Lead Application Engineer at Bank of America, in Charlotte, NC, USA.  

I love to invent stuff. I love to make stuff. I love UI. I love JavaScript. I love Python.

If you have any suggestions, questions or anything, please don't hesitate to reach out.

---

### Shout Out!

Litedom is using some of the work of these great libraries:

https://github.com/bryhoyt/emerj 

https://github.com/sindresorhus/on-change

--- 

License: MIT

Copyright (c) 2019-Forever Mardix
