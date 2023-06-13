import { post } from './index'
/**
 * 服务列表
 */
export function getServiceInfoList(params) {
  return post('/system/serviceInfo/getServiceInfoList', params)
}

/**
 * 新增修改
 */
export function addOrUpdateServiceInfo(params) {
  return post('/system/serviceInfo/addOrUpdateServiceInfo', params)
}

/**
 * 详情
 */
export function getServiceInfoDetail(params) {
  return post('/system/serviceInfo/getServiceInfoDetail', params)
}

/**
 * 删除修改
 */
export function deleteServiceInfo(params) {
  return post('/system/serviceInfo/deleteServiceInfo', params)
}

/**
 * 上下架
 */
export function upAndDownServiceInfo(params) {
  return post('/system/serviceInfo/upAndDownServiceInfo', params)
}

/**
 * 服务订单列表
 */
export function getServiceOrderList(params) {
  return post('/system/serviceOrder/getServiceOrderList', params)
}

/**
 * 服务订单详情
 */
export function getServiceOrderDetail(params) {
  return post('/system/serviceOrder/getServiceOrderDetail', params)
}

