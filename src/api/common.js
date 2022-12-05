import { post } from './index'

// 发送指令
export function sendCommandToDevice(params) {
  return post('/liveBroadcast/device/sendCommandToDevice', params)
}
