<template>
  <transition appear name="slide">
    <div class="top-list">
      <music-list :title="topList.topTitle" :bg-image="bgImage" :songs="songList" :show-rank="showRank"></music-list>
    </div>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getMusicList } from 'api/rank.js'
import { ERR_OK } from 'api/config.js'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song.js'
export default {
  data () {
    return {
      songList: [],
      showRank: true
    }
  },
  created () {
    this._getMusicList()
  },
  methods: {
    // 获取榜单详情
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then((list) => {
            this.songList = list
          })
        }
      })
    },
    _normalizeSongs (list) {
      let rect = []
      list.forEach(item => {
        let musicData = item.data
        if (isValidMusic(musicData)) {
          rect.push(createSong(musicData))
        }
      })
      return rect
    }
  },
  computed: {
    bgImage () {
      return this.songList.length > 0 ? this.songList[0].image : ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl';

  // 路由动画
  .slide-enter-active, .slide-leave-active
    transition: transform 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

  .top-list {
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: $color-background;
  }
</style>
