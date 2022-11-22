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
