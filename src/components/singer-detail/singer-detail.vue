<template>
  <transition appear name="slide">
    <div class="singer-detail">
      <music-list :songs="songList" :title="singer.name" :bg-image="singer.avatar"></music-list>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer.js'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song.js'
import { ERR_OK } from 'api/config.js'
import MusicList from 'components/music-list/music-list.vue'
export default {
  data () {
    return {
      songList: []
    }
  },
  created () {
    this._getSingerDetail()
  },
  computed: {
    ...mapGetters(['singer'])
  },
  components: {
    MusicList
  },
  methods: {
    // 获取数据：获取歌手详情
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((list) => {
            this.songList = list
          })
        }
      })
    },
    // 格式化歌曲方法
    _normalizeSongs (list) {
      let rect = []
      list.forEach(item => {
        let { musicData } = item
        if (isValidMusic(musicData)) {
          rect.push(createSong(musicData))
        }
      })
      return rect
    }
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

.singer-detail {
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: $color-background;
}
</style>
