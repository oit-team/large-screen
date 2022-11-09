import API_SERVICE from './API_SERVICE'
import { post } from './index'

/**
 * 查询直播间
 * @param {object} params
 */
export function getLiveBroadcastRoom(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/room/getLiveBroadcastRoom`, params)
}

/**
 * 删除直播间
 * @param {number} roomId 房间id
 */
export function delLiveBroadcastRoom(roomId) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/room/delLiveBroadcastRoom`, { roomId })
}

/**
 * 新增或编辑直播间
 * @param {{speaker: [], liveBroadcastType: *, resources: [], time: null, roomName: *, participants: []}} params
 * @param {string} params.roomName 房间名
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @param {string} params.speaker 主讲店铺/部门ID
 * @param {string} params.speakerType 主讲类型
 * @param {string} params.liveBroadcastType 直播方式(大屏到大屏、手机到大屏)
 * @param {object[]} params.participants 参与者
 * @param {string} params.participants[].participantId 参与者ID
 * @param {string} params.participants[].participantType 参与者类型
 * @param {object[]} params.resources 附件资源
 * @param {string} params.resources[].fileName 文件名
 * @param {string} params.resources[].url 地址
 * @param {string} params.roomId 房间ID，修改直播间时传
 */
export function addOrUpLiveBroadcastRoom(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/room/addOrUpLiveBroadcastRoom`, params)
}

/**
 * 获取直播方式信息
 */
export function getLiveBroadcastType() {
  return post(`${API_SERVICE.LIVE_BROADCAST}/room/getLiveBroadcastType`)
}

/**
 * 查询设备
 * @param {object} params
 * @param {string} params.devCode 设备编号
 * @param {string} params.belongingId 所属ID
 * @param {string} params.belongingType 所属类型
 * @param {string} params.brandId 品牌ID
 * @param {string} params.devState 设备状态
 */
export function getDeviceInfoList(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/device/getDeviceInfoList`, params)
}

/**
 * 综合管理的查询设备
 * @param {object} params
 * @param {string} params.devCode 设备编号
 * @param {string} params.belongingId 所属ID
 * @param {string} params.belongingType 所属类型
 * @param {string} params.brandId 品牌ID
 * @param {string} params.devState 设备状态
 */
export function getShopDevInfo(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/device/getShopDevInfo`, params)
}

/**
 * 删除设备
 * @param {string} devId 设备id
 */
export function delDeviceInfo(devId) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/device/delDeviceInfo`, { devId })
}

/**
 * 设备修改
 * @param {object} params
 * @param {string} params.decId 设备ID
 * @param {string} params.brandId 品牌ID
 * @param {string} params.belongingId 所属ID
 * @param {string} params.belongingType 所属类型
 * @param {string} params.devState 设备状态
 */
export function updateDeviceInfo(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/device/updateDeviceInfo`, params)
}

/**
 * 查询品牌设备统计信息
 */
export function getBrandIdDevCount() {
  return post(`${API_SERVICE.LIVE_BROADCAST}/device/getBrandIdDevCount`)
}

/**
 * 发布直播间
 * @param {object} params
 * @param {number} params.roomId 房间ID
 * @param {string} params.roomName 房间名称
 * @param {string} params.speakerName 主讲人名称
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @param {string} params.roomCode 房间编号
 * @param {string} params.state 房间状态（0：未发布，1：已发布）
 */
export function publishOrWithdrawRoom(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/room/publishOrWithdrawRoom`, params)
}

/**
 * 根据直播方式查询组织数据
 * @param {string} devTypeCode 直播方式
 */
export function getBrandAreaShopTree(devTypeCode) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/room/getBrandAreaShopTree`, { devTypeCode })
}

/**
 * 查询设备供应商和设备型号信息
 */
export function getDevTypeInfo() {
  return post(`${API_SERVICE.LIVE_BROADCAST}/device/getDevTypeInfo`)
}

/**
 * PPT转图片
 * @param {object} params
 * @param {string} params.userId 用户ID
 * @param {string} params.orgId 品牌ID
 * @param {string} params.pptFilePath 资源地址
 * @param {string} [params.roomId = 0] 房间ID
 * @param {string} [params.resId = 0] 资源ID
 */
export function pptToPicture(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/room/pptToPicture`, {
    roomId: 0,
    resId: 0,
    ...params,
  })
}

/**
 * 查询广告资源
 * @param {object} params
 * @param {string} params.createTime 创建时间
 * @param {string} params.endTime 结束时间
 * @param {number} params.resType 资源类型
 */
export function getAdvertsRes(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/getAdvertsRes`, params)
}

/**
 * 查询轮播广告列表
 * @param params
 */
export function getAdvertsList(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/getAdvertsList`, params)
}

/**
 * 查询选择商品列表
 * @param params
 * @param params.advertsId 广告ID
 * @param params.uuid 品牌ID
 * @param params.state 状态
 * @param params.createId 创建人ID
 * @param params.startTime 创建开始时间
 * @param params.endTime 创建结束时间
 */
export function getStyleList(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/getStyleList`, params)
}

/**
 * 新增广告
 * @param params
 * @param params.rotationRules 轮播规则
 * @param params.describe 描述
 * @param params.state 状态
 * @param params.advertsType 广告类型
 * @param params.resId 资源ID
 */
export function addAdverts(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/addAdverts`, params)
}

/**
 * 添加广告资源
 * @param params
 * @param params.resList
 * @param params.resList.resUrl 资源地址
 * @param params.resList.resType 资源类型，0=图片，1=视频
 */
export function addAdvertsRes(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/addAdvertsRes`, params)
}

/**
 * 添加广告资源
 * @param params
 * @param params.advId 广告ID
 * @param params.rotationRules 轮播规则
 * @param params.describe 描述
 * @param params.advertsType 广告类型
 * @param params.resId 资源ID
 */
export function updateAdverts(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/updateAdverts`, params)
}

/**
 * 修改广告资源状态
 * @param params
 * @param params.advId 广告ID
 * @param params.state 状态值，0=未发布，1=已发布
 */
export function updateAdvertsState(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/updateAdvertsState`, params)
}

/**
 * 删除广告
 * @param advId 广告ID
 */
export function deleteAdverts(advId) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/deleteAdverts`, { advId })
}

/**
 * 下发广告
 * @param params
 * @param params.advertsId 广告ID
 * @param {number[]} params.devIds 设备ID
 */
export function upDevAdverts(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/upDevAdverts`, params)
}

/**
 * 查询搭配资源信息
 * @param params
 */
export function getCollocationList(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/getCollocationList`, params)
}

/**
 * 查询选择关联商品详情
 * @param params
 */
export function getAdvertsById(params) {
  return post(`${API_SERVICE.LIVE_BROADCAST}/adverts/getAdvertsById`, params)
}
