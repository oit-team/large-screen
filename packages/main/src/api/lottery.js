import { post } from './index'

/*
  核销记录
*/
export function getLotteryRecordList(params) {
  return post('/jackpot/jackpotInfo/getLotteryRecordList', params)
}
