# reLift-HTML


[![gzip bundle size](http://img.badgesize.io/https://unpkg.com/relift-html@latest/dist/relift-html.esm.js?compression=gzip&style=flat-square)](https://unpkg.com/relift-html)

**reLift-HTML** is a blazing fast view library for HTML that let you put Javascript Template Literals in HTML. (yup! you read that right!). 

No need to know special React/JSX syntax or some other templaty stuff, HTML is your template. Use it the way you've used it before.

If you need some values to be reactive, just place them in the template literal `${...}`, otherwise, keep going with your plain old HTML.

Underneath, reLift-HTML will turn the html section into a modern template string literal, and upon receive new data, it will will just re-render only sections need to be rendered.


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

*(Let's get this out of the way before going further. IE sucks!)*

**reLift-HTML** is a modern library for moden browsers that support ES2015 (ES6), Template Literals, Proxy, and all the fun stuff.

The library is written in ES2015, and will be delivered to you in such, and it wasn't found  necessary to make it compatible with older browsers, therefor it will not work with browsers that don't support ES6, Template Literals, Proxy. (I'm talking mainly to you IE11--, please don't even bother).

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

`<h4>${this.count}</h4>` is the interactive that will be interpolated whenever the state changes

Buttons:

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

reLift-HTML is very small.

Gzip: **~3.1kb**



#### Why yet another Javascript library?

(See how many days since the last javascript framework:  https://dayssincelastjavascriptframework.com/)

On a more serious note, we are living in the best web development time ever (my opinion), we have some great UI frameworks: React, Vuejs, Angular, etc (and JQuery sucks). They do amazing stuff, beautiful stuff. But sometimes, you just want something simple without bringing their complexity, but also something that follows the modern paradigm.  

That's where reLift-HTML comes into play. When you want big things in a small package.

#### Who would use it?


- Simple Site page
- Or static site 
- When having React/Vuejs/Angular/(etc) is too much
- But still need simple reactivity 
- To structure part of the page 


#### Is it there to replace or does it compete with React, Vuejs etc?

Not at all. **reLift-HTML** is targeting a different set of applications. reLift-HTML wants to be your gateway to more advanced frameworks.

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


- Template literals in HTML
- Directives, to make writing some complex template lit in a simpler way.
  - r-if
    - r-else
  - r-for
  - r-class
  - r-disabled
  - r-value
  - r-select
- Application lifecycle
  - mounted
  - updated
- State management
  - Local State
  - Share State
  - Computed data
- Events
  - @click, @mouseover etc....


---

WIP

--- 

License: MIT

Copyright (c) 2019 Mardix

