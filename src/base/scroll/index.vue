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
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
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
    // 滚动组件：代理滚动到指定位置方法
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 滚动组件：代理滚动到指定元素方法
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
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
      // 是否监听滚动事件
      let _self = this
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          _self.$emit('scroll', pos)
        })
      }
      // 是否上拉加载
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            _self.$emit('scrollEnd')
          }
        })
      }
      // 是否监听滚动开始事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          _self.$emit('beforeScroll')
        })
      }
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
