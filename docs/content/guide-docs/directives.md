

## Directives

[TOC]


Directives help you write some simple markup to be turned into template literals:

Directives are placed in the HTML element itself.

```
  <span r-if="this.index === 5">Show me</span>
```

### r-if

`r-if` allows 

#### r-else

`r-else` must immediately follow `r-if`


---

### r-for

`r-for` allows to make loop on element

```
  <div id="myWidget">
    <ul>
      <li r-for="item in this.items">${item.name}</li>
    </ul>
  </div>

  <script type="module">

    reLiftHTML({
      el: '#myWidget',
      data: {
        locations: [
          {
            name: 'Charlotte'
          },
          {
            name: 'Atlanta'
          },
          {
            name: 'Chicago'
          }
        ]
      }
    })
  </script>

```


