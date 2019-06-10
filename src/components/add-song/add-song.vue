<template>
  <transition name="slide">
    <div class="add-song" @click.stop v-show="showFlag">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="queryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :current-index.sync="currentIndex"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" v-if="currentIndex===0" :data="playHistory" class="list-scroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="searchList" v-if="currentIndex===1" :data="searchHistory" class="list-scroll">
            <div class="list-inner">
              <search-list :list="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggestion :query="query" :show-singer="false" @list-scroll="blurInput" @select="selectSuggestion"></suggestion>
      </div>
      <top-tips ref="topTips">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tips>
    </div>
  </transition>
</template>
<script>
import SearchBox from 'base/search-box/search-box.vue'
import Suggestion from 'components/suggestion/suggestion.vue'
import Switches from 'base/switches/switches.vue'
import Scroll from 'base/scroll/index.vue'
import SongList from 'base/song-list/song-list.vue'
import SearchList from 'base/search-list/search-list.vue'
import TopTips from 'base/top-tips/top-tips.vue'
import Song from 'common/js/song'
import { searchMixin } from 'common/js/mixin.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [searchMixin],
  data () {
    return {
      showFlag: false,
      currentIndex: 0,
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'searchHistory'
    ])
  },
  methods: {
    show () {
      this.showFlag = true
      this.showTimer && clearTimeout(this.showTimer)
      this.showTimer = setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    queryChange (query) {
      this.query = query
    },
    selectSong (song, index) {
      if (index !== 0) {
        this.$refs.topTips.show()
        this.insertSong(new Song(song))
      }
    },
    selectSuggestion () {
      this.$refs.topTips.show()
      this.saveSearch()
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SearchBox,
    Suggestion,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTips
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .add-song
    z-index: 200
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background-color: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        right: 8px
        top: 0
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
