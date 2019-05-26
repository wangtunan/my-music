export function formatTime (time) {
  time = time | 0
  let minute = time / 60 | 0
  let second = time % 60 | 0
  return `${minute}:${second < 10 ? '0' + second : second}`
}
