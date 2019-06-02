import * as types from './mutation-types'
import { playMode } from 'common/js/config.js'
import { shuffle } from 'common/js/utils.js'
import { saveSearch, deleteSearch, clearSearch } from 'common/js/cache.js'

function findIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
}
export const randomPlay = function ({ commit, state }, { list }) {
  let arr = shuffle(list)
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_LIST, arr)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
}
export const insertSong = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前的歌曲
  let currentSong = playList[currentIndex]
  let findex = findIndex(playList, song)
  // 插入操作，索引要+1
  currentIndex++
  playList.splice(currentIndex, 0, song)
  // 判断歌曲是否已存在
  if (findex > -1) {
    if (currentIndex > findex) {
      playList.splice(findex, 1)
      currentIndex--
    } else {
      playList.splice(findex + 1, 1)
    }
  }
  // 处理sequenceList
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  // 提交commit
  commit(types.SET_PLAYING, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

// 保存搜索历史
export const saveSearchHistory = function ({ commit }, query) {
  commit('SET_SEARCH_HISTORY', saveSearch(query))
}
// 删除单个搜索历史
export const deleteSearchHistory = function ({ commit }, query) {
  commit('SET_SEARCH_HISTORY', deleteSearch(query))
}
// 清空搜索历史
export const clearSearchHistory = function ({ commit }) {
  commit('SET_SEARCH_HISTORY', clearSearch())
}
