<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dotLength" :key="index" :class="{active: index === currPageIndex}"></span>
    </div>
  </div>
</template>
<script>
import { addClass } from 'common/js/dom.js'
import BScroll from 'better-scroll'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dotLength: 0,
      currPageIndex: 0
    }
  },
  mounted () {
    this.monutedTimer = setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
      this.autoPlay && this._autoPlay()
    }, 20)

    // 监听窗口改变事件
    this._listenResizeEvent()
  },
  methods: {
    // 设置滚动轮播的宽度
    _setSliderWidth (isResize) {
      let totalWidth = 0
      let sliderWidth = this.$refs.slider.clientWidth
      let children = this.$refs.sliderGroup.children
      this.dotLength = this.dotLength ? this.dotLength : children.length
      for (let index = 0; index < children.length; index++) {
        let child = children[index]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        totalWidth += sliderWidth
      }
      if (this.loop && !isResize) {
        totalWidth += sliderWidth * 2
      }
      this.$refs.sliderGroup.style.width = totalWidth + 'px'
    },
    // 初始化滚动轮播
    _initSlider () {
      if (this.slider) {
        this.slider.refresh()
        return
      }
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      // 绑定滚动完毕事件
      this.slider.on('scrollEnd', this._onScrollEnd)
    },
    // 监听BScroll滚动完毕事件
    _onScrollEnd () {
      this.currPageIndex = this.slider.getCurrentPage().pageX
      this.autoPlay && this._autoPlay()
    },
    // 自动播放
    _autoPlay () {
      clearTimeout(this.playTimer)
      this.playTimer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    // 刷新滚动轮播
    _refreshSlider () {
      if (this.slider) {
        this._setSliderWidth(true)
        this.slider.refresh()
      }
    },
    // 监听窗口改变事件
    _listenResizeEvent () {
      window.addEventListener('resize', () => {
        this._refreshSlider()
      })
    }
  },
  beforeDestroy () {
    // 清空mounted方法里面的定时器
    clearTimeout(this.monutedTimer)
    this.monutedTimer = null
    // 清空轮播定时器和轮播
    this.slider.disable()
    clearTimeout(this.playTimer)
    this.playTimer = null
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  .slider
    position: relative
    min-height: 1px
    .slider-group
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
        img
          display: block
          width: 100%
    .dots
      position: absolute
      left: 0
      right: 0
      bottom: 10px
      text-align: center
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        background-color: $color-text-l
        border-radius: 50%
        &.active
          width: 20px
          border-radius: 5px
          background-color: $color-text-ll
</style>
