import { post } from './index'

export function getRecommendStyle(params) {
  return post('/liveBroadcast/adverts/getRecommendStyle', params)
}

export function getRecommendColl(params) {
  return post('/liveBroadcast/adverts/getRecommendColl', params, { tips: false })
}
