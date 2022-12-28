import API_SERVICE from './API_SERVICE'
import { post } from './index'

export function getdateToWeek(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/book/getdateToWeek`, params)
}

export function getContextDeviceList(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/device/getContextDeviceList`, params)
}

export function getIntervalHourConfig(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/book/getIntervalHourConfig`, params)
}

export function getIntervalMinuteConfig(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/book/getIntervalMinuteConfig`, params)
}

export function addBookInfo(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/book/addBookInfo`, params)
}

export function getIntegralPay(params) {
  return post('/liveBroadcast/book/getIntegralPay', params)
}
export function getShopByIntegralNum(params) {
  return post('/jackpot/procurement/getShopByIntegralNum', params)
}

