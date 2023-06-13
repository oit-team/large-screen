import { post } from './index'
/**
 * 客户管理
 */
export function getWeChatUserInfoList(params) {
  return post('/system/weChatUser/getWeChatUserInfoList', params)
}
