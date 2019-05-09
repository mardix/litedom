

**reLift-HTML** is very small (3kb) view library that allows you to create Web Component, Custom Element, and helps you make any HTML page reactive without the bloat of big frameworks. 

**reLift-HTML** is very close to standard, uses Javascript Template Literals as the template and is compatible with all modern browsers that support ES2016 (ES6), ESM (ES Module), Proxy etc.

**reLift-HTML** has no dependecies, no virtual DOM, and build tool; Which will fit best with developers who want something small, light, and simple but still follow the paradigm of the major libraries; With developers working on simple but dynamic static site; When having React/Vuejs/Angular/(etc) is too much or when you just want to progressively upgrade your site without changing too much.

**Features**: Web Components, Custom Element, Template Literals, Reactive, Data Binding, One Way Data Flow, Two-way data binding, Event Handling, Props, Lifecycle, State Management, Computed Properties, Directives and more.


**reLift-HTML** turns the template into template string literal and doesn't have a virtual DOM, therefor it doesn't keep a DOM tree in memory. Instead it relies on the real DOM, and only mutates it in place whenever there is change. This tends to be memory efficient, and also reduces GC activities