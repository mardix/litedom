
## Installation

[TOC]


**Litedom** is written in ES2015 and distributed as standard JavaScript modules (ESM). Modules are increasingly supported in JavaScript environments and have shipped in Chrome, Firefox, Edge, Safari, and Opera.

### Importing from unpkg.com 

The recommended way to import **Litedom** is via ESM javascript, where we specify the type `module` in the script tag, and we import it from **unpkg.com** 

Make sure `type="module"` exists in the script tag (`<script type="module">`).

```html

<script type="module">
  import Litedom from '//unpkg.com/litedom';
  
  ...

</script>

```

The JavaScript import statement only works inside module scripts (`<script type="module">`), which can be inline scripts (as shown above) or external scripts:

```html
<script type="module" src="$PATH/script.esm.js"></script>
```

### npm

Or by installing it in your project

```
npm install litedom
```

```js
import Litedom from 'litedom';
```


### Compatibility 

**Litedom** is a modern library for moden browsers that support ES2015 (ES6), Template Literals, Proxy, and all the fun stuff.

The library is written in ES2015, and will be delivered to you as such. To keep it small Litedom doesn't have any polyfills nor extra code to make new ES20xx features available in non modern browsers, therefor it will not work with browsers that don't support ES6, Template Literals, Proxy, etc. 

https://caniuse.com/#feat=es6

https://caniuse.com/#search=proxy
