<template>
  <scroll class="suggestion" :data="result">
    <ul class="suggestion-list">
      <li class="item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/index.vue'
import { search } from 'api/search.js'
import { ERR_OK } from 'api/config.js'
import { createSong, isValidMusic } from 'common/js/song.js'
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
      page: 1,
      result: []
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
    // 搜索事件
    _search (query) {
      this.page = 1
      search(query, this.page, this.showSinger, PER_PAGE).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          console.log(this.result)
        }
      })
    },
    // 处理搜索结果
    _genResult (list) {
      let rect = []
      if (list.zhida && list.zhida.singerid) {
        rect.push({...list.zhida, ...{type: TYPE_SINGER}})
      }
      if (list.song) {
        rect = rect.concat(this._normalizeSongs(list.song.list))
      }
      return rect
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
    }
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
    Scroll
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
</style>
