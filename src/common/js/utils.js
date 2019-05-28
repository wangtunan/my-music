// 获取制定数字之间的随机数
export function getRandomNumber (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 打乱数组
export function shuffle (arr) {
  let _arr = arr.concat([])
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomNumber(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}
