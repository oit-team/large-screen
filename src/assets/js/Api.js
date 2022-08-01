const api = '/api'
const login = `${api}/system/user/login`
const checkCodeImg = `${api}/system/checkCode/checkCodeImg`
const getGoodsList = `${api}/goods/goods/getGoodsList`
const getGoodsCategory = `${api}/goods/goods/getGoodsCategory`
const addGoodsInfo = `${api}/goods/goods/addGoodsInfo`
const updateGoodsInfo = `${api}/goods/goods/updateGoodsInfo`
const updateGoodsStatusById = `${api}/goods/goods/updateGoodsStatusById` //商品上下架
const deleteGoodsInfo = `${api}/goods/goods/deleteGoodsInfo` //删除商品
const uploadFile = `${api}/system/file/uploadFile`
const getTreeMenuList = `${api}/system/menu/getTreeMenuList`
const getConferenceHall = `${api}/order/conferenceHall/getConferenceHall`// 查询拍卖场次信息
const addConferenceHall = `${api}/order/conferenceHall/addConferenceHall`// 新增拍卖场次信息
const updateConferenceHallById = `${api}/order/conferenceHall/updateConferenceHallById`// 编辑拍卖场次信息
const delConferenceHallById = `${api}/order/conferenceHall/delConferenceHallById`// 删除拍卖场次信息
const getRoomInfo = `${api}/order/room/getRoomList`// 查询拍卖房间信息
const addRoomInfo = `${api}/order/room/addRoomInfo`// 创建拍卖房间
const updateRoomInfo = `${api}/order/room/updateRoomInfo`// 修改房间信息
const delRoomInfo = `${api}/order/room/delRoomInfo`// 删除场次房间信息
const updateConferenceHallState = `${api}/order/conferenceHall/updateConferenceHallState`// 修改拍卖场次状态
const updateRoomState = `${api}/order/room/updateRoomState`// 修改场次房间状态
const getCalculatePrice = `${api}/order/auction/getCalculatePrice`// 价格计算接口
const addGoodsAndPriceDetailed = `${api}/order/auction/addGoodsAndPriceDetailed`// 添加竞拍商品和价格明细
const getAuctionRoomInfo = `${api}/order/room/getAuctionRoomInfo`// 区域信息查询
const addDataToRedis = `${api}/order/auction/addDataToRedis`// 价格入池
const addOrUpdateAuctionRelation = `${api}/order/auction/addOrUpdateAuctionRelation`// 编辑竞拍区水滴能量值限制
const getAuthorInfoList = `${api}/system/author/getAuthorInfoList`// 作者列表查询
const insertAuthorInfo = `${api}/system/author/insertAuthorInfo`// 新增作者
const updateAuthorById = `${api}/system/author/updateAuthorById`// 编辑作者信息
const deleteAuthorById = `${api}/system/author/deleteAuthorById`// 删除作者
const getAuthorInfoById = `${api}/system/author/getAuthorInfoById`// 查询作者详情
const addConferenceRelation = `${api}/order/room/addConferenceRelation`// 专场绑定竞拍区关系
const delConferenceRelation = `${api}/order/room/delConferenceRelation`// 专场解除绑定竞拍区关系
const delAuctionGoodsInfo = `${api}/order/auction/delAuctionGoodsInfo`//
const addAuctionHistory = `${api}/order/conferenceHall/addAuctionHistory`// 复制场次信息
const getAuctionHistoryTime = `${api}/order/conferenceHall/getAuctionHistoryTime`// 获取最近五天时间

const getUsers = `${api}/system/user/getUsers`// 获取用户列表
const updateStatus = `${api}/system/user/updateStatus`// 修改用户状态
const updateUserById = `${api}/system/user/updateUserById`// 修改用户信息
const getUserById = `${api}/system/user/getUserById`// 修改用户信息

