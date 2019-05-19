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
// 获取元素的data扩展数据
export function getData (el, name) {
  let prefix = 'data-'
  return el.getAttribute(prefix + name)
}
