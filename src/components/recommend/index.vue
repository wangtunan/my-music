<template>
  <div class="recommend">
    recommend
  </div>
</template>
<script>
import { getRecommend } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'
export default {
  name: 'RecommendIndex',
  data () {
    return {
      sliderList: []
    }
  },
  mounted () {
    this._getRecommendList()
  },
  methods: {
    // 获取数据：获取轮播数据
    _getRecommendList () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.sliderList = res.data.slider
          console.log(this.sliderList)
        }
      })
    }
  }
}
</script>
