function paramJson(con = {}, cmd) {
  const Json = {
    head: {
      "aid": sessionStorage.userId,
      "ver": "1.0",
      "ln": "cn",
      "mod": "home",
      "de": "2019-10-16",
      "sync": 1,
      "cmd": cmd || 10008,
      "chcode": "ef19843298ae8f2134f"
    },
    con,
  }
  return Json
}
const minCellWidth = '140'
const btnRole = {
  SearchBtn:'查询',
  AddBtn:'新增',
  EditBtn:'修改',
  DelBtn:'删除',
  AuthBtn:'授权',
  PubBtn:'发布',
  OffBtn:'下线'
}
export default {
  paramJson,
  minCellWidth,
  btnRole,
}
