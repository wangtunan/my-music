<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song,index) in songs" :key="song.id" @click="handleSongClick(song,index)">
        <div class="rank" v-if="showRank">
          <span :class="getRankClass(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getSongDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    showRank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 歌曲点击事件
    handleSongClick (item, index) {
      this.$emit('select', item, index)
    },
    // 获取歌曲描述方法
    getSongDesc (song) {
      return `${song.singer}。${song.album}`
    },
    // 获取榜单样式
    getRankClass (index) {
      if (index <= 2) {
        return `icon icon${index + 1}`
      } else {
        return 'text'
      }
    },
    // 获取榜单文本
    getRankText (index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .song-list
    .item
      display: flex
      align-items: center
      height: 64px
      box-sizing: border-box
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 20px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 25px
          background-size: 25px 24px
          &.icon1
            bg-image('first')
          &.icon2
            bg-image('second')
          &.icon3
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          margin-top: 4px
          no-wrap()
          color: $color-text-d
</style>
