import Compolite from '../src/index.js';

const template = `
  <div>Text: {this.form.text}</div>
  <div>Radio: {this.form.radio}</div>
  <div>Select {this.form.city || 'Charlotte'}</div>
  <div>Check: {this.form.checks} </div>
  <hr>
  <div>Input text: <input type="text" @bind="form.text"></div>
  <div>Radio: <input type="radio" name='r1' @bind="form.radio" value='Mr'> - <input type="radio" name='r1' @bind="form.radio" value='Mrs.'></div>
  <div>Checkbox: 
    <input type="checkbox" name='r1' @bind="form.checks" value='up'> Up 
    <input type="checkbox" name='r1' @bind="form.checks" value='down'> DOWN 
    <input type="checkbox" name='r1' @bind="form.checks" value='left'> LEFT
    <input type="checkbox" name='r1' @bind="form.checks" value='right'> RIGHT
  </div>
  <div>Select: <select name="city" @bind="form.city">
    <option value="Charlotte">Charlotte</option>
    <option value="Concord">Concord</option>
    <option value="Atlanta">Atlanta</option>
  </select></div>
`;

export default Compolite({
  template,
  tagName: 'my-counter',
  data: {
    form: {
      text: '',
      radio: 'Mr',
      checks: [],
      city: '',
    },
  },
});
