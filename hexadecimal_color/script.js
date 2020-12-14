const _digits = '0123456789abcdef'.split('')

Vue.component('hex-channel', {
  template: `
    <div class="channel" :class="{moving: moving}">
      <div class="digits"
        @mousedown="start" 
        @mousemove="move"
        @mouseup="stop"
        @touchstart="start" 
        @touchmove="move" 
        @touchend="stop"
        >
        <div class="digit" :class="{current: digit == hexy}" v-for="digit in digits"><span>{{digit}}</span></div>
      </div>
    </div>
  `,
  props: [
    'channel',
    'index'
  ],
  data: function(){
    return {
      moving: false,
      y: 0,
      hexy: 0
    }
  },
  created: function(){
    this.digits = '0123456789abcdef'.split('')
    window.addEventListener('resize', this.sameAsMove);
  },
  destroyed: function() {
    window.removeEventListener('resize', this.sameAsMove);
  },
  mounted: function(){
    this.sameAsMove()
  },
  watch: {
    channel: 'sameAsMove'
  },
  methods: {
    sameAsMove: function(){
      this.y = parseInt(this.channel, 16)
      this.getHeight()
      this.processly(this.y * -this.height)
    },
    getHeight: function(){
      this.height = this.$el.getBoundingClientRect().height
    },
    getPointerly: function(e){
      return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY
    },
    processly: function(value){
      if(isNaN(value)) {
        value = 0
      }
      let stack = (this.height * (this.digits.length-1) * -1)
      this.y = value > 0 ? 0 : value < stack ? stack : value
      this.hexy = parseInt(Math.abs(Math.round(this.y/this.height))).toString(16)
      this.$el.style.setProperty('--y', this.y + 'px')
      this.$emit('colorize', this.index, this.hexy)
    },
    start: function(e){
      this.moving = true
      this.dirty = true
      this.getHeight()
      this.pointerly = this.getPointerly(e) - this.y
    },
    move: function(e){
      if(this.moving){
        this.processly(Math.round(this.getPointerly(e) - this.pointerly))
      }
    },
    stop: function(e){
      this.moving = false
      this.processly(Math.round((this.getPointerly(e) - this.pointerly) / this.height) * this.height)
    }
  }
})

let vm = new Vue({
  el: 'main',
  data: {
    digits: _digits,
    channels: 6,
    color: '',
    colorName: ''
  },
  computed: {
  },
  mounted: function(){
    this.randomColor()
  },
  methods: {
    setColor: function(color){
      this.colorName = ntc.name(color)[1]
      document.documentElement.style.setProperty('--color', color)
    },
    updateColorChannel: function(index, digit){
      let mutateColor = this.color.split('')
      mutateColor.splice(index, 1, digit)
      this.color = mutateColor.join('')
      this.setColor(this.color)
    },
    randomColor: function(){
      this.color = '#' + ( '00' + Math.floor( Math.random() * 16777216 ).toString(16) ).substr(-6)
      this.setColor(this.color)
    }
  }
})