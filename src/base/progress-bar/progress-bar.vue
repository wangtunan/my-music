<template>
  <div class="progress-bar" ref="progressBar" @click="handleProgressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="handleTouchStart" @touchmove.prevent="handleTouchMove" @touchend="handleTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { prefixStyle } from 'common/js/dom.js'
const PROGRESS_BTN_WIDTH = 18
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    // 把touch对象挂载到this实例上，不需要监听它的数据变动
    this.touch = {}
  },
  watch: {
    percent (newVal) {
      this.setProgressWidth(newVal)
    }
  },
  methods: {
    // touchstart事件
    handleTouchStart (e) {
      this.touch.initiated = true
      this.touch.startx = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    // touchmove事件
    handleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      let barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
      let deltax = e.touches[0].pageX - this.touch.startx
      let offset = Math.min(barWidth, Math.max(0, this.touch.left + deltax))
      this._setOffset(offset)
      this._triggerPercent(true)
    },
    // touchend事件
    handleTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent(false)
    },
    // 点击事件
    handleProgressClick (e) {
      let rect = this.$refs.progressBar.getBoundingClientRect()
      let offset = e.pageX - rect.left
      this._setOffset(offset)
      this._triggerPercent(false)
    },
    // 设置进度条宽度
    setProgressWidth (percent) {
      if (percent < 0 || this.touch.initiated) {
        return
      }
      let barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
      let offset = barWidth * percent
      this._setOffset(offset)
    },
    // 设置进度条的宽度和小球偏移
    _setOffset (offset) {
      this.$refs.progress.style.width = `${offset}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offset}px, 0, 0)`
    },
    // 触发进度改变事件
    _triggerPercent (isChanging) {
      let eventName = isChanging ? 'percentChangIng' : 'percentChanged'
      this.$emit(eventName, this._getPercent())
    },
    // 获取当前进度
    _getPercent () {
      let barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
      return this.$refs.progress.clientWidth / barWidth
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  .progress-bar
    height: 30px
    line-height: 30px
    .bar-inner
      position: relative
      height: 4px
      top: 13px
      background: rgba(0,0,0,0.2)
      .progress
        position: absolute
        left: 0
        top: 0
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          left: 7px
          top: 7px
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          box-sizing: border-box
          background: $color-theme
</style>
