<template>
  <scroll class="listview" :data="data">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group">
        <h2 class="list-group-title">{{group.name}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) in group.items" :key="index">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/index.vue'
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      probeType: 3
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background-color: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        padding-left: 20px
        height: 30px
        line-height: 30px
        color: $color-text-l
        background: $color-highlight-background
        font-size: $font-size-small
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          margin-right: 20px
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          color: $color-text-l
          font-size: $font-size-medium
</style>
