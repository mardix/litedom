
**Litedom** is an elegant Web Component library. 

At ~3.5kb gzip, it allows you to create Web Component/Custom Element easily. Litedom can effortlessy be added into exitsing HTML page, without the need to bring in the bloat of big frameworks.

With Litedom, you can create your own custom tag element, to be reused throughout the application. 

Components created with Litedom are reactive. Litedom provides an internal state manager, a simple progressive templating language by leveraging Javascript Template Literals, provides a one way data flow, has two-way data biding and events handling, lifecycle, directives, stylemaps. It has no dependecies, no virtual DOM, no JSX, No build tool.

**Litedom** follows the Web Component V1 specs, which allows you to have Shadow Dom Spec, Custom Element Spec, HTML Template Spec and ES Module Spec. It is compatible with all modern browsers that support ES2015 (ES6), ESM (ES Module), Proxy, etc. 

**Litedom** is set to be easy, simple and straight forward.  


**Features**: Web Components, Custom Element, Template Literals, Reactive, Data Binding, One Way Data Flow, Two-way data binding, Event Handling, Props, Lifecycle, State Management, Computed Properties, Directives and more.


**Litedom** turns the template into template string literal and doesn't have a virtual DOM, therefor it doesn't keep a DOM tree in memory. Instead it relies on the real DOM, and only mutates it in place whenever there is change. This tends to be memory efficient, and also reduces GC activities