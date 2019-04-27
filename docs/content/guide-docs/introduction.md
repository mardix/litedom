## Introduction

[TOC]

### What is reLift-HTML?

**reLift-HTML** is a blazing fast view library that lets you put Javascript Template Literals in HTML. (yup! you read that right!). 

Inspired by, but unlike *lit-html* and *hyperHTML*, **reLift-HTML** makes it easy to write javascript in your HTML template using template literals. 

No need to know special React/JSX syntax or some other templaty stuff, HTML is your template. Use it the way you've used it before.

If you need some values to be reactive, just place them in the template literal `${...}`, otherwise, keep going with your plain old HTML.

Underneath, reLift-HTML will turn the html section into a modern template string literal, and upon receive new data, it will just re-render only sections need to be rendered.


### Template Literals

Template Literal was introduced in ES2015 (ES6) as new way to create a string without adding the `+` (plus sign) and also a new way to interpolate variable in such string. 

To create a Template Literal, instead of single quotes (`'`) or double quotes (`"`) quotes we use the backtick ` character. This will produce a new string, and we can use it in any way we want.

In the new Template Literal syntax we have what are called expressions, and they look like this: `${expression}`

The `${}` syntax allows us to put an expression in it and it will produce the value.

```js
 const name = 'reLift-HTML';
 console.log(`Hello this is ${name}`);
```

reLift-HTML takes advantage of this feature to enhance HTML. You can add any expression in your HTML template, reLift-HTML will underneath turn it into HTML template. 


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
