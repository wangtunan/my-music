import storage from 'good-storage'
const SEARCH_PREFIX = '_search_'
const SEARCH_MAX_LENGTH = 15
const PLAY_PREFIX = '_play_'
const PLAY_MAX_LENGTH = 100

function insertArray (arr, val, compare, maxLen) {
  let rect = arr.slice()
  let index = rect.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    rect.splice(index, 1)
  }
  rect.unshift(val)
  // 是否超过限制的长度
  if (maxLen && rect.length > maxLen) {
    rect.pop()
  }
  return rect
}

// 保存搜索历史
export function saveSearch (query) {
  let searches = storage.get(SEARCH_PREFIX, [])
  searches = insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_PREFIX, searches)
  return searches
}
// 删除单个搜索历史
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_PREFIX, [])
  let index = searches.findIndex(item => {
    return item === query
  })
  if (index > -1) {
    searches.splice(index, 1)
  }
  storage.set(SEARCH_PREFIX, searches)
  return searches
}
// 清空搜索历史
export function clearSearch () {
  storage.remove(SEARCH_PREFIX)
  return []
}
// 获取搜索历史
export function getSearch () {
  return storage.get(SEARCH_PREFIX, [])
}

// 保存播放历史
export function savePlay (song) {
  let history = storage.get(PLAY_PREFIX, [])
  history = insertArray(history, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_PREFIX, history)
  return history
}
// 读取播放历史
export function getPlay () {
  return storage.get(PLAY_PREFIX, [])
}
