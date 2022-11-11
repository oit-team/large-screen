import Axios from 'axios'
import { Message } from 'element-ui'
import API_STATUS from '@/api/API_STATUS'

// axios配置
const axiosConfig = {
  // 请求超时时间
  timeout: 180000,
  baseURL: process.env.NODE_ENV === 'production' ? './gdy' : '/api',
}

// 创建axios实例
const axios = Axios.create(axiosConfig)

/**
 * 请求拦截器
 */
axios.interceptors.request.use((config) => {
  config.headers.userId = sessionStorage.userId
  config.headers.token = sessionStorage.token

  return config
}, (error) => {
  return Promise.reject(error)
})

/**
 * 响应拦截器
 */
axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

const defaultConfig = {
  tips: true,
}

/**
 * post封装
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @param {object} config 配置
 * @param {number} config.cmd 旧的接口定义
 * @param {string} config.mod 旧的接口定义
 */
export function post(url, params = {}, config = {}) {
  const {
    tips,
    cmd,
    mod,
    ...__config
  } = { ...defaultConfig, ...config }

  const userData = {
    userId: sessionStorage.userId,
    brandId: sessionStorage.brandId,
  }

  const formattedParams = {
    head: {
      aid: userData.userId,
      ver: '1.0',
      ln: 'cn',
      cmd,
      mod: mod || 'app',
      de: '2019-10-16',
      sync: 1,
      uuid: userData.brandId,
      chcode: 'ef19843298ae8f2134f',
    },
    con: params,
  }

  return axios.post(url, formattedParams, __config).then((res) => {
    if (res.headers['content-type'] !== 'application/json') {
      return res
    }
    else if (res.data && res.data.head && res.data.head.status === API_STATUS.OK) {
      return res.data
    }
    else {
      tips && Message.error(res.data.head.msg)
      return Promise.reject(res.data)
    }
  }).catch((err) => {
    return Promise.reject(err)
  })
}

export default axios
