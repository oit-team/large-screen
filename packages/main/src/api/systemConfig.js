import { post } from './index'

/*
  系统配置
*/
export function getDictType(params) {
  return post('/system/menu/getDictType', params)
}
export function getConfigList(params) {
  return post('/system/menu/getConfigList', params)
}

/* 类型 */
export function addDictInfo(params) {
  return post('/system/menu/addDictInfo', params)
}

export function updateDictInfo(params) {
  return post('/system/menu/updateDictInfo', params)
}

/* 配置 */
export function addDictitemInfo(params) {
  return post('/system/menu/addDictitemInfo', params)
}
export function updateDictitemInfo(params) {
  return post('/system/menu/updateDictitemInfo', params)
}

export function getConfigDetailed(params) {
  return post('/system/menu/getConfigDetailed', params)
}