<template>
  <div class="rank" ref="rank">
    <scroll class="top-list" :data="topList" ref="topList">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="handleItemClick(item)">
          <div class="img-wrapper">
            <img v-lazy="item.picUrl" width="100" height="100" alt="">
          </div>
          <ul class="song-list">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <Loading></Loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Scroll from 'base/scroll/index.vue'
import Loading from 'base/loading/index.vue'
import { getTopList } from 'api/rank.js'
import { ERR_OK } from 'api/config.js'
import { playListMixin } from 'common/js/mixin.js'
import { mapMutations } from 'vuex'
export default {
  name: 'RankIndex',
  mixins: [playListMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    // 重新计算bottom
    handlePlayList (list) {
      let bottom = list.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.topList.refresh()
    },
    // 列表点击事件
    handleItemClick (item) {
      this.$router.push(`/rank/${item.id}`)
      this.setTopList(item)
    },
    // 获取排行榜数据
    _getTopList () {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      'setTopList': 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .rank
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .top-list
      width: 100%
      height: 100%
      overflow: hidden
      .item
        display: flex
        align-items: center
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .img-wrapper
          flex: 0 0 100px
          width: 100px
          height: 100px
        .song-list
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          color: $color-text-l
          background: $color-highlight-background
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
</style>
