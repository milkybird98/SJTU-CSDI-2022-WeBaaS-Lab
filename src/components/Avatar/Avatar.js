const colorArray = ['#af4448', '#ba2d65', '#65499c', '#49599a',
  '#2286c3', '#00867d', '#7da453', '#c8a415'];

function extractColorByName(username) {
  // let str = '';
  let n = 0;
  for (let i = 0; i < username.length; i += 1) {
    // str += parseInt(username[i].charCodeAt(0), 10).toString(16);
    n += parseInt(username[i].charCodeAt(0), 10);
  }
  return colorArray[n % colorArray.length];
}

export default {
  name: 'Avatar',
  props: ['name'],
  data() {
    return {
      shortName: '',
      background: '',
    };
  },
  mounted() {
    this.shortName = this.name.trim().substring(0, 1).toUpperCase();
    this.background = extractColorByName(this.name);
    // console.log(this.shortName);
  },
};
