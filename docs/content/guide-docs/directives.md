

## Directives

[TOC]

Directives are special attribute that start with `r-` that you place in HTML elements as a normal data attribute, ie: `<span r-if="this.x ===  y">show</span>`. They serve as shorthands to convert to template literals stuff that could be too challenging to write. 

```js
  // directive
  <span r-if="this.index === 5">Show me</span>

  // The code above will be converted to 
  ${this.index === 5 ? `<span>Show me</span>` : ``}

  // Here's how to iterate over a list of items
  <ul>
    <li r-for="item in this.items">{item}</li>
  </ul>

```

Values can be of any javascript conditional. Values should not be placed in `${...}` or `{...}` inside of the directive. It should be written as normal string. 

**DO THIS**: `<span r-if="this.index === 5">show me</span>`

**DON'T DO**: `<span r-if="${this.index === 5}">show me</span>`


### r-if


`r-if` can be used to conditionally add or remove the elements.The same way you would write your conditional in javascript. 

`r-else` can also be used to indicate an "else block" for `r-if`. The element must immediately follow the `r-if`, or it will not be recognized.


```
  <div id="root">

    <div r-if="this.count !== 5">The count is not {this.count}</div>

    <div r-if="this.isTrue">Show me</div>
    <div r-else> Show me ELSE</div>

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

### r-for

`r-for` can be used to iterate over a list of items. Underneath it will turn it into `map`.

The `r-for` directive requires a special syntax in the form of `item in items`, where `items` is the source data Array and `item` is an alias for the Array element being iterated on.

You can also have `item, index in items`, where `index` is tracking the number.

#### Loop

```
  <div id="root">
    <ul>
      <li r-for="location in this.locations">{location.name}</li>
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
      <li r-for="state in this.states">
        {state.name}

        <ul>
          <li>Cities</li>
          <li r-for="city in state.cities">{city}</li>
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

  <div r-for="i in [...Array(5).keys()]">I'm {i}</div>

```

