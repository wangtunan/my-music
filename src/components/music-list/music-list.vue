<template>
  <div class="music-list">
    <div class="back">
      <span class="icon-back"></span>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage"></div>
    <scroll :data="songs" ref="list" class="list">
      <!-- 歌曲列表 -->
      <div class="songs-wrapper">
        <song-list :songs="songs"></song-list>
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
  mounted () {
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  computed: {
    // 计算属性：歌曲背景图片
    bgStyle () {
      return `background-image: url(${this.bgImage})`
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
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 20px
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
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 0
      padding-top: 70%
      background-size: cover
      transform-origin: top
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
