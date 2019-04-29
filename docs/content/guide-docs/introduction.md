## Introduction

[TOC]

### What is reLift-HTML?

{% include "guide-docs/about-relift-html.md" %}


### Template Literals

Template Literal was introduced in ES2015 (ES6) as new way to create a string. 

To create a Template Literal, instead of single quotes (`'`) or double quotes (`"`) quotes we use the backtick ` character. This will produce a new string, and we can use it in any way we want.

In the new Template Literal syntax we have what are called expressions, and they look like this: `${expression}`

The `${}` syntax allows us to put an expression in it and it will produce a value.

```js
 const name = 'reLift-HTML';
 console.log(`Hello this is ${name}`);
```

reLift-HTML takes advantage of this feature to enhance HTML. You can add any expression in your HTML template, reLift-HTML will underneath turn it into Javascript Template Literals. 


### Features

reLift-HTML aims to be simple, easy to use and helps you do much more. 

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
