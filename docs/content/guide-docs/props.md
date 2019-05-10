
## Props

[TOC]

Props are simply attributes that were passed in the Custom Element. They can be retrived in the methods via `this.prop` or in the template `{this.prop}`

```html
  <script type="module">
    const template = `counting: {this.count}`;

    reLiftHTML({
      template,
      tagName: 'my-counter',
      data: {
        count: 0
      },
      created() {
        this.data.count = this.prop.start || 0;
        setInterval(() => {
          this.data.count++;
        }, 1000)
      }
    })
  </script>

```