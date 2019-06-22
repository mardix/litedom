

## Directives

[TOC]

Directives are special attribute that start with a colon `:` that you place in HTML elements as a normal data attribute, ie: `<span :if="this.x ===  y">show</span>`. They serve as shorthands to convert to template literals stuff that could be too challenging to write. 

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


### :if


`:if` can be used to conditionally add or remove the elements.The same way you would write your conditional in javascript. 

`:else` can also be used to indicate an "else block" for `:if`. The element must immediately follow the `:if`, or it will not be recognized.


```
  <div id="root">

    <div :if="this.count !== 5">The count is not {this.count}</div>

    <div :if="this.isTrue">Show me</div>
    <div :else> Show me ELSE</div>

  </div>

  <script type="module">
    reLiftHTML({
      el: '#root',
      data: {
        isTrue: true,
        count: 5
      }
    })
  </script>

```

---

### :for

`:for` can be used to iterate over a list of items. Underneath it will turn it into `map`.

The `:for` directive requires a special syntax in the form of `item in items`, where `items` is the source data Array and `item` is an alias for the Array element being iterated on. 

You can also have `item, index in items`, where `index` is tracking the number.

It is recommended to provide an `id` attribute with `:for` whenever possible, because reLift-HTML patches the element in place. For the id, use either string or a number, or a combination of both. You may also use the index of the loop to set it as id.


#### Loop

```
  <div id="root">
    <ul>
      <li :for="location in this.locations">{location.name}</li>
    </ul>
  </div>

  <script type="module">

    reLiftHTML({
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

#### Inner Loop

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

    reLiftHTML({
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

#### Iterate over a range

```

  <div :for="i in [...Array(5).keys()]">I'm {i}</div>

```

#### With id

```

  <div :for="i in [...Array(5).keys()]" id="my-div-{i}">I'm {i}</div>

```
