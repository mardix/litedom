
import {bindEvents, tokenizeEvents} from '../src/events.js';

// require('jsdom-global')();
// require('mutationobserver-shim');

// Object.defineProperty(global, 'MutationObserver', {
//   value: function() {
//   this.observe = function() {}
// },
//   writable:true
// });

describe('tokenizeEvents', () => {
  test('@click exists', () => {
    document.body.innerHTML = `<a id="myId" href="#" @click="fn">x</a>`
    tokenizeEvents(document.body);
    const el = document.querySelector('#myId')
    expect(el.hasAttribute('r-on-click')).toBe(true)
  });

  test('@click get method', () => {
    document.body.innerHTML = `<a id="myId" href="#" @click="fn">x</a>`
    tokenizeEvents(document.body);
    const el = document.querySelector('#myId')
    expect(el.getAttribute('r-on-click')).toBe('fn')
  });

  test('@click + @mouseover r-e-list', () => {
    document.body.innerHTML = `<a id="myId" href="#" @click="fn" @mouseover="fn">x</a>`
    tokenizeEvents(document.body);
    const el = document.querySelector('#myId')
    expect(el.hasAttribute('r-e-list')).toBe(true)
    expect(el.getAttribute('r-e-list').split(',').filter(v=>v).length).toBe(2)
  });

  test('@call ahref to r-on-click', () => {
    document.body.innerHTML = `<a id="myId" href="#" @call="fn">x</a>`
    tokenizeEvents(document.body);
    const el = document.querySelector('#myId')
    expect(el.hasAttribute('r-on-click')).toBe(true)
    expect(el.getAttribute('href')).toEqual('javascript:void(0);');
  });

  test('@call on input to r-on-input, r-on-paste', () => {
    document.body.innerHTML = `<input type="text" id="myId"  @call="fn">`
    tokenizeEvents(document.body);
    const el = document.querySelector('#myId')
    expect(el.hasAttribute('r-on-input')).toBe(true)
    expect(el.hasAttribute('r-on-paste')).toBe(true)
  });

  test('@call on select to r-on-change', () => {
    document.body.innerHTML = `<select id="myId" @call="fn"></select>`
    tokenizeEvents(document.body);
    const el = document.querySelector('#myId')
    expect(el.hasAttribute('r-on-change')).toBe(true)
  });

  test('@call on form to r-on-submit', () => {
    document.body.innerHTML = `<form id="myId" @call="fn"></form>`
    tokenizeEvents(document.body);
    const el = document.querySelector('#myId')
    expect(el.hasAttribute('r-on-submit')).toBe(true)
  });

  test('@call anything to r-on-click', () => {
    document.body.innerHTML = `<div id="myId" href="#" @call="fn">x</div>`
    tokenizeEvents(document.body);
    const el = document.querySelector('#myId')
    expect(el.hasAttribute('r-on-click')).toBe(true)
    expect(el.hasAttribute('href')).not.toEqual('javascript:void(0);');
  });  
});

describe('bindEvents', () => {

  test.skip('@click fire method', done => {
    const context = {
      fn(e) {
        done()
        console.log('wow')
      }
    }
    document.body.innerHTML = `<a id="myId" href="#" @click="fn">x</a>`
    tokenizeEvents(document.body);
    bindEvents(document.body, context);
    const el = document.querySelector('#myId');
    el.click()
  });
}) 

