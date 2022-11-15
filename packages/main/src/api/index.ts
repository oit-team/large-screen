import axios from 'axios'
import Vue from 'vue'
import { Message } from 'element-ui'
import type { ApiErrorOptions } from './ApiError'
import ApiError from './ApiError'
import { getToken } from '@/utils/auth'

function createApiError(options: ApiErrorOptions) {
  return new ApiError(options).reject()
}

axios.defaults.baseURL = '/api'

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  config.headers!.token = getToken()
  return config
}, (error: any) => {
  return createApiError({ error })
})

// 添加响应拦截器
axios.interceptors.response.use((response) => {
  if (response.data.head?.status !== 0) {
    return createApiError({
      url: response?.config.url,
      response,
      message: response.data.head.msg,
      code: response.data.head.status,
      status: response.status,
    })
  }
  return response
}, async (error) => {
  return createApiError({
    error,
    url: error?.config?.url,
    message: error?.errMsg,
  })
})

export function post(url: string, params: any = {}, config: any = {}) {
  const userData: any = {
    userId: sessionStorage.userId,
    brandId: sessionStorage.brandId,
  }

  const formattedParams = {
    head: {
      aid: userData.userId,
      ver: '1.0',
      ln: 'cn',
      mod: 'home',
      de: '2019-10-16',
      sync: 1,
      cmd: config.cmd,
      uuid: userData.brandId,
      chcode: 'ef19843298ae8f2134f',
    },
    con: params,
  }

  return axios.post(url, formattedParams).then((res: any) => res.data)
}

Vue.config.errorHandler = (err, vm) => {
  if (err instanceof ApiError) {
    // 处理接口错误
    Message.warning(err.message)
  }

  console.error(err)
  Vue.util.warn(err.message, vm)
}
