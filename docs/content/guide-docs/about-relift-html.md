**reLift-HTML** is a small view library that lets you write Javascript Template Literals in HTML. (Yup! You've read that right!)

Inspired by, but unlike *lit-html* and *hyperHTML*, **reLift-HTML** makes it easy to write javascript in your HTML template using template literals. 

No need to know special React/JSX syntax or some other templaty stuff, HTML is your template. Use it the way you've used it before.

If you need some values to be reactive, just place them in the template literal `${...}`, otherwise, keep going with your plain old HTML.

Underneath, reLift-HTML will turn the html section into a modern template string literal, and upon receiving new data, it will re-render only sections that need to be rendered.

reLift-HTML doesn't have a virtual DOM, therefor it doesn't keep a DOM tree in memory. Instead it relies on the real DOM, and only mutates it in place whenever there is change. This tends to be memory efficient, and also reduces GC activities