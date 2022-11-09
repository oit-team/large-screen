import { post } from './index'

/**
 * 获取菜单列表
 */
export function getTreeMenuList(params) {
  return post('/system/menu/getTreeMenuList', params, {
    cmd: 10008,
  })
}
