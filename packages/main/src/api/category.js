import { post } from './index'

/*
  品类配置
*/
export function getProductTypeList(params) {
  return post('/goods/productType/getProductTypeList', params)
}

export function addProductType(params) {
  return post('/goods/productType/addProductType', params)
}

export function updateProductType(params) {
  return post('/goods/productType/updateProductType', params)
}

export function getProductTypeById(params) {
  return post('/goods/productType/getProductTypeById', params)
}

export function getProductParent(params) {
  return post('/goods/productType/getProductParent', params)
}

export function deleteProductType(params) {
  return post('/goods/productType/deleteProductType', params)
}
