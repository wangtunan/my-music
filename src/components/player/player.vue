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
        <div class="middle"
          @touchstart.prevent="handleMiddleTouchStart"
          @touchmove.prevent="handleMiddleTouchMove"
          @touchend="handleMiddleTouchEnd"
          >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img :src="currentSong.image" ref="cd" :class="cdClass" alt="" width="100%" height="100%">
              </div>
            </div>
            <div class="play-lyric-wrapper">
              <p class="play-lyric">{{playLyric}}</p>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="lyric"
                  v-for="(item, index) in currentLyric.lines"
                  :class="{active: currentLineNumber === index}"
                  :key="index">{{item.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <!--  歌曲和歌词dot -->
          <div class="dot-wrapper">
            <div class="dot" :class="{active: currentShow === 'cd'}"></div>
            <div class="dot" :class="{active: currentShow === 'lyric'}"></div>
          </div>
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
            <div class="icon icon-left" @click="changeMode">
              <i :class="iconMode"></i>
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
            <div class="icon icon-right" @click.stop="toggleFavorite(currentSong)">
              <i class="icon" :class="favoriteIcon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 迷你播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="handleMiniPlayerClick">
        <div class="icon">
          <div class="img-wrapper" ref="miniWrapper">
            <img ref="miniImage" :src="currentSong.image" :class="cdClass" alt="" width="40" height="40">
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="iconMini" @click.stop="handelTogglePlay"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="handlePlayListClick">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="currentSong.url" @playing="handleAudioReady" @error="handleAudioError" ref="audio" @timeupdate="handleTimeUpdate" @ended="handleAuduoEnd"></audio>
    <playlist ref="playlist"></playlist>
  </div>
</template>
<script>
import ProgressBar from 'base/progress-bar/progress-bar.vue'
import ProgressCircle from 'base/progress-circle/progress-circle.vue'
import Scroll from 'base/scroll/index.vue'
import Playlist from 'components/playlist/playlist.vue'
import Animations from 'create-keyframe-animation'
import LyricParser from 'lyric-parser'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { prefixStyle } from 'common/js/dom.js'
import { playMode } from 'common/js/config.js'
import { playerMixin } from 'common/js/mixin.js'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  mixins: [playerMixin],
  data () {
    return {
      playLyric: '', // 当前播放的歌词
      currentShow: 'cd', // 当前展示的是cd或者歌词
      currentLineNumber: 0, // 当前歌词的行数
      currentLyric: null, // 歌词
      radius: 32, // 迷你播放器的半径
      currentTime: 0, // 歌曲当前播放时间
      songReady: false // 歌曲准备完毕
    }
  },
  created () {
    this.touch = {}
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
      this.setPlayState(!this.playing)
      this.currentLyric && this.currentLyric.togglePlay()
    },
    // 常规播放器：上一曲
    handlePrevClick () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.handleLoopPlay()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.handelTogglePlay()
        }
      }
    },
    // 常规播放器：下一曲
    handleNextClick () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.handleLoopPlay()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.handelTogglePlay()
        }
      }
    },
    // 常规播放器：音频准备完毕
    handleAudioReady () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    // 常规播放器：音频请求错误
    handleAudioError () {
      this.songReady = true
    },
    // 常规播放器：播放时间改变
    handleTimeUpdate (e) {
      this.currentTime = e.target.currentTime
    },
    // 常规播放器：歌曲播放完毕
    handleAuduoEnd () {
      this.currentTime = 0
      if (this.mode === playMode.loop) {
        this.handleLoopPlay()
      } else {
        this.handleNextClick()
      }
    },
    // 常规播放器：循环播放
    handleLoopPlay () {
      let audio = this.$refs.audio
      audio.currentTime = 0
      audio.play()
      this.setPlayState(true)
      this.currentLyric && this.currentLyric.seek(0)
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
      this.currentShow && this.currentLyric.seek(this.currentTime * 1000)
    },
    // 常规播放器：获取歌词
    handleGetLyric () {
      this.currentSong.getLyric().then(lyric => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new LyricParser(lyric, this.handleLyricPlay)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLineNumber = 0
        this.playLyric = ''
      })
    },
    // 常规播放器：歌曲播放事件
    handleLyricPlay ({ lineNum, txt }) {
      if (!this.$refs.lyricLine) {
        return
      }
      this.currentLineNumber = lineNum
      if (lineNum > 5) {
        let lineElement = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineElement, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playLyric = txt
    },
    // 常规播放器：中部touch-start事件
    handleMiddleTouchStart (e) {
      this.touch.inited = true
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
    },
    handleMiddleTouchMove (e) {
      if (!this.touch.inited) {
        return
      }
      let touch = e.touches[0]
      let deltax = touch.pageX - this.touch.startX
      let deltay = touch.pageY - this.touch.startY
      let lyricList = this.$refs.lyricList.$el
      let middleL = this.$refs.middleL
      if (Math.abs(deltay) > Math.abs(deltax)) {
        return
      }
      let windowWidth = window.innerWidth
      let left = this.currentShow === 'cd' ? 0 : -windowWidth
      let width = Math.min(0, Math.max(-windowWidth, left + deltax))
      this.touch.percent = Math.abs(width / windowWidth)
      lyricList.style[transform] = `translate3d(${width}px, 0, 0)`
      lyricList.style[transitionDuration] = 0
      middleL.style.opacity = 1 - this.touch.percent
      middleL.style[transitionDuration] = 0
    },
    handleMiddleTouchEnd () {
      let durationTime = 300
      let width = 0
      let opacity = 0
      let windowWidth = window.innerWidth
      let lyricList = this.$refs.lyricList.$el
      let middleL = this.$refs.middleL
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          width = -windowWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          width = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          width = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          width = -windowWidth
          opacity = 0
        }
      }
      lyricList.style[transform] = `translate3d(${width}px, 0, 0)`
      lyricList.style[transitionDuration] = `${durationTime}ms`
      middleL.style.opacity = opacity
      middleL.style[transitionDuration] = `${durationTime}ms`
      this.touch.inited = false
    },
    // 常规播放器：播放菜单点击事件
    handlePlayListClick () {
      this.$refs.playlist.show()
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
    // 计算内层的transform并传递给外层
    syncWrapperTransform (wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return
      }
      let imageWrapper = this.$refs[wrapper]
      let image = this.$refs[inner]
      let wTransform = getComputedStyle(imageWrapper)[transform]
      let iTransform = getComputedStyle(image)[transform]
      imageWrapper.style[transform] = wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLineNumber = 0
        this.currentTime = 0
        this.currentLyric = null
      }
      let audio = this.$refs.audio
      if (audio) {
        this.$refs.audio.src = newSong.url
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
      }, 1000)
      this.handleGetLyric()
    },
    playing (newVal) {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause()
      })
      if (!newVal) {
        if (this.fullScreen) {
          this.syncWrapperTransform('cdWrapper', 'cd')
        } else {
          this.syncWrapperTransform('miniWrapper', 'miniImage')
        }
      }
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
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
      // 常规播放器动画
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
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
        font-size: 0
        white-space: nowrap
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .play-lyric-wrapper
            margin: 30px auto 0 auto
            width: 80%
            text-align: center
            overflow: hidden
            .play-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text
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
        .middle-r
          display: inline-block
          width: 100%
          height: 100%
          vertical-align: top
          overflow: hidden
          .lyric-wrapper
            margin: 0 auto
            width: 80%
            text-align: center
            overflow: hidden
            .lyric
              line-height: 32px
              font-size: $font-size-medium
              color: $color-text-l
              &.active
                color: $color-text
      .bottom
        position: absolute
        left: 0
        right: 0
        bottom: 50px
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              color: $color-text-ll
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
          .icon-favorite
            color: #d93f30
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
      // 迷你播放器动画
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
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
        .icon-playlist,.icon-play-mini,.icon-pause-mini
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          position: absolute
          left: 0
          top: 0
          font-size: 32px
</style>