const getRoleList =  `${api}/system/role/getRoleList`// 获取角色列表
const deleteCharacters =  `${api}/system/role/delRoleById`// 删除角色
const getCharacterTree =  `${api}/system/menu/getTreeMenuList`// 获取菜单树列表
const addCharacter =  `${api}/system/role/insertRole`// 获取菜单树列表
const updateCharacter =  `${api}/system/role/updateRoleById`// 获取菜单树列表
const getRoleUserList =  `${api}/system/role/getRoleUserList`// 获取角色绑定用户
const addUserAndRole =  `${api}/system/user/addUserAndRole`// 用户角色绑定

const getExportShoppingOrder =  `${api}/order/order/getExportShoppingOrder`// 导出购物订单
const getExportUser =  `${api}/system/user/getExportUser`// 导出用户列表
const getExportWithdrawRecord =  `${api}/order/withdraw/getExportWithdrawRecord`// 导出提现列表
const getAllShoppingOrder = `${api}/order/order/getAllShoppingOrder`// 查/order/order/getExportWithdrawRecord询订单列表
const getAllShoppingOrderDetailed = `${api}/order/order/getAllShoppingOrderDetailed`// 查询订单详情
const getAllAuction = `${api}/order/auctionOrder/getAllAuction`// 查询竞拍订单列表
const getAllAuctionDetailed = `${api}/order/auctionOrder/getAllAuctionDetailed`// 查询订单详情
const getWithdrawUserInfo = `${api}/order/withdraw/getUserInfoAndStateCount`
const getWithdrawApplyList = `${api}/order/withdraw/getWithdrawApplyList`
const updateWithdrawDeposit = `${api}/order/withdraw/updateWithdrawDeposit`
const getCountAndAllMoney = `${api}/order/withdraw/getCountAndAllMoney`
const getTicketUser = `${api}/order/auction/getTicketUser`
const getTicketUsedRecord = `${api}/order/auction/getTicketUsedRecord`
const getAuctionTicketConfig = `${api}/order/auction/getAuctionTicketConfig`
const setAuctionTicketConfig = `${api}/order/auction/setAuctionTicketConfig`
const getExportAuctionOrder = `${api}/order/auctionOrder/getExportAuctionOrder`
const getBillingList = `${api}/order/appointed/getBillingList`
export default {
  login,
  checkCodeImg,
  getGoodsList,
  getGoodsCategory,
  addGoodsInfo,
  updateGoodsInfo,
  updateGoodsStatusById,
  deleteGoodsInfo,
  uploadFile,
  getTreeMenuList,
  getConferenceHall,
  addConferenceHall,
  updateConferenceHallById,
  delConferenceHallById,
  getRoomInfo,
  addRoomInfo,
  updateRoomInfo,
  delRoomInfo,
  updateConferenceHallState,
  updateRoomState,
  getCalculatePrice,
  addGoodsAndPriceDetailed,
  getAuctionRoomInfo,
  addDataToRedis,
  addOrUpdateAuctionRelation,
  getAuthorInfoList,
  insertAuthorInfo,
  updateAuthorById,
  deleteAuthorById,
  getAuthorInfoById,
  addConferenceRelation,
  delConferenceRelation,
  delAuctionGoodsInfo,
  addAuctionHistory,
  getAuctionHistoryTime,
  getUsers,
  updateStatus,
  updateUserById,
  getUserById,
  getRoleList,
  addUserAndRole,
  deleteCharacters,
  getCharacterTree,
  addCharacter,
  updateCharacter,
  getRoleUserList,
  getExportUser,
  getExportShoppingOrder,
  getExportWithdrawRecord,
  getAllShoppingOrder,
  getAllShoppingOrderDetailed,
  getAllAuction,
  getAllAuctionDetailed,
  getWithdrawUserInfo,
  getWithdrawApplyList,
  updateWithdrawDeposit,
  getCountAndAllMoney,
  getTicketUser,
  getTicketUsedRecord,
  getAuctionTicketConfig,
  setAuctionTicketConfig,
  getExportAuctionOrder,
  getBillingList,
}
