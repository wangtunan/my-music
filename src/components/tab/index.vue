<template>
  <div class="tab">
    <router-link tag="div" v-for="item in tabList" :key="item.id" class="tab-item" :to="item.url">
      <span class="tab-link">{{item.text}}</span>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'TabIndex',
  data () {
    return {
      tabList: []
    }
  },
  created () {
    this.tabList = [
      { id: 1, url: '/recommend', text: '推荐' },
      { id: 2, url: '/singer', text: '歌手' },
      { id: 3, url: '/rank', text: '排行' },
      { id: 4, url: '/search', text: '搜索' }
    ]
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'

  .tab
    display: flex
    height: 44px
    line-height: 44px
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
        font-size: $font-size-medium
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>
