

## Template

[TOC]

Litedom uses an HTML-based template syntax that allows you to declaratively bind the rendered DOM to the instance’s data. All Litedom templates are valid HTML that can be parsed by spec-compliant browsers and HTML parsers.

### Interpolation

To interpolate, use the single brace `{...}` without the the dollar-sign `$` or to use it as template literals with `${...}` in it. 

In the template you have access to data via `this.#data-property-name`, where '#data-property-name' is the property name to access.

```html
<script type="module">

  Litedom({
    el: '#root',
    data: {
      name: 'Litedom'
    },
    created() {
      // Dynamically added
      this.data.todaysDate = new Date().toLocaleString();
    }
  })
</script>

<div id="root">
  <p>Hello {this.name}</p>
  <p>Date: {this.todaysDate}
</div>

```

#### What about **`this`**

`this` in your template indicate the root context of the data. By not putting `this`, the variable will fall under the global object, which is the `window` in the browser. With `this` we keep the data in scope. 

```js
  <div id="root">
    <!-- use from data -->
    {this.firstName}

    <!-- fall under the global object/window -->
    {new Date().toLocaleString()}
  </div>
```
---


### Directives


Directives are special attribute that start with `:` (colon) that you place in HTML elements as a normal data attribute, ie: `<span :if="this.x ===  y">show</span>`. They serve as shorthands to convert to template literals stuff that could be too challenging to write. 

```js
  // directive
  <span :if="this.index === 5">Show me</span>

  // The code above will be converted to 
  ${this.index === 5 ? `<span>Show me</span>` : ``}

  // Here's how to iterate over a list of items
  <ul>
    <li :for="item in this.items">{item}</li>
  </ul>

```

Values can be of any javascript conditional. Values should not be placed in `${...}` or `{...}` inside of the directive. It should be written as normal string. 

**DO THIS**: `<span :if="this.index === 5">show me</span>`

**DON'T DO**: `<span :if="${this.index === 5}">show me</span>`


#### :if

`:if` can be used to conditionally add or remove the elements.The same way you would write your conditional in javascript. 

`:else` can also be used to indicate an "else block" for `:if`. The element must immediately follow the `:if`, or it will not be recognized.


```
  <div id="root">

    <div :if="this.count !== 5">The count is not {this.count}</div>

    <div :if="this.isTrue">Show me</div>
    <div :else> Show me ELSE</div>

  </div>

  <script type="module">
    Litedom({
      el: '#root',
      data: {
        isTrue: true,
        count: 5
      }
    })
  </script>

```

---

#### :for

`:for` can be used to iterate over a list of items. Underneath it will turn it into `map`.

The `:for` directive requires a special syntax in the form of `item in items`, where `items` is the source data Array and `item` is an alias for the Array element being iterated on. 

You can also have `item, index in items`, where `index` is tracking the number.

It is recommended to provide an `:key` directive or `id` attribute with `:for` whenever possible, because Litedom patches the element in place. For the key, use either string or a number, or a combination of both. You may also use the index of the loop to set it as id.


##### Loop

```
  <div id="root">
    <ul>
      <li :for="location in this.locations">{location.name}</li>
    </ul>
  </div>

  <script type="module">

    Litedom({
      el: '#root',
      data: {
        locations: [
          {
            name: 'Charlotte'
          },
          {
            name: 'Atlanta'
          },
          {
            name: 'Concord'
          }
        ]
      }
    })
  </script>

```

##### Inner Loop

```
  <div id="root">
    <ul>
      <li :for="state in this.states">
        {state.name}

        <ul>
          <li>Cities</li>
          <li :for="city in state.cities">{city}</li>
        </ul>

      </li>
    </ul>
  </div>

  <script type="module">

    Litedom({
      el: '#root',
      data: {
        states: [
          {
            name: 'NC',
            cities: [
              'Concord',
              'Charlotte',
              'Raleigh'
            ]
          },
          {
            name: 'Florida',
            cities: [
              'Tampa',
              'Miami',
              'Jacksonville'
            ]
          },
          {
            name: 'South Carolina',
            cities: [
              'Columbia',
              'Greenville'
            ]
          }
        ]
      }
    })
  </script>
```

##### Iterate over a range

```

  <div :for="i in [...Array(5).keys()]">I'm {i}</div>

```

##### With :key

```

  <div :for="i in [...Array(5).keys()]" :key="my-div-{i}">I'm {i}</div>

```

#### :class

`:class` allows to conditionally toggle class names. Separates each class condition with a semi-colon, in the following format `className: conditionToBeTrue;` => `:class="classA: this.x === y; classB: this.z > 5"`

```html

<style>
  .someClassA {
    color: blue
  }
  .myClassB {
    color: red
  }
</style>

<script>
  Litedom({
    data: {
      count: 0
    }
  })
</script>

<div :class="someClassA: this.count === 7; myClassB: this.count === 10">
  Will have .someClassA if count is 7, 
  will then have .myClassB when count is 10
</div>

```

#### :style

`:style` help sets inline style dynamically in the element. The data passed, must be the type of plain object which CSS style. 

```html

<script>
  Litedom({
    data: {
      myStyle: {
        backgroundColor: 'red',
        display: 'none',
        'font-size': '12px;'
      }
    }
  })
</script>

  <div :style="this.myStyle"></div>

  // will become

  <div style="background-color: red; display: none; font-size: 12px"></div>

```
