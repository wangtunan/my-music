<template>
  <div class="header">
    <span class="icon"></span>
    <span class="text">Chicken Music</span>
  </div>
</template>
<script>
export default {
  name: 'MHeader'
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .header
    position: relative
    height: 44px
    font-size: 0
    text-align: center
    color: $color-theme
    & > span
      display: inline-block
      vertical-align: middle
    .icon
      margin-top: -4px
      margin-right: 6px
      width: 30px
      height: 32px
      bg-image('logo')
      background-size: 30px 32px
    .text
      line-height: 44px
      font-size: $font-size-large
</style>
