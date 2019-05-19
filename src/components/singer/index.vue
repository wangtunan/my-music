<template>
  <div class="singer">
    <list-view :data="singerList" v-if="singerList.length"></list-view>
    <!-- loading -->
    <div class="loading-container" v-if="!singerList.length">
      <loading></loading>
    </div>
  </div>
</template>
<script>
import Loading from 'base/loading/index.vue'
import ListView from 'base/listview/listview.vue'
import { getSingerList } from 'api/singer.js'
import { ERR_OK } from 'api/config.js'
import Singer from 'common/js/singer.js'
const HOT_NAME = '热门'
const HOT_LENGTH = 10
export default {
  data () {
    return {
      singerList: []
    }
  },
  mounted () {
    setTimeout(() => {
      this._getSingerList()
    }, 20)
  },
  components: {
    ListView,
    Loading
  },
  methods: {
    // 获取数据：获取歌手列表数据
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 格式化歌手数据
    _normalizeSinger (list) {
      let map = {
        hot: {
          name: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 添加热门数据
        if (index < HOT_LENGTH) {
          map.hot.items.push(new Singer({
            id: list[index].Fsinger_mid,
            name: list[index].Fsinger_name
          }))
        }
        // 处理A-Z的字母数据
        const key = list[index].Findex
        if (!map[key]) {
          map[key] = {
            name: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: list[index].Fsinger_mid,
          name: list[index].Fsinger_name
        }))
      })
      // 得到有序列表
      let hot = []
      let others = []
      for (const key in map) {
        let val = map[key]
        if (val.name.match(/[a-zA-Z]/)) {
          others.push(val)
        } else if (val.name === HOT_NAME) {
          hot.push(val)
        }
      }
      // 处理完毕后，按照A-Z进行排序
      others.sort((a, b) => {
        return a.name.charCodeAt(0) - b.name.charCodeAt(0)
      })
      return hot.concat(others)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
