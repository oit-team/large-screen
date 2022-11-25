import { post } from './index'

/*
  奖池新增、修改、详情、列表
*/
export function addJackpotStyle(params) {
  return post('/jackpot/jackpotInfo/addJackpotStyle', params)
}

export function getJackpotById(params) {
  return post('/jackpot/jackpotInfo/getJackpotById', params)
}

export function updateJackpotStyle(params) {
  return post('/jackpot/jackpotInfo/updateJackpotStyle', params)
}

export function getJackpotStyleAll(params) {
  return post('/jackpot/jackpotInfo/getJackpotStyleAll', params)
}

// 上下架
export function updateJackpotByState(params) {
  return post('/jackpot/jackpotInfo/updateJackpotByState', params)
}

export function deleteJackpotInfo(params) {
  return post('/jackpot/jackpotInfo/deleteJackpotInfo', params)
}

/*
  公共奖池
*/
export function getJackpotStyles(params) {
  return post('/jackpot/jackpotInfo/getJackpotStyles', params)
}

export function updateJackpotAuditState(params) {
  return post('/jackpot/jackpotInfo/updateJackpotAuditState', params)
}

export function getJacpotAuditList(params) {
  return post('/jackpot/procurement/getJacpotAuditList', params)
}
