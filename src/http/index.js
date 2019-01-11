
/**
 * Created by yjn on 2018/12/14
 */

import axios from 'axios'
import {Message} from 'element-ui'
import { API_URL } from '../constant'

let cancel ,promiseArr = {}
let appKey = '20182001114'
let signature = '79E48482F30ED5CA96DCBB4DFA43D1576DBC2B74'
// 创建一个 axios 实列
const http = axios.create({
    // 超时
    timeout: 5000,
    // 接口跟域名
    // baseURL: API_URL,
    baseURL: '/api/',
    // 请求头配置
    headers: {
        'Content-Type': 'application/json',
        'appKey': appKey,
    },
    // 携带cookie
    withCredentials: true
})

//请求拦截器
http.interceptors.request.use(config => {
    //发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) {
        promiseArr[config.url]('操作取消')
        promiseArr[config.url] = cancel
    } else {
        promiseArr[config.url] = cancel
    }
      return config
}, error => {
    return Promise.reject(error)
})

//响应拦截器即异常处理
http.interceptors.response.use(response => {
    return response
}, err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '错误请求'
          break;
        case 401:
          err.message = '未授权，请重新登录'
          break;
        case 403:
          err.message = '拒绝访问'
          break;
        case 404:
          err.message = '请求错误,未找到该资源'
          break;
        case 405:
          err.message = '请求方法未允许'
          break;
        case 408:
          err.message = '请求超时'
          break;
        case 500:
          err.message = '服务器端出错'
          break;
        case 501:
          err.message = '网络未实现'
          break;
        case 502:
          err.message = '网络错误'
          break;
        case 503:
          err.message = '服务不可用'
          break;
        case 504:
          err.message = '网络超时'
          break;
        case 505:
          err.message = 'http版本不支持该请求'
          break;
        default:
          err.message = `连接错误${err.response.status}`
      }
    } else {
      err.message = "连接到服务器失败"
    }
    Message({
        message: err.message
    })
      return Promise.resolve(err.response)
})



export default http
