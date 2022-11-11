import API_SERVICE from './API_SERVICE'
import { post } from './index'

export default function getIndustryAll(params) {
  return post(`${API_SERVICE.SYSTEM}/brand/getIndustryAll`, params)
}
