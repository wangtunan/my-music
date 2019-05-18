<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" alt="">
    <p class="title">{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  .loading
    width: 100%
    text-align: center
    .title
      color: $color-text-l
      font-size: $font-size-small
</style>
