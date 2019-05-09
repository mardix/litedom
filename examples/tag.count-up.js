
import reLiftHTML from '../src/index.js';

const template = `
Counting: {this.count} 
`;

export default reLiftHTML({
  template,
  tagName: 'count-up',
  data: {
    count: 0
  },
  created() {
    this.data.count = this.props.start || 0;
    setInterval(_=> {
      this.data.count++;
    }, 1000)
  }
})
