<template>
  <transition name="fade">
    <div class="top-tips" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'

  .top-tips
    z-index: 500
    position: fixed
    top: 0
    width: 100%
    background-color: $color-dialog-background
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.3s
    &.fade-enter, &.fade-leave-to
      transform: translate3d(0, -100%, 0)
</style>
