import { post } from './index'

/*
  角色管理
*/
export function getRoleList(params) {
  return post('/system/role/getRoleList', params)
}
// 新增
export function insertRole(params) {
  return post('/system/role/insertRole', params)
}
// 修改
export function updateRoleById(params) {
  return post('/system/role/updateRoleById', params)
}

// 删除
export function delRoleById(params) {
  return post('/system/role/delRoleById', params)
}

// 获取授权列表
export function getRoleUserList(params) {
  return post('/system/role/getRoleUserList', params)
}

// 授权
export function addUserAndRole(params) {
  return post('/system/user/addUserAndRole', params)
}

// 菜单树列表
export function getTreeMenuList(params) {
  return post('/system/menu/getTreeMenuList', params, {
    cmd: 10008,
  })
}
