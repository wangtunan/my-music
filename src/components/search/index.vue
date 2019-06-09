<template>
  <div class="search">
    <!-- 搜索组件 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!-- shortcut-wrapper -->
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="scrollData" ref="shortcut">
        <div>
          <!-- 热门搜索 -->
          <div class="hot-key">
            <h2 class="title">热门搜索</h2>
            <ul>
              <li class="item" v-for="item in hotKey" :key="item.n" @click="addQuery(item.k)">{{item.k}}</li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div class="search-history-wrapper" v-show="searchHistory && searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="handleClearSearch">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :list="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 搜素结果 -->
    <div class="suggestion-wrapper" v-show="query" ref="searchResult">
      <suggestion ref="suggestion" :query="query" @list-scroll="blurInput" @select="saveSearch"></suggestion>
    </div>
    <!-- confirm弹出 -->
    <confirm ref="confirm"  text="是否清空所有搜索历史" confirmButtonText="清空" @confirm="clearSearchHistory"></confirm>
    <!-- 路由 -->
    <router-view></router-view>
  </div>
</template>
<script>
import SearchBox from 'base/search-box/search-box.vue'
import Suggestion from 'components/suggestion/suggestion.vue'
import SearchList from 'base/search-list/search-list.vue'
import Confirm from 'base/confirm/confirm.vue'
import Scroll from 'base/scroll/index.vue'
import { getHotKey } from 'api/search.js'
import { ERR_OK } from 'api/config.js'
import { mapActions } from 'vuex'
import { playListMixin, searchMixin } from 'common/js/mixin.js'
export default {
  name: 'SearchIndex',
  mixins: [playListMixin, searchMixin],
  data () {
    return {
      hotKey: [],
      isShow: false
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    // mixin: 重新计算bottom
    handlePlayList (list) {
      let bottom = list.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggestion.refresh()
    },
    // 搜索历史：清空
    handleClearSearch () {
      this.$refs.confirm.show()
    },
    // 获取数据：获取热门搜索
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  computed: {
    scrollData () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggestion,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

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
            border-radius: 5px
            color: $color-text-d
            font-size: $font-size-medium
            background: $color-highlight-background
        .search-history-wrapper
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            line-height: 40px
            color: $color-text-l
            font-size: $font-size-medium
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-l
    .suggestion-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      overflow: hidden
</style>
