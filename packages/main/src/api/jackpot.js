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

// 录入公共奖池
export function addJackpotInfoRequest(params) {
  return post('/jackpot/jackpotInfo/addJackpotInfoRequest', params)
}

// 查询采购的公共奖池商品列表
export function getJackpotStyleList(params) {
  return post('/jackpot/procurement/getJackpotStyleList', params)
}

// 新增采购商品
export function addProcurementOrder(params) {
  return post('/jackpot/procurement/addProcurementOrder', params)
}

export function getIndustryAll(params) {
  return post('/system/brand/getIndustryAll', params)
}

// 查询店铺积分数 新增奖券加入购物车
export function getShopByIntegralNum(params) {
  return post('/jackpot/procurement/getShopByIntegralNum', params)
}

// -----------活动----------
/**
 * 新增活动
 * @param {*} params
 * @returns
 */
export function addActivity(params) {
  return post('jackpot/activity/addActivity', params)
}

/**
 * 活动列表
 * @param {*} params
 * @returns
 */
export function getActivityList(params) {
  return post('jackpot/activity/getActivityList', params)
}

/**
 * 活动详情
 * @param {*} params
 * @returns
 */
export function getActivityById(params) {
  return post('jackpot/activity/getActivityById', params)
}

/**
 * 修改活动
 * @param {*} params
 * @returns
 */
export function updateActivity(params) {
  return post('jackpot/activity/updateActivity', params)
}

/**
 * 删除活动
 * @param {*} params
 * @returns
 */
export function deleteActivity(params) {
  return post('jackpot/activity/deleteActivity', params)
}

/**
 * 活动上下架
 * @param {*} params
 * @returns
 */
export function updateActivityStatus(params) {
  return post('jackpot/activity/updateActivityStatus', params)
}
