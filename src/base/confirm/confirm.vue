<template>
  <div class="confirm" v-show="isShow">
    <div class="confirm-wrapper">
      <div class="confirm-content">
        <p class="text">{{text}}</p>
        <div class="operator-wrapper">
          <div class="operator-btn left" @click="cancel">{{cancelButtonText}}</div>
          <div class="operator-btn" @click="confirm">{{confirmButtonText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    // 显示方法
    show () {
      this.isShow = true
    },
    // 隐藏方法
    hide () {
      this.isShow = false
    },
    // 确定方法
    confirm () {
      this.hide()
      this.$emit('confirm')
    },
    // 取消方法
    cancel () {
      this.hide()
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'

  .confirm
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background: $color-background-d
    .confirm-wrapper
      position: absolute
      left: 50%
      top: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .confirm-content
        width: 270px
        border-radius: 10px
        background: $color-highlight-background
        .text
          padding: 20px 15px
          line-height: 22px
          text-align: center
          color: $color-text-l
          font-size: $font-size-medium
        .operator-wrapper
          display: flex
          align-items: center
          text-align: center
          font-size: $font-size-medium
          .operator-btn
            flex: 1
            padding: 10px 0
            line-height: 22px
            border-top: 1px solid $color-background-d
            color: $color-text-l
            &.left
              border-right: 1px solid $color-background-d
</style>
