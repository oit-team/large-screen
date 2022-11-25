import { post } from './index'

/**
 * 获取菜单列表
 */
export function getTreeMenuList(params) {
  return post('/system/menu/getTreeMenuList', params, {
    cmd: 10008,
  })
}

export function dictitemInfoAllMethod(params) {
  return post('/goods/dictitemInfo/dictitemInfoAllMethod', params, {
    cmd: 100009,
  })
}

export function getJsonData(code) {
  return post('/system/menu/getJsonData', { code })
}
