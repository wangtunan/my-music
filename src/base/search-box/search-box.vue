<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="input" v-model="query" type="text" class="box" :placeholder="placeholder">
    <i class="icon-dismiss" v-show="query" @click="handleClearClick"></i>
  </div>
</template>
<script>
import { debounce } from 'utils/utils.js'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  methods: {
    // 设置搜索关键词
    setQuery (query) {
      this.query = query
    },
    // 清空搜索结果
    handleClearClick () {
      this.query = ''
    },
    // 失去焦点事件
    blur () {
      this.$refs.input.blur()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'

  .search-box
    display: flex
    align-items: center
    width: 100%
    height: 40px
    padding: 0 6px
    box-sizing: border-box
    border-radius: 6px
    background: $color-highlight-background
    .icon-search
      font-size: 24px
      color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-text-d
    .box
      flex: 1
      margin: 0 5px
      outline: 0
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
</style>
