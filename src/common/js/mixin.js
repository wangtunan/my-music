import { mapGetters } from 'vuex'
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
