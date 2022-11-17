import { post } from '.'
import { getToken } from '@/utils/auth'

export function login(params) {
  return post('system/user/login', params, {
    cmd: 10008,
  })
}

export function getTokenUser() {
  return post('system/user/getTokenUser')
}

export function getBrands() {
  return post('system/brand/getBrands')
}

export function updatePassWord(params) {
  return post('system/user/updatePassWord', params)
}
