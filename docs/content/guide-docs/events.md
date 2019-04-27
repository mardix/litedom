
## Events

[TOC]

reLift-HTML exposes the `@` to add an event listener to an element, which will be bound to functions created in the instance. ie: `@click`, `@input`, `@submit`.

In the reLift-HTML instance, create a method, and use that method name to set event listener. When an event is invoked, the `Event` object is passed to the method as the first and only argument. The `Event` object can be used to retrieve data attribute of the element, etc.


```html

<div id="root">
  <button @click="sayHello">Say Hello!</button>
</div>

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';
  
  reLiftHTML({
    el: '#root',
    data: {},

    sayHello(event) {
      console.log('Hello World!')
    }
  })

</script>

```

When the button is clicked it will 'Hello World' will be displayed on the console.


### Passing values

To pass values from the element to the event, we can use html attribute and retrieve the data from there. We can't pass object directly to the method. It has to be done via data attribute. With the data attribute, we can use it to retrieve some more data from some other sources.


```html

<div id="root">
  <button @click="sayHello" data-name="Mardix">Say Hello!</button>
</div>

<script type="module">
  import reLiftHTML from '//unpkg.com/relift-html';
  
  reLiftHTML({
    el: '#root',
    data: {},

    sayHello(event) {
      const name = event.target.getAttribute('data-name');
      console.log(`Hello ${name}`)
    }
  })
</script>
```

Will now show `Hello Mardix`


### @call

`@call` is a shortcut key that will assign the right event based on the element.

By default all `@call` will result into `@click`, except for the scenarios below:


##### HTMLAnchorElement

AHREF `@call` => `@click`

```
<a @call="something">x</a> to
<a href="javascript:void(0);" @click="something"></a>
```

##### HTMLInputElement & HTMLTextAreaElement

FORMS: Input & Textarea `@call` => `@input + @paste`

```
<input type="text" @call="something"> to
<input type="text" @input="something" @paste="something">
```

##### HTMLSelectElement

FORMS: Select `@call` => `@change`

```
<select @call="something"><options...></select>
<select @change="something"><options...></select>
```

##### HTMLFormElement

FORMS: Form `@call` => `@submit`

```
<form @call="something"></form>
<form @submit="something"></form>
```


### Event's list

Here is the list of all the events accepted by reLift-HTML 

```
@call
@click
@submit
@change
@input
@select
@focus
@blur
@hover
@reset
@keydown
@keypress
@keyup
@dblclick
@mouseenter
@mouseleave
@mousedown
@mousemove
@mouseout
@mouseover
@mouseup
@contextmenu
@drag
@dragend
@dragenter
@dragstart
@dragleave
@drop
@cut
@copy
@paste

```