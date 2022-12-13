import { post } from './index'

/*
  积分流水
*/
export function getIntegralBilling(params) {
  return post('/jackpot/procurement/getIntegralBilling', params)
}
