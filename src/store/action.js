import * as types from './mutation-types'
import { playMode } from 'common/js/config.js'
import { shuffle } from 'common/js/utils.js'

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
