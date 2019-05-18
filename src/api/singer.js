import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from 'api/config.js'

// 获取歌手列表接口
export function getSingerList () {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  let params = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, params, options)
}
