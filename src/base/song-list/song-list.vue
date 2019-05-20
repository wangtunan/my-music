<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="song in songs" :key="song.id">
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
    }
  },
  methods: {
    // 获取歌曲描述方法
    getSongDesc (song) {
      return `${song.singer}。${song.album}`
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .song-list
    .item
      disply: flex
      align-items: center
      height: 64px
      box-sizing: border-box
      font-size: $font-size-medium
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
