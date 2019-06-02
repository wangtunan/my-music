<template>
  <div class="search">
    <!-- 搜索组件 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="handleQueryChange"></search-box>
    </div>
    <!-- shortcut-wrapper -->
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h2 class="title">热门搜索</h2>
          <ul>
            <li class="item" v-for="item in hotKey" :key="item.n" @click="handleHotKeyClick(item)">{{item.k}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 搜素结果 -->
    <div class="suggestion-wrapper" v-show="query">
      <suggestion :query="query"></suggestion>
    </div>
  </div>
</template>
<script>
import SearchBox from 'base/search-box/search-box.vue'
import Suggestion from 'components/suggestion/suggestion.vue'
import { getHotKey } from 'api/search.js'
import { ERR_OK } from 'api/config.js'
export default {
  name: 'SearchIndex',
  data () {
    return {
      query: '',
      hotKey: []
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    // 搜索组件：关键词改变事件
    handleQueryChange (query) {
      this.query = query
    },
    // 热门搜索：点击事件
    handleHotKeyClick (item) {
      this.$refs.searchBox.setQuery(item.k)
    },
    // 获取数据：获取热门搜索
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  components: {
    SearchBox,
    Suggestion
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            color: $color-text-l
            font-size: $font-size-medium
          .item
            display: inline-block
            margin: 0 20px 10px 0
            padding: 5px 10px
            border-radius: 15px
            color: $color-text-d
            font-size: $font-size-medium
            background: $color-highlight-background
    .suggestion-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      overflow: hidden
</style>
