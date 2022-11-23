import { post } from './index'

// 查询产品属性及信息
export function getProductAttrAndInfo(params) {
  return post('/goods/product/getProductAttrAndInfo', params)
}

// 添加商品
export function addProductInfo(params) {
  return post('/goods/product/addProductInfo', params)
}

export function getProductAll(params) {
  return post('/goods/product/getProductAll', params)
}

export function getProductIndex() {
  return post('/goods/product/getProductIndex')
}

export function updateProductInfo(params) {
  return post('/goods/product/updateProductInfo', params)
}

export function updateProductState(params) {
  return post('/goods/product/updateProductState', params)
}

export function deleteProductInfo(params) {
  return post('/goods/product/deleteProductInfo', params)
}

export function getGoodsTypeConfig() {
  return post('/goods/dictitemInfo/getGoodsTypeConfig')
}
