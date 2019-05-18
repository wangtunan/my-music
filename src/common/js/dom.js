// 添加样式
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  el.classList.add(className)
}
// 判断是否存在样式
export function hasClass (el, className) {
  return el.classList.contains(className)
}
