<template>
  <transition appear name="slide">
    <div class="disc">
      <music-list :songs="songList" :title="disc.dissname" :bg-image="disc.imgurl"></music-list>
    </div>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
import { createSong, processSongsUrl, isValidMusic } from 'common/js/song.js'
export default {
  data () {
    return {
      songList: []
    }
  },
  computed: {
    ...mapGetters(['disc'])
  },
  created () {
    this._getSongList()
  },
  methods: {
    // 获取推荐歌单列表
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSons(res.cdlist[0].songlist)).then((list) => {
            this.songList = list
          })
        }
      })
    },
    _normalizeSons (list) {
      let rect = []
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          rect.push(createSong(musicData))
        }
      })
      return rect
    }
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

  .disc {
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: $color-background;
  }
</style>
