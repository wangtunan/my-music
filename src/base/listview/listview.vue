<template>
  <scroll class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="handleListViewScroll"
    :probe-type="probeType">
    <!-- 列表 -->
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.name}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) in group.items" :key="index">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 快速入口 -->
    <div class="list-shortcut">
      <ul>
        <li class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :class="{active: curIndex==index}"
          @touchstart="handleShortcutTouchStart"
          @touchmove.stop.prevent="handleShortcutTouchMove"
          @touchend="handleShortcutTouchEnd"
          :data-index="index"
        >{{item}}</li>
      </ul>
    </div>
    <!-- fixedtitle -->
    <div class="fixed-container" v-show="currentShortcutTitle" ref="fixTitle">
      <h2 class="fixed-title">{{currentShortcutTitle}}</h2>
    </div>
    <!-- 当前点击的快速入口字母 -->
    <div class="loading-container" v-if="showCurShortcut && currentShortcutTitle">
      <span class="current-shortcut">{{currentShortcutTitle}}</span>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/index.vue'
import { getData } from 'common/js/dom.js'
const SHORTCUT_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  name: 'ListView',
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
      diff: -1, // 滚动高度差
      scrollY: -1, // y轴滚动的距离
      curIndex: 0, // 快速入口当前项的索引
      showCurShortcut: false, // 是否显示当前苦快速入口的字母
      probeType: 3, // 滚动组件的滚动类型
      listenScroll: true // 是否监听滚动列表滚动事件
    }
  },
  created () {
    // 定义touch变量，不需要监听它的数据变动
    this.touch = {}
    // 定义列表高度列表，不需要监听它的数据变动
    this.listHeightArr = []
  },
  mounted () {
    // 计算列表的高度数组
    this.mountedTimer = setTimeout(() => {
      this._calculateHeight()
    }, 20)
  },
  computed: {
    // 计算属性：快速入口
    shortcutList () {
      return this.data.map(group => {
        return group.name.substring(0, 1)
      })
    },
    // 计算属性：当前入口的字母
    currentShortcutTitle () {
      if (this.scrollY >= 0) {
        return ''
      }
      return this.data[this.curIndex] ? this.data[this.curIndex].name : ''
    }
  },
  components: {
    Scroll
  },
  methods: {
    // 列表：滚动事件
    handleListViewScroll (pos) {
      this.scrollY = pos.y
    },
    // 快速入口：touchstart事件
    handleShortcutTouchStart (e) {
      let index = getData(e.target, 'index')
      this.showCurShortcut = true
      this.touch.y1 = e.touches[0].pageY
      this.touch.touchIndex = index
      this._scrollToElement(index)
    },
    // 快速入口：touchmove事件
    handleShortcutTouchMove (e) {
      this.touch.y2 = e.touches[0].pageY
      let diffY = this.touch.y2 - this.touch.y1
      let delta = diffY / SHORTCUT_HEIGHT | 0
      let index = parseInt(this.touch.touchIndex) + delta
      this._scrollToElement(index)
    },
    // 快速入口：touchend事件
    handleShortcutTouchEnd (e) {
      this.showCurShortcut = false
    },
    // 快速入口：滚动到指定元素
    _scrollToElement (index) {
      if (index <= 0) {
        index = 0
      } else if (index > this.$refs.listGroup.length - 1) {
        index = this.$refs.listGroup.length - 1
      }
      this.curIndex = index
      this.$refs.listview.scrollToElement(this.$refs.listGroup[this.curIndex], 0)
    },
    // 滚动列表：计算列表高度数据
    _calculateHeight () {
      let list = this.$refs.listGroup
      let height = 0
      this.listHeightArr = []
      this.listHeightArr.push(height)
      for (let index = 0; index < list.length; index++) {
        let item = list[index]
        height += item.clientHeight
        this.listHeightArr.push(height)
      }
    }
  },
  watch: {
    scrollY (newY) {
      // 当-newY > 0时
      if (newY >= 0) {
        this.curIndex = 0
        return
      }
      // 当在中间的时候
      for (let index = 0; index < this.listHeightArr.length - 1; index++) {
        let firstHeight = this.listHeightArr[index]
        let lastHeight = this.listHeightArr[index + 1]
        if (-newY >= firstHeight && -newY < lastHeight) {
          this.curIndex = index
          this.diff = lastHeight + newY
          return
        }
      }
      // 当在顶部的时候
      this.curIndex = this.listHeightArr.length - 2
    },
    diff (newDiff) {
      let fixTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0
      if (this.fixTop === fixTop) {
        return
      }
      this.fixTop = fixTop
      this.$refs.fixTitle.style.transform = `translate3d(0, ${this.fixTop}px, 0)`
    }
  },
  beforeDestroy () {
    clearTimeout(this.mountedTimer)
    this.mountedTimer = null
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
    .list-shortcut
      position: absolute
      right: 0
      top: 50%
      transform: translate(0, -50%)
      width: 20px
      padding: 20px 0
      border-radius: 15px
      background-color: $color-background-d
      text-align: center
      font-family: Helvetica
      .item
        padding: 3px 0
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.active
          color: $color-theme
    .fixed-container
      position: absolute
      left: 0
      top: 0
      width: 100%
      .fixed-title
        padding-left: 20px
        height: 30px
        line-height: 30px
        background-color: $color-highlight-background
        color: $color-text-l
        font-size: $font-size-small
        font-family: Helvetica
    .current-shortcut
      padding: 20px
      background-color: $color-background-d
      color: $color-theme
      font-size: $font-size-large-x
</style>
