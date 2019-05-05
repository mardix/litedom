
import reLiftHTML from '../src/index.js';

export default reLiftHTML({
  templateString: 'Couting ${this.count}',
  tagName: 'my-counter',
  data: {
    count: 0,
    text: ''
  },
  created() {
    setInterval(() => {
      this.data.count++;
    }, 1000)
  }
})
