import { post } from '.'
import { getToken } from '@/utils/auth'

export function login(params) {
  return post('system/user/login', params, {
    cmd: 10008,
  })
}

export function getCheckUserInfo() {
  return post('system/user/getCheckUserInfo', {
    token: getToken(),
  })
}
