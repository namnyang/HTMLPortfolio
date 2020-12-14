// full version: https://farbvelo.elastiq.ch/
// color-names: https://github.com/meodai/color-nameshttps://github.com/meodai/color-names

const shuffleArray = arr => arr.
map(a => [Math.random(), a]).
sort((a, b) => a[0] - b[0]).
map(a => a[1]);

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateRandomColors = (total, mode = 'lab', padding = .175, parts = 4) => {

  let colors = [];
  const part = Math.floor(total / parts);
  const reminder = total % parts;

  // hues to pick from
  const baseHue = random(0, 360);
  const hues = [0, 60, 120, 180, 240, 300].map(offset => {
    return (baseHue + offset) % 360;
  });

  //  low saturated color
  const baseSaturation = random(5, 40);
  const baseLightness = random(0, 20);
  const rangeLightness = 90 - baseLightness;

  colors.push(HUSL.toHex(
  hues[0],
  baseSaturation,
  baseLightness * random(.25, .75)));


  for (let i = 0; i < part - 1; i++) {
    colors.push(HUSL.toHex(
    hues[0],
    baseSaturation,
    baseLightness + rangeLightness * Math.pow(i / (part - 1), 1.5)));

  }

  // random shades
  const minSat = random(50, 70);
  const maxSat = minSat + 30;
  const minLight = random(45, 80);
  const maxLight = Math.min(minLight + 40, 95);

  for (let i = 0; i < part + reminder - 1; i++) {
    colors.push(HUSL.toHex(
    hues[random(0, hues.length - 1)],
    random(minSat, maxSat),
    random(minLight, maxLight)));

  }

  colors.push(HUSL.toHex(
  hues[0],
  baseSaturation,
  rangeLightness));


  //colors = shuffleArray(colors);

  return chroma.scale(colors).padding(padding).mode(mode).colors(total);
};

function getContrastColor(color) {
  let currentColor = chroma(color);
  let lum = currentColor.luminance();
  let contrastColor;
  if (lum < 0.15) {
    contrastColor = currentColor.set('hsl.l', '+.25');
  } else {
    contrastColor = currentColor.set('hsl.l', '-.35');
  }
  return contrastColor;
}

Vue.component('color', {
  props: ['color', 'name'],
  template: `<div class="color" v-bind:style="{background: color, color: textColor}">
              <div class="label">{{ color }}</div>
              <div class="name">{{ name.name }}</div>
             </div>`,
  computed: {
    /*name: function () {
                console.log(name)
                return getClosestNamedColor( this.color ).name;
              },*/
    textColor: function () {
      return getContrastColor(this.color);
    } } });



let colors = new Vue({
  el: '#app',
  data: () => {
    return {
      colors: [],
      names: [],
      amount: 6 };

  },
  methods: {
    getNames: function () {
      fetch(`https://api.color.pizza/v1/${this.colors.join().replace(/#/g, '')}?noduplicates=true&goodnamesonly=true`).
      then(data => data.json()).
      then(data => {
        this.names = data.colors;
      });
    },
    newColors: function () {
      let colorArr = generateRandomColors(this.amount);
      this.colors = colorArr;
      this.getNames();
      let gradient = [...colorArr];
      gradient[0] += ' 12vmin';
      gradient[gradient.length - 1] += ' 69%';
      //url("https://www.transparenttextures.com/patterns/concrete-wall.png"),  
      document.querySelector('.bg').style['background-image'] = `
        linear-gradient(to bottom, ${gradient.join(',')})
      `;
      document.querySelector('.refresh').style.background = this.colors[this.colors.length - 1];
      document.querySelector('.expand').style.background = this.colors[this.colors.length - 1];

      document.querySelector('.fulllink').style.background = this.colors[1];
      document.querySelector('.fulllink').style.color = getContrastColor(this.colors[1]);
    } },

  mounted: function () {
    this.newColors();
  } });