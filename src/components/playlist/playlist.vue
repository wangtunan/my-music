<template>
  <transition name="fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="operate" @click="addSong">
              <i class="icon-add"></i>
              添加歌曲到队列
            </span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="listContent">
          <transition-group name="list" tag="ul">
            <li class="item" v-for="(item,index) in sequenceList" :key="item.id" ref="songItem" @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click="deleteSong(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-close" @click.stop="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表？" confirmButtonText="清空" @confirm="clearPlayList"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script>
import Scroll from 'base/scroll/index.vue'
import Confirm from 'base/confirm/confirm.vue'
import AddSong from 'components/add-song/add-song.vue'
import { mapActions } from 'vuex'
import { playMode } from 'common/js/config.js'
import { playerMixin } from 'common/js/mixin.js'
export default {
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false
    }
  },
  computed: {
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.showTimer && clearTimeout(this.showTimer)
      this.showTimer = setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToSong(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    // 歌曲列表点击事件
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex(song => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayState(true)
    },
    // 删除歌曲
    deleteSong (item) {
      this.deleteSong(item)
      if (!this.playList.length) {
        this.hide()
      }
    },
    // 清空播放列表
    clearPlayList () {
      this.clearSongList()
      this.hide()
    },
    // 显示confirm弹出
    showConfirm () {
      this.$refs.confirm.show()
    },
    // 获取当前播放的歌曲的样式
    getCurrentIcon (item) {
      return this.currentSong.id === item.id ? 'icon-play' : ''
    },
    // 当前播放的歌曲始终在第一位
    scrollToSong (song) {
      const findex = this.sequenceList.findIndex(item => {
        return item.id === song.id
      })
      findex > -1 && this.$refs.listContent.scrollToElement(this.$refs.songItem[findex], 100)
    },
    // 添加歌曲到列表
    addSong () {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'deleteSong',
      'clearSongList'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToSong(newSong)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  destroyed () {
    clearTimeout(this.showTimer)
    this.showTimer = null
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
  .playlist
    z-index: 200
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: $color-background-d
    // 列表动画
    &.fade-enter-active, &.fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .operate
            extend-click()
            margin-right: 25px
            font-size: $font-size-small
            color: $color-text-d
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          padding: 0 30px 0 20px
          height: 40px
          line-height: 40px
          overflow: hidden
          font-size: $font-size-small
          color: $color-theme-d
          // 删除动画
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-l
          .like
            extend-click()
            margin-right: 15px
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            color: $color-theme
      .list-operate
        margin: 20px auto 30px auto
        width: 140px
        .operate-box
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        font-size: $font-size-medium-x
        color: $color-text-l
        background: $color-background
</style>
