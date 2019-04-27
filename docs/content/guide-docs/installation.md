
## Installation

[TOC]


**reLift-HTML** is written in ES2015 and distributed as standard JavaScript modules (ESM). Modules are increasingly supported in JavaScript environments and have shipped in Chrome, Firefox, Edge, Safari, and Opera.

### Importing from unpkg.com 

The recommended way to import **reLift-HTML** is via ESM javascript, where we specify the type `module` in the script tag, and we import it from **unpkg.com** 

Make sure `type="module"` exists in the script tag (`<script type="module">`).

```html

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';
  
  ...

</script>

```

The JavaScript import statement only works inside module scripts (`<script type="module">`), which can be inline scripts (as shown above) or external scripts:

```

<script type="module" src="$PATH/script.esm.js"></script>

```

### npm

Or by installing it in your project

```
npm install relift-html
```

```js
import reLiftHTML from 'relift-html';
```


### Compatibility 

**reLift-HTML** is a modern library for moden browsers that support ES2015 (ES6), Template Literals, Proxy, and all the fun stuff.

The library is written in ES2015, and will be delivered to you in such, and it wasn't found  necessary to make it compatible with older browsers, therefor it will not work with browsers that don't support ES6, Template Literals, Proxy.

https://caniuse.com/#feat=es6

https://caniuse.com/#search=proxy
