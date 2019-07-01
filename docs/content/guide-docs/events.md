
## Events

[TOC]

You can add event listener to elements by adding the `@` + the `$event-name` as attribute, and assign it the name of the method to bind it to: `<a @click="sayHello" href="#">Say Hello!</a>`

The $event-name must be the name of the event without `on`, ie: `@click` is VALID but `@onclick` is INVALID.

The method must be in the context of the instace that's created.

When an event is invoked, the `Event` object is passed to the method as the first and only argument. The `Event` object can be used to retrieve data attribute of the element, etc.


```html

<div id="root">
  <a @click="sayHello" href="#">Say Hello!</a>
</div>

<script type="module">

  Litedom({
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

  Litedom({
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

`@call` is a shorthand key that will assign the right event based on the element type.

By default all `@call` will result into `@click`, except for the scenarios below:


**HTMLAnchorElement**

AHREF `@call` => `@click`

```html
<a @call="something">x</a> to
<a href="javascript:void(0);" @click="something"></a>
```

**HTMLInputElement & HTMLTextAreaElement**

FORMS: Input & Textarea `@call` => `@input + @paste`

```html
<input type="text" @call="something"> to
<input type="text" @input="something" @paste="something">
```

**HTMLSelectElement**

FORMS: Select `@call` => `@change`

```html
<select @call="something"><options...></select>
<select @change="something"><options...></select>
```

**HTMLFormElement**

FORMS: Form `@call` => `@submit`

```html
<form @call="something"></form>
<form @submit="something"></form>
```


### Events Name List

Here is the list of all the events accepted by Litedom 

```html

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