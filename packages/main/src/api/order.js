import { post } from './index'

/*
  采购订单管理（列表、详情）
*/
export function getProcurementOrderList(params) {
  return post('/jackpot/procurement/getProcurementOrderList', params)
}

export function getProcurementOrderById(params) {
  return post('/jackpot/procurement/getProcurementOrderById', params)
}

export function dictitemInfoAllMethod(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    cmd: 100009,
  })
}

export function alipay(params) {
  return post('/system/pay/alipay', params)
}
