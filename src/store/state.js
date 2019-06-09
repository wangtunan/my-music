import { playMode } from 'common/js/config.js'
import { getSearch, getPlay } from 'common/js/cache.js'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: getSearch(),
  playHistory: getPlay()
}

export default state
