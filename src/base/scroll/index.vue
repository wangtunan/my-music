<template>
  <div class="scroll-wrapper" ref="scrollWrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mounted () {
    this.mountedTimer = setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    // 滚动组件：代理启用方法
    enable () {
      this.scroll && this.scroll.enable()
    },
    // 滚动组件：代理停用方法
    disable () {
      this.scroll && this.scroll.disable()
    },
    // 滚动组件：代理刷新方法
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    // 滚动组件：初始化
    _initScroll () {
      if (!this.$refs.scrollWrapper) {
        return
      }
      if (this.scroll) {
        this.scroll.refresh()
        return
      }
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        probeType: this.probeType,
        click: this.click
      })
    }
  },
  watch: {
    // 监听：数据变化的时候重新刷新滚动组件
    data () {
      this.watchDataTimer = setTimeout(() => {
        this.scroll.refresh()
      }, 20)
    }
  },
  beforeDestroy () {
    // 清空mounted的定时器
    clearTimeout(this.mountedTimer)
    this.mountedTimer = null
    // 清空watch的定时器
    clearTimeout(this.watchDataTimer)
    this.watchDataTimer = null
  }
}
</script>
