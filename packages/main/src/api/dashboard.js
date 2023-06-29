import { post } from './index'

/*
  近七天流量监测
*/
export function getPeopleTraffic(params) {
  return post('/liveBroadcast/report/getPeopleTraffic', params)
}

/*
  近七天用户感兴趣趋势
*/
export function getInterested(params) {
  return post('/liveBroadcast/home/getInterested', params)
}

/*
  服务预约
*/
export function getAppointmentReport(params) {
  return post('/liveBroadcast/home/getAppointmentReport', params)
}

/*
  拓客引流
*/
export function getLotteryInteraction(params) {
  return post('/liveBroadcast/home/getLotteryInteraction', params)
}

/*
  用户近七天感兴趣商品排名Top10
*/
export function getTopTenProducts(params) {
  return post('/liveBroadcast/home/getTopTenProducts', params)
}
