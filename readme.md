# reLift-HTML


[![gzip bundle size](http://img.badgesize.io/https://unpkg.com/relift-html@latest/dist/relift-html.esm.js?compression=gzip&style=flat-square)](https://unpkg.com/relift-html)

---

Full Documentation: https://relift-html.js.org/ 

---

**reLift-HTML** is a blazing fast view library that lets you write Javascript Template Literals in HTML. (Yup! You've read that right!)

Inspired by, but unlike *lit-html* and *hyperHTML*, **reLift-HTML** makes it easy to write javascript in your HTML template using template literals. 

No need to know special React/JSX syntax or some other templaty stuff, HTML is your template. Use it the way you've used it before.

If you need some values to be reactive, just place them in the template literal `${...}`, otherwise, keep going with your plain old HTML.

Underneath, reLift-HTML will turn the html section into a modern template string literal, and upon receiving new data, it will re-render only sections that need to be rendered.

---

### First Example

```html

<div id="helloWidget">
  <div>Hello ${this.name}</div>
  <div>Today's date: ${new Date().toISOString().slice(0, 10)}</div>
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

Please notice the `type="module"` in the script tag, it is required when using ES Module


---

## Compatibility

**reLift-HTML** is a modern library for moden browsers that support ES2015 (ES6), Template Literals, Proxy, and all the fun stuff.

The library is written in ES2015, and will be delivered to you as such. To keep it small reLift-HTML doesn't have any polyfills nor extra code to make new ES20xx features available in non modern browsers, therefor it will not work with browsers that don't support ES6, Template Literals, Proxy, etc. 

https://caniuse.com/#feat=es6

https://caniuse.com/#search=proxy

---

## Installation

The best way to import **reLift-HTML** is via ESM javascript, where we specify the type as module, and we import it from **unpkg.com** 

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

  <div class="container">
    <div class="row">
      <div class="column center">
        <h3 class="title">Counter</h3>
      </div>
    </div>
    <div class="row">
      <div class="column center" id="counterWidget">
        <div><h4>${this.count}</h4></div>
        <div>
          <button @click="down" class="button-outline">DOWN</button>
          <button @click="up" class="button-outline">UP</button>
        </div>
      </div>
    </div>
  </div>


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

```

The script above shows how easy it is to create a counter that goes UP or DOWN each time is clicked. You can try it yourself: https://jsfiddle.net/hdfup3cg/ 


##### So what did we do?

We created our HTML and create and id `div#counterWidget` which will be reactive.

Interpolation:

`<h4>${this.count}</h4>` is reactive, it will be interpolated whenever the state changes

Buttons: assign events with `@click`

```
<button @click="down" class="button-outline">DOWN</button>
<button @click="up" class="button-outline">UP</button>
```

Two buttons contain: `@click="down"` and `@click="up"`. These are events directives, whenever the user click, it will run the function that is set in the reLiftHTML instance. 

On the JS side, 

```js
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
```

We assign the target element to `#counterWidget`, set the default state `data: {count: 0}`. Then created two methods `up()` and `down()`, which will be called when the user click on the button. 

That's pretty much it.

---

## Documentation

Please refer to the full documentation site:

https://mardix.github.com/relift-html 

---


## FAQ

#### How big is reLift-HTML?

reLift-HTML is very small. Gzip: **~2kb**


#### Why yet another Javascript library?

I'm a UI Tech Lead Application Engineer at Bank of America, NA,  who deals with many static sites, and see how stuff can sometimes be frustrating for team members when it come to choices. 

So, one week-end afternoon (4/20 weekend 2019 :), while working on a personal project using a static site generator, I thought it was way too much of an overhead to bring in something like Vuejs, React or Angular, just to make a small piece reactive on the personal static site. 

So I decided to create reLift-HTML, to just be a simple drop-in view library that can make any sections of the site reactive without the overhead. I wanted my HTML to stay as is. No React, No Vue, just me and my HTML.

(BTW, See how many days since the last javascript framework:  https://dayssincelastjavascriptframework.com/)

#### Who and when would someone use it?

- People who want something simple but still follow the paradigm of the major libraries
- For people working on simple but dynamic static site
- For Blogs site 
- When having React/Vuejs/Angular/(etc) is too much
- When you just want to progressively upgrade your site without changing too much.


#### Is it here to replace or does it compete with React, Vuejs etc?

Not at all. **reLift-HTML** is targeting a different set of applications. Most of the time, specially when dealing with static site, you just want a little bit of stuff to be reactive, it could be something from or to an API, it could be something to manage application state or events.

reLift-HTML wants to be your gateway to more advanced frameworks.

It follows the same paradigm as the big ones, just on a smaller scale.  


#### Features


- Very small
- Template literals
- Directives
- Data binding
- Computed properties
- Event Handling
- Lifecycle
- State management
- HTML stays as is
- No JSX 
- No dependency
- No virtual DOM
- No need for CLI
- No build, the real DOM does it!

---

### About Me

I'm Mardix, an inventor, a creator and a UI Tech Lead Application Engineer at Bank of America, NA, in Charlotte, NC, USA.  

I love to invent stuff. I love to make stuff. I love UI. I love Javascript. I love Python.

If you have any suggestions, questions or anything, please don't hesitate to reach out.

---

### Shout Out!

reLift-HTML is using some of the work of these great libraries:

https://github.com/bryhoyt/emerj 

https://github.com/sindresorhus/on-change

--- 

License: MIT

Copyright (c) 2019 Mardix

