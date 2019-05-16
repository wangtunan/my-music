import originJSONP from 'jsonp'

export default function jsonp (url, data, options) {
  return new Promise((resolve, reject) => {
    url += (url.includes('?') ? '&' : '?') + paramsToUrl(data)
    originJSONP(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function paramsToUrl (params) {
  let url = ''
  for (const key in params) {
    if (params[key] !== undefined) {
      url += `&${key}=${encodeURIComponent(params[key])}`
    }
  }
  return url ? url.substring(1) : ''
}
