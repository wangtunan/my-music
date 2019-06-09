<template>
  <div class="search-list" v-show="list.length">
    <transition-group name="list" tag="ul">
      <li class="item" v-for="item in list" :key="item" @click="handleItemClick(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="handleDeleteClick(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
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
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
      .icon
        extend-click()
        .icon-delete
          color: $color-text-l
          font-size: $font-size-medium
</style>
