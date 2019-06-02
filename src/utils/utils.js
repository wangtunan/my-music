export function formatTime (time) {
  time = time | 0
  let minute = time / 60 | 0
  let second = time % 60 | 0
  return `${minute}:${second < 10 ? '0' + second : second}`
}
export function debounce (fn, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
