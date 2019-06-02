<template>
  <scroll
    ref="suggestion"
    class="suggestion"
    :data="result" :pullup="pullup"
    :before-scroll="beforeScroll"
    @before-scroll="handleBeforeScroll"
    @scrollEnd="handleSearchMore">
    <ul class="suggestion-list">
      <li class="item" v-for="(item,index) in result" :key="index" @click="handleItemClick(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title="正在加载..."></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/index.vue'
import Loading from 'base/loading/index.vue'
import Singer from 'common/js/singer.js'
import NoResult from 'base/no-result/no-result.vue'
import { search } from 'api/search.js'
import { ERR_OK } from 'api/config.js'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song.js'
import { mapMutations, mapActions } from 'vuex'
const PER_PAGE = 20
const TYPE_SINGER = 'singer'
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pullup: true,
      page: 1,
      result: [],
      hasMore: true,
      beforeScroll: true
    }
  },
  methods: {
    // 处理icon的样式
    getIconClass (item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    // 处理搜索展示的名称
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    // 下拉刷新事件
    handleSearchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PER_PAGE).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(result => {
            this.result = this.result.concat(result)
          })
          this._checkMore(res.data)
        }
      })
    },
    // 列表点击事件
    handleItemClick (item) {
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push(`/search/${singer.id}`)
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
    },
    // 开始滚动事件
    handleBeforeScroll () {
      this.$emit('listScroll')
    },
    // 搜索事件
    _search () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggestion.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PER_PAGE).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(result => {
            this.result = result
          })
          this._checkMore(res.data)
        }
      })
    },
    // 处理搜索结果
    _genResult (list) {
      let rect = []
      if (list.zhida && list.zhida.singerid && this.page === 1) {
        rect.push({...list.zhida, ...{type: TYPE_SINGER}})
      }
      return processSongsUrl(this._normalizeSongs(list.song.list)).then(songs => {
        rect = rect.concat(songs)
        return rect
      })
    },
    // 格式化搜索结果
    _normalizeSongs (list) {
      let rect = []
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          rect.push(createSong(musicData))
        }
      })
      return rect
    },
    // 检查是否还有数据
    _checkMore (data) {
      const song = data.song
      if (song.length || (song.curnum + song.curpage * PER_PAGE) >= song.totalnum) {
        this.hasMore = false
      }
    },
    ...mapMutations({
      'setSinger': 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        return
      }
      this._search(newQuery)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  .suggestion
    height: 100%
    overflow: hidden
    .suggestion-list
      padding: 0 30px
      .item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^='icon']
          font-size: $font-size-medium
          color: $color-text-d
      .name
        flex: 1
        color: $color-text-d
        font-size: $font-size-medium
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      left: 50%
      top: 40%
      transform: translate(-50%, -50%)
</style>
