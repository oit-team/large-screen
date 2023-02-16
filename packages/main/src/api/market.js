import { post } from './index'

/*
  商场配置
*/
export function getBrandConfigById(params) {
  return post('/system/brand/getBrandConfigById', params)
}

export function updateBrandConfig(params) {
  return post('/system/brand/updateBrandConfig', params)
}
