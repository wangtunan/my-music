import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config.js'
import { shuffle } from 'common/js/utils.js'

export const playListMixin = {
  mounted () {
    this.handlePlayList(this.playList)
  },
  computed: {
    ...mapGetters(['playList'])
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  methods: {
    handlePlayList (list) {
      throw new Error('component must implment handlePlayList method')
    }
  },
  watch: {
    playList (newList) {
      this.handlePlayList(newList)
    }
  }
}

export const playerMixin = {
  computed: {
    // 计算属性：计算播放模式样式
    iconMode () {
      let mode = ''
      for (const key in playMode) {
        if (playMode[key] === this.mode) {
          mode = key
          break
        }
      }
      return `icon-${mode}`
    },
    favoriteIcon () {
      return this.getFavoriteIcon(this.currentSong)
    },
    // vuex
    ...mapGetters([
      'playList',
      'currentSong',
      'mode',
      'sequenceList',
      'favoriteList'
    ])
  },
  methods: {
    // 播放模式改变
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      // 处理随机播放
      let list = []
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 重置当前歌曲的索引
    resetCurrentIndex (list) {
      let findIndex = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(findIndex)
    },
    // 喜欢or不喜欢toggle
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    // 获取喜欢的样式
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    // 判断当前歌曲是否喜欢
    isFavorite (song) {
      let index = this.favoriteList.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
    },
    // vuex
    ...mapMutations({
      setPlayState: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data () {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange (query) {
      this.query = query
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    blurInput () {
      let searchBox = this.$refs.searchBox
      searchBox && searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
