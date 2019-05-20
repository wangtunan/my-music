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

// 获取浏览器厂商前缀
let elementStyle = document.createElement('div').style
let vender = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
export function prefixStyle (style) {
  if (vender === false) {
    return false
  }
  return vender + style.charAt(0).toUpperCase() + style.substring(1)
}
