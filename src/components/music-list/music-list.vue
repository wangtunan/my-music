<template>
  <div class="music-list">
    <div class="back" @click="handleBackClick">
      <span class="icon-back"></span>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 播放按钮 -->
      <div class="play-container">
        <div class="play" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 图片遮罩 -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 列表遮罩 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" :probe-type="probeType" :listenScroll="listenScroll" @scroll="handleSongsScroll" ref="list" class="list">
      <!-- 歌曲列表 -->
      <div class="songs-wrapper">
        <song-list :songs="songs" @select="handleSongSelect"></song-list>
      </div>
      <!-- loading -->
      <div class="loading-container" v-if="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import Loading from 'base/loading/index.vue'
import Scroll from 'base/scroll/index.vue'
import SongList from 'base/song-list/song-list.vue'
import { prefixStyle } from 'common/js/dom.js'
import { mapActions } from 'vuex'
const TITLE_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateHeight = -this.imageHeight + TITLE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  computed: {
    // 计算属性：歌曲背景图片
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    // 返回：点击事件
    handleBackClick () {
      this.$router.back()
    },
    // 歌曲列表：选择事件
    handleSongSelect (item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // 歌曲列表：歌曲列表滚动事件
    handleSongsScroll (pos) {
      this.scrollY = pos.y
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  watch: {
    scrollY (newY) {
      let layer = this.$refs.layer
      let bgImage = this.$refs.bgImage
      let playBtn = this.$refs.playBtn
      let filter = this.$refs.filter
      let zIndex = 0
      let scale = 1
      let blur = 0
      let percent = Math.abs(newY / this.imageHeight)
      let translateY = Math.max(this.minTranslateHeight, newY)
      if (newY > 0) {
        zIndex = 10
        scale += percent
      } else {
        blur = Math.min(20, percent * 20)
      }
      layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      filter.style[backdrop] = `blur(${blur}px)`
      if (newY < this.minTranslateHeight) {
        zIndex = 10
        bgImage.style.paddingTop = 0
        bgImage.style.height = TITLE_HEIGHT + 'px'
        playBtn.style.display = 'none'
      } else {
        bgImage.style.paddingTop = '70%'
        bgImage.style.height = 0
        playBtn.style.display = ''
      }
      bgImage.style[transform] = `scale(${scale})`
      bgImage.style.zIndex = zIndex
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .music-list
    z-index: 100
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 10px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        color: $color-theme
        font-size: $font-size-large-x
    .title
      z-index: 50
      position: absolute
      left: 10%
      top: 0
      width: 80%
      text-align: center
      line-height: 40px
      no-wrap()
      color: $color-text
      font-size: $font-size-large
    .bg-image
      position: relative
      left: 0
      top: 0
      width: 100%
      height: 0
      padding-top: 70%
      background-size: cover
      transform-origin: top
      .play-container
        z-index: 60
        position: absolute
        left: 0
        right: 0
        bottom: 20px
        .play
          margin: 0 auto
          width: 135px
          padding: 7px 0px
          border-radius: 15px
          box-sizing: border-box
          color: $color-theme
          text-align: center
          border: 1px solid $color-theme
          .icon-play
            display: inline-block
            vertical-align: middle
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-medium
      .filter
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        background: rgba(7,17,27,0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      background: $color-background
      .songs-wrapper
        padding: 20px 30px
</style>
