import API_SERVICE from './API_SERVICE'
import { post } from './index'

/**
 * 考核次数查询
 * @param {object} params
 * @param {array} params.brandId
 */
export function getCheckNumber(params) {
  return post(`${API_SERVICE.SYSTEM}/statement/getCheckNumber`, params)
}

/**
 * 获取平台访问量
 * @param {object} params
 * @param params.brandId 品牌ID
 * @param params.startTime 创建开始时间
 * @param params.endTime 创建结束时间
 * @param params.brandName 品牌名称
 * @param params.shopName 店铺名称
 * @param params.nickName 真实姓名
 * @param params.userName 用户名
 * @param params.startVisitTimes 开始访问次数
 * @param params.endVisitTimes 结束访问次数
 */
export function getPlatformPv(params) {
  return post(`${API_SERVICE.SYSTEM}/statement/getPlatformPv`, params)
}

/**
 * 考核次数导出Excel
 * @param params
 * @param params.brandId 品牌ID
 * @param params.rowList 列名List
 * @param params.rowList.shopName 店铺名称
 * @param params.rowList.dTime 创建时间
 * @param params.rowList.avgAssCount 平均次数
 * @param params.rowList.orgStId orgStId
 * @param params.rowList.csNum 计数
 * @param params.rowList.deptName 区域名称
 */
export function exportCheckNumber(params) {
  return post(`${API_SERVICE.SYSTEM}/statement/exportCheckNumber`, params, { responseType: 'arraybuffer' })
}

/**
 * 导出平台访问量信息
 * @param params
 */
export function exportPlatformPv(params) {
  return post(`${API_SERVICE.SYSTEM}/statement/exportPlatformPv`, params, { responseType: 'arraybuffer' })
}

export function getUserList(params) {
  return post('/task/taskManage/getUserList', params)
}

export function delIssue(params) {
  return post('/task/taskManage/delIssue', params)
}
