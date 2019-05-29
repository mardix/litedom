# reLift-HTML


![npm (tag)](https://img.shields.io/npm/v/relift-html/latest.svg?style=flat-square) ![Travis (.org) branch](https://img.shields.io/travis/mardix/relift-html/master.svg?style=flat-square) [![gzip bundle size](http://img.badgesize.io/https://unpkg.com/relift-html@latest/dist/relift-html.esm.js?compression=gzip&style=flat-square)](https://unpkg.com/relift-html) ![NPM](https://img.shields.io/npm/l/relift-html.svg?style=flat-square)

---

**Full Documentation**: https://relift-html.js.org/ 

Discord/Chat: https://discord.gg/uaRFsT 

---

**reLift-HTML** is very small (3kb) view library that allows you to create Web Component, Custom Element, and helps you make any HTML page reactive without the bloat of big frameworks. 

**reLift-HTML** is very close to standard, uses Javascript Template Literals as the template and is compatible with all modern browsers that support ES2015 (ES6), ESM (ES Module), Proxy etc.

```html

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';
  reLiftHTML({
    template: `Counting: {this.count}`,
    tagName: 'my-counter', // custom tag
    data: {
      count: 0
    },
    created(){
      this.data.count = this.prop.start || 0;
      setInterval(_=> {
        this.data.count++;
      }, 1000)
    }
  })
</script>


<!-- the count will start at 5 for this custom element -->
<my-counter start=5></my-counter>

<!-- the count will start at 21 for this custom element -->
<my-counter start=21></my-counter>

```

**reLift-HTML** has no dependencies, no virtual DOM, and build tool; Which will fit best with developers who want something small, light, and simple but still follow the paradigm of the major libraries; With developers working on simple but dynamic static site; When having React/Vuejs/Angular/(etc) is too much or when you just want to progressively upgrade your site without changing too much.

**Features**: Web Components, Custom Element, Template Literals, Reactive, Data Binding, One Way Data Flow, Two-way data binding, Event Handling, Props, Lifecycle, State Management, Computed Properties, Directives and more.


**reLift-HTML** turns the template into template string literal and doesn't have a virtual DOM, therefor it doesn't keep a DOM tree in memory. Instead it relies on the real DOM, and only mutates it in place whenever there is change. This tends to be memory efficient, and also reduces GC activities


---

### Second Example, Inline Element


```html

<div id="helloWidget">
  <div>Hello {this.name}</div>
  <div>Today's date: {new Date().toISOString().slice(0, 10)}</div>
</div>

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';

  reLiftHTML({
    el: '#helloWidget',
    data: {
      name: 'reLiftHTML'
    }
  });
</script>
```

Please notice the `type="module"` in the script tag, it is required when using ES Module.

---

## Compatibility

**reLift-HTML** is a modern library for moden browsers that support ES2015 (ES6), Template Literals, Proxy, and all the fun stuff.

The library is written in ES2015, and will be delivered to you as such. To keep it small reLift-HTML doesn't have any polyfills nor extra code to make new ES20xx features available in non modern browsers, therefor it will not work with browsers that don't support ES6, Template Literals, Proxy, etc. 

https://caniuse.com/#feat=es6

https://caniuse.com/#search=proxy

---

## Installation

The best way to import **reLift-HTML** is via ESM JavaScript, where we specify the type as module, and we import it from **unpkg.com** 

Make sure `type="module"` exists in the script tag.

```html
<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';
  
  ...
</script>
```

Or by installing in your project

```
npm install relift-html
```

```js
import reLiftHTML from 'relift-html';
```

---

## Usage

We will be using the ESM way, but the same applied if you were to install it via npm

```html
  <script type="module">
    import reLiftHTML from '//unpkg.com/relift-html';
    
    reLiftHTML({
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

https://mardix.github.com/relift-html 

---


## FAQ

#### How big is reLift-HTML?

reLift-HTML is very small. gzip: **~3kb**


#### Why yet another JavaScript library?

I'm an UI Tech Lead Application Engineer at Bank of America, NA, who deals with many static sites, and see how stuff can sometimes be frustrating for team members when it come to choices. 

So, one week-end afternoon (4/20 weekend 2019 :), while working on a personal project using a static site generator, I thought it was way too much of an overhead to bring in something like Vue, React or Angular, just to make a small piece reactive on the personal static site. 

So I decided to create reLift-HTML, to just be a simple drop-in view library that can make any sections of the site reactive without the overhead. I wanted my HTML to stay as is. No React, No Vue, just my HTML and me.

(BTW, See how many days since the last JavaScript framework: https://dayssincelastjavascriptframework.com/)

#### Who and when would someone use it?

- People who want something simple but still follow the paradigm of the major libraries
- For people working on simple but dynamic static site
- For blogs site 
- When having React/Vue/Angular/(etc.) is too much
- When you just want to progressively upgrade your site without changing too much.


#### Is it here to replace or does it compete with React, Vue etc?

Not at all. **reLift-HTML** is targeting a different set of applications. Most of the time, specially when dealing with static site, you just want a little bit of stuff to be reactive, it could be something from or to an API, it could be something to manage application state or events.

reLift-HTML wants to be your gateway to more advanced frameworks.

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

reLift-HTML is using some of the work of these great libraries:

https://github.com/bryhoyt/emerj 

https://github.com/sindresorhus/on-change

--- 

License: MIT

Copyright (c) 2019 Mardix
