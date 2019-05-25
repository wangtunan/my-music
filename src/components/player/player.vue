<template>
  <div class="player" v-show="playList.length > 0">
    <!-- 常规播放器 -->
    <transition name="normal" @enter="handleEnter" @after-enter="handleAfterEnter" @leave="handleLeave" @after-leave="handleAfterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景图片 -->
        <div class="background">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click="handleBackClick">
            <span class="icon-back"></span>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <!-- 中部 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :src="currentSong.image" alt="" width="100%" height="100%">
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <div class="operators">
            <div class="icon icon-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon icon-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon icon-center">
              <i class="icon-play"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 迷你播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="handleMiniPlayerClick">
        <div class="icon">
          <div class="img-wrapper">
            <img :src= "currentSong.image" alt="" width="40" height="40">
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <div class="progress-circle">
            <i class="icon-mini icon-play-mini"></i>
          </div>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" ref="audio"></audio>
  </div>
</template>
<script>
import Animations from 'create-keyframe-animation'
import { mapGetters, mapMutations } from 'vuex'
import { prefixStyle } from 'common/js/dom.js'
const transform = prefixStyle('transform')
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong'
    ])
  },
  methods: {
    // 返回按钮：点击事件
    handleBackClick () {
      this.setFullScreen(false)
    },
    // 常规播放器：开始进入
    handleEnter (el, done) {
      let { x, y, scale } = this._getPosAndScale()
      let animation = {
        '0%': {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        '60%': {
          transform: `translate3d(0, 0, 0) scale(1.1))`
        },
        '100%': {
          transform: `translate3d(0, 0, 0) scale(1))`
        }
      }
      Animations.registerAnimation({
        name: 'move',
        animation: animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      Animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    // 常规播放器：进入完毕
    handleAfterEnter () {
      Animations.unregisterAnimation('move')
      this.$refs.cdWrapper.animation = ''
    },
    // 常规播放器：开始离开
    handleLeave (el, done) {
      let { x, y, scale } = this._getPosAndScale()
      let cdWrapper = this.$refs.cdWrapper
      cdWrapper.style.transition = 'all 0.4s'
      cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      const timer = setTimeout(done, 400)
      cdWrapper.addEventListener('transitionend', () => {
        clearTimeout(timer)
        done()
      })
    },
    // 常规播放器：离开完毕
    handleAfterLeave () {
      let cdWrapper = this.$refs.cdWrapper
      cdWrapper.style.transition = ''
      cdWrapper.style[transform] = ''
    },
    // 迷你播放器：点击事件
    handleMiniPlayerClick () {
      this.setFullScreen(true)
    },
    // 获取初始位置和缩放级别
    _getPosAndScale () {
      let targetWidth = 40
      let paddingLeft = 40
      let paddingBottom = 30
      let paddingTop = 80
      let width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - width / 2 - paddingBottom - paddingTop
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
  },
  watch: {
    currentSong () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
  // 常规播放器动画
  .normal-enter-active, .normal-leave-active
    transition: all 0.4s
    .top, .bottom
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  .normal-enter, .normal-leave-to
    opacity: 0
    .top
      transform: translate3d(0, -100px, 0)
    .bottom
      transform: translate3d(0, 100px, 0)
  // 迷你播放器动画
  .mini-enter-active, .mini-leave-active
    transition: all 0.4s
  .mini-enter, .mini-leave-to
    opacity: 0
  .player
    .normal-player
      z-index: 100
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      background-color: $color-background
      .background
        position: fixed
        left: 0
        top: 0
        width: 100%
        height: 100%
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        .back
          position: absolute
          left: 6px
          top: 0
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            transform: rotate(-90deg)
            color: $color-theme
            font-size: $font-size-large-x
        .title
          margin: 0 auto
          width: 70%
          text-align: center
          no-wrap()
          line-height: 40px
          color: $color-text
          font-size: $font-size-large
        .subtitle
          text-align: center
          line-height: 20px
          color: $color-text
          font-size: $font-size-medium
      .middle
        position: fixed
        top: 80px
        bottom: 170px
        width: 100%
        .middle-l
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            bottom: 0
            width: 80%
            .cd
              position: absolute
              width: 100%
              height: 100%
              border-radius: 50%
              & > img
                display: block
                border-radius: 50%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255,255,255,0.1)
      .bottom
        position: absolute
        left: 0
        right: 0
        bottom: 50px
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            & > i
              font-size: 30px
          .icon-left
            text-align: right
          .icon-center
            padding: 0 20px
            text-align: center
            & > i
              font-size: 40px
          .icon-right
            text-align: left
    .mini-player
      z-index: 180
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 60px
      display: flex
      align-items: center
      background: $color-highlight-background
      .icon
        flex: 0 0 40px
        padding: 0 10px 0 20px
        width: 40px
        height: 40px
        .img-wrapper
          width: 100%
          height: 100%
          & > img
            border-radius: 50%
      .text
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          color: $color-text
          font-size: $font-size-medium
        .desc
          color: $color-text-d
          font-size: $font-size-small
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .progress-circle
          position: relative
          width: 32px
          height: 32px
          .icon-mini
            position: absolute
            left: 0
            top: 0
            font-size: 32px
        .icon-playlist,.icon-play-mini
          font-size: 30px
          color: $color-theme
</style>
