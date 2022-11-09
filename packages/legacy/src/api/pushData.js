import API_SERVICE from './API_SERVICE'
import { post } from './index'

/**
 * 范围数据初始化
 * @param params
 * @param {string} params.bsCode 业务编号
 * @param {string} params.orgId 机构ID
 * @param {number} params.brandId 品牌编号
 * @param {number} cmd
 */
export function scopePush(params, cmd) {
  return post(`${API_SERVICE.PUSH_DATA}/scope/push`, params, { cmd })
}

/**
 * 商品数据初始化
 * @param params
 * @param {string} params.bsCode 业务编号
 * @param {string} params.orgId 机构ID
 * @param {number} params.brandId 品牌编号
 * @param {number} cmd
 */
export function scopeGoods(params, cmd) {
  return post(`${API_SERVICE.PUSH_DATA}/scope/goods`, params, { cmd })
}

/**
 * 计算规则数据初始化
 * @param params
 * @param {string} params.bsCode 业务编号
 * @param {string} params.orgId 机构ID
 * @param {number} params.bsCodeFlag 为空则表示加载公共规则，不为空则加载品牌自定义规则
 * @param {number} cmd
 */
export function calcPush(params, cmd) {
  return post(`${API_SERVICE.PUSH_DATA}/calca/push`, params, { cmd })
}
