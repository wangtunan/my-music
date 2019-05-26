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
                <img :src="currentSong.image" :class="cdClass" alt="" width="100%" height="100%">
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!-- 底部进度条 -->
          <div class="progress-wrapper">
            <span class="time time-left">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChangIng="handlePercentChangIng" @percentChanged="handlePercentChanged"></progress-bar>
            </div>
            <span class="time time-right">{{formatTime(currentSong.duration)}}</span>
          </div>
          <!-- 底部操作按钮 -->
          <div class="operators">
            <div class="icon icon-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon icon-left">
              <i class="icon-prev" @click="handlePrevClick"></i>
            </div>
            <div class="icon icon-center">
              <i @click="handelTogglePlay" :class="iconPlay"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-next" @click="handleNextClick"></i>
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
            <img :src= "currentSong.image" :class="cdClass" alt="" width="40" height="40">
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <div class="progress-circle" @click.stop="handelTogglePlay">
            <i class="icon-mini" :class="iconMini"></i>
          </div>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" @canplay="handleAudioReady" @error="handleAudioError" ref="audio" @timeupdate="handleTimeUpdate"></audio>
  </div>
</template>
<script>
import ProgressBar from 'base/progress-bar/progress-bar.vue'
import Animations from 'create-keyframe-animation'
import { mapGetters, mapMutations } from 'vuex'
import { prefixStyle } from 'common/js/dom.js'
const transform = prefixStyle('transform')
export default {
  data () {
    return {
      currentTime: 0, // 歌曲当前播放时间
      songReady: false // 歌曲准备完毕
    }
  },
  computed: {
    // 计算属性：计算播放or暂停的样式
    iconPlay () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 计算属性：计算迷你播放or暂停的样式
    iconMini () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 计算属性：计算播放器CD的动画样式
    cdClass () {
      return this.playing ? 'play' : 'pause'
    },
    // 计算属性：计算当前播放进度
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex'
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
    // 常规播放器：播放or暂停
    handelTogglePlay () {
      if (!this.songReady) {
        return
      }
      this.setPlaying(!this.playing)
    },
    // 常规播放器：上一曲
    handlePrevClick () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      this.songReady = false
    },
    // 常规播放器：下一曲
    handleNextClick () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      this.songReady = false
    },
    // 常规播放器：音频准备完毕
    handleAudioReady () {
      this.songReady = true
    },
    // 常规播放器：音频请求错误
    handleAudioError () {
      this.songReady = true
    },
    // 常规播放器：播放时间改变
    handleTimeUpdate (e) {
      this.currentTime = e.target.currentTime
    },
    // 常规播放器：进度条进度改变事件
    handlePercentChangIng (percent) {
      this.currentTime = this.currentSong.duration * percent
    },
    // 常规播放器：进度条改变完毕事件
    handlePercentChanged (percent) {
      this.currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = this.currentTime
      if (!this.playing) {
        this.handelTogglePlay()
      }
    },
    // 迷你播放器：点击事件
    handleMiniPlayerClick () {
      this.setFullScreen(true)
    },
    // 格式化歌曲播放时间
    formatTime (time) {
      time = time | 0
      let minute = time / 60 | 0
      let second = time % 60 | 0
      return `${minute}:${second < 10 ? '0' + second : second}`
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
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  watch: {
    currentSong () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing (newVal) {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar
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
  // CD旋转动画
  @keyframes rotate {
    from {
      transform: rotate(0)
    } to {
      transform: rotate(360deg)
    }
  }
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
                &.play
                  animation: rotate 20s linear infinite
                &.pause
                  animation-play-state: paused
      .bottom
        position: absolute
        left: 0
        right: 0
        bottom: 50px
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            flex: 0 0 30px
            width: 30px
            line-height: 30px
            color: $color-text
            font-size: $font-size-small
          .progress-bar-wrapper
            flex: 1
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
            &.play
              animation: rotate 20s linear infinite
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
        .icon-playlist,.icon-play-mini,.icon-pause-mini
          font-size: 30px
          color: rgba(255,205,49,0.5)
</style>
