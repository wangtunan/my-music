<template>
  <div class="no-result">
    <div class="icon"></div>
    <p class="text">{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .no-result
    text-align:center
    .icon
      margin: 0 auto
      width: 86px
      height: 90px
      bg-image('no-result')
      background-size: 86px 90px
    .text
      margin-top: 20px
      color: $color-text-d
      font-size: $font-size-medium
</style>
