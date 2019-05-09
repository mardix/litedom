
*All methods have access to the following instance's properties:

**`this.el`**: Is the instance root element. It allows you to safely query, manipulate the instance's DOM elements. ie: `this.el.querySelector('ul')`

**`this.data`**: Gives you access to the reactive data. You can get, set and delete properties. Whenever a data is updated it will trigger re-render (if necessary), ie: `console.log(this.data.name)`

**`this.props`**: Give you access to the properties that were set. 

**`this.render`** A function to manually re-render, ie: `this.render()`

**`...this.defined-methods`** all of the defined methods, ie: `this.my-defined-method()`
