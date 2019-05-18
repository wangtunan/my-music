<template>
  <div class="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <!-- 滚动轮播 -->
        <div v-if="sliderList.length" class="slider-wrapper">
          <div class="slider-content">
            <slider>
              <div v-for="item in sliderList" :key="item.id">
                <a :href="item.linkUrl">
                  <img @onload="handleImageLoad" :src="item.picUrl" alt="">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <!-- 推荐歌单 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in discList" :key="item.dissid">
              <div class="img-wrapper">
                <img v-lazy="item.imgurl" width="60" height="60" alt="">
              </div>
              <div class="text">
                <p class="desc">{{item.dissname}}</p>
                <p class="name">{{item.creator.name}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-if="!discList.length">
      <loading></loading>
    </div>
  </div>
</template>
<script>
import Scroll from 'base/scroll/index.vue'
import Slider from 'base/slider/index.vue'
import Loading from 'base/loading/index.vue'
import { getRecommend, getDiscList } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
export default {
  name: 'RecommendIndex',
  data () {
    return {
      sliderList: [], // 滚动轮播数据
      discList: [] // 推荐歌单数据
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  mounted () {
    this._getRecommendList()
    this._getDiscList()
  },
  methods: {
    // 滚动轮播：监听图片加载事件
    handleImageLoad () {
      let isCheckLoading = false
      if (!isCheckLoading) {
        this.isCheckLoading = true
        this.$refs.scroll.refresh()
      }
    },
    // 获取数据：获取轮播数据
    _getRecommendList () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.sliderList = res.data.slider
        }
      })
    },
    // 获取数据：获取推荐歌单数据
    _getDiscList () {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable.styl'
  .recommend
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .slider-wrapper
      position: relative
      width: 100%
      height: 0
      padding-top: 40%
      overflow: hidden
      .slider-content
        position: absolute
        left: 0
        top: 0
        right: 0
        bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          padding: 0 20px 20px 20px
          align-items: center
          box-sizing: border-box
          .img-wrapper
            flex: 0 0 60px
            width: 60px
            margin-right: 20px
          .text
            flex: 1
            dispaly: flex
            flex-direction: column
            justify-content: center
            line-height: 20px
            font-size: $font-size-medium
            .desc
              margin-bottom: 10px
              color: $color-text
            .name
              color: $color-text-l
    .loading-container
      position: fixed
      left: 50%
      top: 50%
      z-index: 99
      transform: translate(-50%, -50%)
</style>
