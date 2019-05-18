import axios from 'axios'
import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from 'api/config.js'

// 获取滚动轮播数据接口
export function getRecommend () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 获取推荐歌单数据接口
export function getDiscList () {
  let url = '/api/getDiscList'
  let params = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 19
  })
  return axios.get(url, {
    params: params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
