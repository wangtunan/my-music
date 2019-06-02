<template>
  <div class="search-list" v-show="list.length">
    <ul>
      <li class="item" v-for="(item,index) in list" :key="index" @click="handleItemClick(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="handleDeleteClick(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    // 搜索历史历史点击事件
    handleItemClick (item) {
      this.$emit('select', item)
    },
    // 搜索历史删除事件
    handleDeleteClick (item) {
      this.$emit('delete', item)
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'
  .search-list
    .item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      color: $color-text-l
      font-size: $font-size-medium
      .text
        flex: 1
      .icon
        extend-click()
        .icon-delete
          color: $color-text-l
          font-size: $font-size-medium
</style>
