<template>
  <transition name="slide">
    <div class="user-container">
      <div class="back" @click="backClick">
        <i class="icon-back"></i>
      </div>
      <div class="switch-container">
        <switches :switches="switches" :currentIndex.sync="currentIndex"></switches>
      </div>
      <div class="play-btn" @click="handleRandomClick">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" v-if="currentIndex===0" :data="favoriteList" class="list-scroll">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" v-if="currentIndex===1" :data="playHistory" class="list-scroll">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-container" v-show="!noResultList || !noResultList.length">
        <no-result :title="title"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
import Switches from 'base/switches/switches.vue'
import SongList from 'base/song-list/song-list.vue'
import Scroll from 'base/scroll/index.vue'
import NoResult from 'base/no-result/no-result.vue'
import Song from 'common/js/song.js'
import { mapGetters, mapActions } from 'vuex'
import { playListMixin } from 'common/js/mixin.js'
export default {
  name: 'UserCenter',
  mixins: [playListMixin],
  data () {
    return {
      currentIndex: 0,
      switches: [
        { name: '我喜欢的' },
        { name: '最近听的' }
      ]
    }
  },
  computed: {
    title () {
      return this.currentIndex === 0 ? '暂无收藏的歌曲' : '你还没有听过歌曲'
    },
    noResultList () {
      return this.currentIndex === 0 ? this.favoriteList : this.playHistory
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    // 计算bottom
    handlePlayList (list) {
      let bottom = list.length > 0 ? '60px' : ''
      let favoriteList = this.$refs.favoriteList
      let playList = this.$refs.playList
      this.$refs.listWrapper.style.bottom = bottom
      favoriteList && favoriteList.refresh()
      playList && playList.refresh()
    },
    // 随机播放
    handleRandomClick () {
      let list = this.noResultList.slice()
      list = list.map(item => {
        return new Song(item)
      })
      this.randomPlay({
        list: list
      })
    },
    // 选择歌曲
    selectSong (song) {
      this.insertSong(new Song(song))
    },
    backClick () {
      this.$router.back()
    },
    // vuex
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  .user-container
    z-index: 100
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%,0,0)
    .back
      position: absolute
      left: 6px
      top: 4px
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switch-container
      margin: 10px 0 30px 0
    .play-btn
      margin: 0 auto
      width: 135px
      padding: 7px 0
      box-sizing: border-box
      border: 1px solid $color-text-l
      border-radius: 100px
      text-align: center
      font-size: 0
      color: $color-text-l
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
      .icon-play
        display: inline-block
        margin-right: 6px
        vertical-align: middle
        font-size: $font-size-medium-x
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-container
      position: absolute
      left: 0
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
