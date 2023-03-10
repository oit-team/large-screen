<script lang="jsx">
// import bus from '../../assets/js/eventBus'
import { defineComponent } from 'vue'
import commonSearch from '../common/commonSearch'
import { delIssue } from '../../api/statistics'
import ManagementPage from './DeviceList'
import CollocationPage from './Collocation'
import { getStoreList, getUserList } from '@/api/statistics'
// import test from '../../assets/brandJs/test';

export default {
  name: 'BrandInteManage',
  components: { CommonSearch: commonSearch, ManagementPage, CollocationPage },
  filters: {
    issueFlagFormat(issueVal) {
      if (issueVal > 0) {
        return '有'
      }
      else {
        return '无'
      }
    },
  },
  data() {
    const checkphone = (rule, value, callback) => {
      const phoneReg = /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/
      if (value == '') {
        callback(new Error('请输入联系电话'))
      }
      else if (!phoneReg.test(value)) { // 引入methods中封装的检查手机格式的方法
        callback(new Error('号码格式不正确或者位数不正确!'))
      }
      else {
        callback()
      }
    }
    return {
      updateAreaLoading: false,
      updateShopLoading: false,
      administration: {
        id: '',
        isShop: '',
        // brandId: '',
      },
      serverName: '',
      operateLabel: 1, // 1 搜索  2 查看统计数据
      statisticData: null,
      orgCount: null,
      userCountNum: null,
      shopCountNum: null,
      shopCount: null,
      userCount: null,
      showPanel: false,
      activeTab: 1,
      tableEmptyText: '',
      clickNodeFlag: false, // 是否点击了节点
      isShop: '0', // 0 区域  1 店铺  2 品牌
      activeName: 'area', // area 店铺  shop 店铺
      nodePath: '',
      nodeId: null, // 左键单击时节点 ID  默认值从哪里来
      // nodeType:'0',   // 左键单击时节点type  默认给个'0'
      pageNum: 1,
      pageSize: 10,
      total: 0,
      requestUrl: '/user/getUsers',
      // requestUrl:'',
      loading: false,
      drawerLoading: false,
      tableData: [],
      editIndex: null,
      handleClickFlag: false,
      orgList: [], // 综合管理左侧树列表
      defaultOpenArr: [],
      orgListLoading: false, // 树菜单加载状态
      areaList: [], // 新增店铺时的区域列表下拉框选项
      areaManagerList: [], // 新增区域时区域负责人列表
      filterText: '',
      areaDialog: false,
      shopDialog: false,
      areaForm: {
        areaName: '',
        areaCode: '',
        dutyId: null,
      },
      areaRules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' },
          { max: 12, message: '长度在 12 个字以内', trigger: 'blur' },
        ],
      },
      integralForm: {
        integral: '',
      },
      shopForm: {
        shopName: '',
        address: '',
        telephone: '',
        integralNumber: '',
        orgStId: '',
        openDate: '',
        gradeId: '',
        shopCode: '',
        storeId: '',
      },
      shopStore: false, // 编辑店铺时是否禁用 选择商场选项
      shopRules: {
        shopName: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字以内', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入店铺地址', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字以内', trigger: 'blur' },
        ],
        telephone: [
          { required: true, validator: checkphone, trigger: 'blur' },
        ],
        openDate: [
          { required: true, message: '请选择开店日期', trigger: 'blur' },
        ],
        gradeId: [
          { required: true, message: '请选择店铺等级', trigger: 'blur' },
        ],
        shopCode: [
          { required: false, message: '请输入店铺编码', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符以内', trigger: 'blur' },
        ],
      },
      formLabelWidth: '100px',
      nodeInfo: null, // 单击节点的信息
      editFlag: false, // 是否为编辑节点
      editArea: false,
      editShop: false,
      headTitArr: [],
      dynamicParam: [], // 动态参数  需要用户自定义
      curCheckedKey: null,
      multipleSelection: [], // 多选数组
      checkedUserArr: [], // 被选中用户列表
      batchPowerFlag: false, // 批量授权标志
      rolesList: [], // 角色列表
      checkedRoleArr: [], // 被选中角色列表
      // ==========================   已发布考核列表
      brandTitArr: [],
      taskIssueFlag: false,
      taskForm: {
        taskTime: null,
        limitTimes: null,
        isAll: false,
      },
      marketList: [],
      taskFormRules: {
        taskTime: [
          { required: true, message: '请选择任务开始和结束时间', trigger: 'blur' },
        ],
        limitTimes: [
          { required: true, message: '请输入任务限制测试次数', trigger: 'blur' },
          // { min: 1, max: 2, message: '长度在 1 到 2 个字符以内', trigger: 'blur' },
          { required: true, pattern: /^[1-9][0-9]{0,1}$/, message: '请输入1-99内任意正整数', trigger: 'blur' },
        ],
        isAll: [
          { required: false, message: '请选择是否选择全部', trigger: 'blur' },
        ],
      },
      taskId: null,
      taskIdArr: [], // 批量下发任务id临时数组，传参时需要将其转换为‘,’隔开的字符串

      curOsName: '', // 当前选中的店铺或者区域名称
      taskCheckedList: [], // 被选中任务列表
      curCheckedIndex: null, // 当前被下发的单个任务的index,用于更改任务状态，批量操作的话需要遍历进行
      issueUserCount: null,

      exportFlag: null, // 导出标志  1 用户 2 区域或店铺
      exportInfoList: [], // 导出模板字段列表，由用户勾选，传参给导出接口
      exportModelFlag: false,
      tempCheckList: [], // 默认全部选中，先把选项临时存储起来，方便赋值操作
      checkList: [], // 导出字段选中项
      rowList: null, // 导出传递的参数

      importFlag: null, // 导入标志  2 用户 1 区域或店铺
      importShopFlag: false,
      fileList: [],

      importErrDataFlag: false, // 错误数据展示标志
      importErrData: null, // 导入接口返回的错误数据

      nodeParentId: null, // 为0无父节点 解决无父节点店铺导出后没有数据
      path: null,

      searchData: '', // 搜索组件传递过来的搜索参数，用于导出接口做筛选
      drawerTable: [],
      drawerForm: {
        pageSize: 20,
        pageNum: 1,
        issueNum: '1',
        issuanceType: '',
        taskId: '',
        id: '',
      },
      drawerCount: 0,
      drawerSelectList: '',
    }
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    $route(to, from) {
      // // console.log(">>>>>>>>>",to,from);
      // if(to.fullPath == '/brand/addUser'){
      //   from.meta.keepAlive = true
      // }else{
      //   from.meta.keepAlive = false
      // }
    },
    tableData(val) {
      // // console.log("this.taskCheckedList===",this.taskCheckedList)
      // // console.log("val====",val)
      if (val && this.taskCheckedList && this.activeTab == 2) {
        // // console.log("11111111111")
        this.$nextTick(() => {
          val.forEach((item) => {
            this.taskCheckedList.forEach((self) => {
              // // console.log("2222222222")
              if (item.taskId == self.taskId) {
                // // console.log("33333=====",item.taskId)
                this.$refs.taskTable.toggleRowSelection(item, true)
              }
            })
          })
        })
      }
    },
  },

  async mounted() {
    await this.$nextTick()
    this.serverName = this.GLOBAL.system_manager_server
    this.brandTitArr = sessionStorage.headTitString.split('@')
    if (sessionStorage.headTitString.includes('@')) {
      this.brandTitArr = sessionStorage.headTitString.split('@')
      sessionStorage.headTitString = this.brandTitArr[0]
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    else {
      sessionStorage.headTitString = sessionStorage.headTitString
    }
    // if (!this.headTitArr) {
    //   this.$message({
    //     message: 'this.headTitArr为空',
    //     type: 'warning',
    //   })
    // }

    this.dynamicParam = [
      { key: 'pageNum', value: this.pageNum, isTrue: true, msg: '请确认pageNum.' },
      { key: 'pageSize', value: this.pageSize, isTrue: true, msg: '请确认pageSize.' },
      // { key: 'brandId', value: sessionStorage.brandId, isTrue: true, msg: '请确认品牌Id.' },
      { key: 'orgStId', value: this.orgStId, isTrue: true, msg: '请先选择区域或者店铺.' },
      { key: 'type', value: this.isShop, isTrue: true, msg: '请先选择区域或者店铺.' },
    ]

    this.getTreeOrgList()
    const _this = this
    setTimeout(() => {
      _this.curCheckedKey = _this.orgList[0].id
      console.log(_this.curCheckedKey)
      _this.nodeId = _this.orgList[0].id
      _this.orgStId = _this.nodeId
      _this.isShop = _this.orgList[0].isShop

      _this.$refs.tree.setCurrentKey(_this.curCheckedKey)
      console.log(_this.$refs.tree)

      _this.loading = true
      _this.dynamicParam = [
        { key: 'pageNum', value: _this.pageNum, isTrue: true, msg: '请确认pageNum.' },
        { key: 'pageSize', value: _this.pageSize, isTrue: true, msg: '请确认pageSize.' },
        // { key: 'brandId', value: sessionStorage.brandId, isTrue: true, msg: '请确认品牌Id.' },
        { key: 'orgStId', value: _this.orgStId, isTrue: true, msg: '请先选择区域或者店铺.' },
        { key: 'type', value: _this.isShop, isTrue: true, msg: '请先选择区域或者店铺.' },
      ]
      _this.serverName = _this.GLOBAL.system_manager_server
      _this.requestUrl = '/user/getUsers'

      // // console.log("_this.brandTitArr==",_this.brandTitArr)
      if (_this.brandTitArr.length > 0) {
        sessionStorage.headTitString = _this.brandTitArr[0]
      }
      _this.headTitArr = JSON.parse(sessionStorage.headTitString)
      _this.$refs.child.getRequestUrl(_this.serverName, _this.requestUrl)

      // 点击左侧节点时列表页headTitArr更新了，但是搜索组件没有实时接收更改后的数据，只能通过父组件向子组件传值进行更改子组件的数据了
      _this.headTitArr.forEach((el) => {
        // el.searchValKey = '';
        _this.$set(el, 'searchValKey', '')
        if (el.fieldType == '值列') {
          if (el.fieldAttr && typeof (el.fieldAttr) == 'string') {
            el.fieldAttr = JSON.parse(el.fieldAttr)
          }
        }
      })

      _this.$refs.child.parentHeadArr(_this.headTitArr)

      _this.dynamicParam.forEach((el) => {
        if (el.key == 'orgStId') {
          el.value = _this.nodeId
        }
        if (el.key == 'type') {
          el.value = _this.isShop
        }
        if (el.key == 'pageNum') {
          el.value = 1
        }
      })
      _this.$refs.child.parentMsgs(_this.dynamicParam)
    }, 1000)

    this.getAreaListByBrandId()
    this.getAreaManager()
    // this.$root.$on('switchBrand', () => this.getTreeOrgList())

    // 同菜单和角色列表不同，初始化的时候先传递参数不要执行请求用户列表，点击查询再请求
    this.pageNum = 1
    this.dynamicParam.forEach((el) => {
      if (el.key == 'pageNum') {
        el.value = this.pageNum
      }
    })
    // // console.log("==========mounted=======",this.dynamicParam)
    this.$refs.child.parentMsg(this.dynamicParam)
    // parentMsg 只传参，不调方法;parentMsgs 传参，且调方法
  },
  activated() {
    this.getAreaManager()
    this.getStoreList()
    // console.log("==综合管理==activated====")
    // this.getTreeOrgList()
    this.clickNodeFlag = false
    // // console.log("sessionStorage.headTitString-----",sessionStorage.headTitString)
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    // // console.log("this.headTitArr========",this.headTitArr);
    // if (!this.headTitArr) {
    //   this.$message({
    //     message: 'this.headTitArr为空',
    //     type: 'warning',
    //   })
    // }

    const _this = this
    // 只要页面没有强制刷新，存在组件切换，bus.$on方法会被多次绑定，造成事件多次触发
    // 解决办法一：在每次调用方法前先解绑事件( bus.$off )，然后在重新绑定( bus.$on ) -- 本项目采用第一种方案
    // 注册的总线事件（Bus）要在组件销毁时(beforeDestroy/destroyed)卸载，否则会多次挂载，造成触发一次但多个响应的情况 -- 第二种不生效
    _this.$bus.$off('detailShow')
    _this.$bus.$on('detailShow', (data) => { // 接收
    // // console.log("----------data---------",data)
      if (!data.id) { // 是新增还是编辑
        // _this.tableData.unshift(data);
        // _this.total = _this.total+1;
        _this.$nextTick(() => {
          // 新增数据后走公共搜索组件里的清空搜索进行重新请求数据
          // // console.log("_this.$refs.child====",_this.$refs.child)
          _this.$refs.child.resetSearch(this.dynamicParam)
        })
      }
      else {
        // 编辑用户时修改了所属店铺
        if (data.changeShopFlag) {
          _this.tableData.splice(_this.editIndex, 1)
        }
        else {
          _this.$set(_this.tableData, _this.editIndex, data) // 用set方法修改数据
        }
      }
    })
  },
  methods: {
    // 获取考核任务下发人员列表   抽屉
    getUserList() {
      this.drawerLoading = true
      this.drawerForm.issuanceType = this.isShop
      this.drawerForm.id = this.nodeId
      this.drawerForm.taskId = this.taskId
      getUserList({
        ...this.drawerForm,
      }).then((res) => {
        this.drawerTable = res.body.userList
        this.drawerCount = res.body.count
        // this.drawerLoading = this.drawerTable.length === 0
        this.drawerLoading = false
      }).finally(() => {
        this.drawerLoading = false
      })
    },

    async getStoreList() {
      const res = await getStoreList()
      console.log(res)
      this.marketList = res.body.storeList
    },
    // 任务下发 获取选择下发的成员
    drawerSelect(val) {
      const list = val.map((e) => {
        const arr = []
        arr.push(e.id)
        return arr
      })
      this.drawerSelectList = list.join(',')
    },
    // 任务抽屉关闭前
    handleClose(done) {
      this.drawerTable = []
      this.drawerForm.issueNum = '2'
      this.taskForm.isAll = false
      done()
    },
    // ==============导入导出店铺开始
    // 点击导出店铺
    exportList(val) {
      // // console.log('导出列表----',val);
      // // console.log("导出店铺",this.checkList);
      this.exportFlag = val
      this.exportModelFlag = true
      this.getExportInfo(val)
    },
    // 获取导出摸板需要导出的字段列表  1 用户  2 区域或店铺
    getExportInfo(val) {
      // // console.log("导出类型",val)
      this.tempCheckList = []
      const _this = this
      const con = {
        type: sessionStorage.menuCode,
        code: val, // 发布状态 1：用户 2：店铺或区域
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/excelPublic/getExportInfo`, jsonParam).then((res) => {
        // // console.log("获取导出摸板需要导出的字段列表===",res.data.body);
        if (res.data.head.status == 0) {
          _this.exportInfoList = res.data.body.exportTitle
          for (let i = 0; i < _this.exportInfoList.length; i++) {
            _this.tempCheckList.push(_this.exportInfoList[i].columnName)
          }
          _this.checkList = _this.tempCheckList
          // // console.log("默认全选===",this.checkList)
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    // 获取选中项的值
    changeChecked(val) {
      // // console.log("复选框变化后的值===",val);
      this.checkList = val
      // // console.log("this.checkList===",this.checkList);
    },
    getSearchData(val) {
      // // console.log("33333333333",val);
      if (val) {
        this.searchData = val.slice(0, val.length - 1)
      }
      // // console.log("4444444444",this.searchData);
    },
    // 点击确认导出
    // 点击确认后，必要的变量要清空一下，否则会重复循环取值
    confirmExport() {
      this.rowList = {}
      if (this.checkList.length > 0) {
        for (let i = 0; i < this.checkList.length; i++) {
          for (let j = 0; j < this.exportInfoList.length; j++) {
            if (this.checkList[i] == this.exportInfoList[j].columnName) {
              this.rowList[this.exportInfoList[j].columnName] = this.exportInfoList[j].columnDesc
            }
          }
        }
      }
      // // console.log("this.rowList===",this.rowList);
      if (this.rowList) {
        this.exportModelFlag = false
        this.checkList = this.tempCheckList
        // 选择好相应字段后，调用导出接口
        const _this = this
        // // console.log("0000===",JSON.stringify(this.rowList))
        const rowListJson = JSON.stringify(this.rowList)
        // // // console.log("this.nodeId===",_this.nodeId,String(_this.nodeId))
        // // toString()不可以转化null和undefined
        // // String()可以转化
        if (_this.exportFlag == '1') { // 导出用户接口
          // let con = {
          //   // "rowList":rowListJson,
          //   "rowList":this.rowList,
          //   "param":{
          //     "brandId":sessionStorage.brandId,
          //     "orgStId": _this.nodeId?String(_this.nodeId):_this.nodeId ,    // 防止将null也转化为字符串'null'了
          //     "type":(_this.isShop=='1' || _this.isShop=='0')?_this.isShop:null,    // 0 区域下用户  1 店铺下用户
          //     // orgStId 有值 则type必传 否则 非必传（即传什么值都无所谓，后端不会去拿它做判断，不用考虑到isShop的初始化为0的问题了）
          //   }
          // };

          // 导出按条件搜索
          const tempCon = `{"rowList":${rowListJson},"param":{${this.searchData}}}`
          const con = JSON.parse(tempCon)

          // // console.log("导出参数con：",con)
          const jsonParam = _this.GLOBAL.g_paramJson(con)
          _this.$axios.post(`${_this.GLOBAL.system_manager_server}/excelPublic/exportUserDataExcel`, jsonParam, { responseType: 'arraybuffer' }).then((res) => {
            // // console.log("导出店铺===",res.data);
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' }) // application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
            const contentDisposition = res.headers['content-disposition'] // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
            const patt = new RegExp('Filename=([^;]+\\.[^\\.;]+);*')
            const result = patt.exec(contentDisposition)
            // // console.log(result)
            const filename = result[1]
            const downloadElement = document.createElement('a')
            const href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.style.display = 'none'
            downloadElement.href = href
            downloadElement.download = `${_this.curOsName}-用户列表-${filename}` // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
          })
        }
        if (_this.exportFlag == '2') { // 导出区域或店铺
          const con = {
            rowList: this.rowList,
            param: {
              brandId: sessionStorage.brandId,
              orgStId: _this.nodeId ? String(_this.nodeId) : _this.nodeId, // 防止将null也转化为字符串了
              // "parentId":_this.nodeParentId
              path: _this.path,
            },
          }
          // // console.log("导出参数con====",con)
          const jsonParam = _this.GLOBAL.g_paramJson(con)

          _this.$axios.post(`${_this.GLOBAL.system_manager_server}/excelPublic/exportShopDataExcel`, jsonParam, { responseType: 'arraybuffer' }).then((res) => {
            // // console.log("导出店铺===",res.data);
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' }) // application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
            const contentDisposition = res.headers['content-disposition'] // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
            const patt = new RegExp('Filename=([^;]+\\.[^\\.;]+);*')
            const result = patt.exec(contentDisposition)
            // // console.log(result)
            const filename = result[1]
            const downloadElement = document.createElement('a')
            const href = window.URL.createObjectURL(blob) // 创建下载的链接
            downloadElement.style.display = 'none'
            downloadElement.href = href
            downloadElement.download = `${_this.curOsName}-店铺列表-${filename}` // 下载后文件名
            document.body.appendChild(downloadElement)
            downloadElement.click() // 点击下载
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
          })
        }
      }
      else {
        this.$message({
          type: 'warning',
          message: '请先选择导出数据相关字段',
        })
      }
    },
    cancelExport() {
      this.exportModelFlag = false
      this.checkList = this.tempCheckList
    },
    // 导入店铺
    importList(val) {
      // // console.log("导入店铺",val);
      this.importFlag = val
      this.importShopFlag = true
    },
    cancelImport() {
      this.importShopFlag = false
      this.$refs.upload.clearFiles()
    },
    handleImportClose() {
      this.$confirm('确认关闭？').then((_) => {
        this.importShopFlag = false
        this.$refs.upload.clearFiles()
      }).catch((_) => {})
    },
    // 无意义的按钮操作
    confirmImport() {
      // // console.log("确认导入店铺");
      this.importShopFlag = false
    },
    // 监控上传文件列表
    changeFile(file, fileList) {
      const existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.fileList = fileList
      // // console.log("this.fileList===",this.fileList)
    },
    // 限制每次只能上传一个文件
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 上传文件
    uploadFile(file) {
      this.fileData.append('file', file.file)
      // // console.log("this.fileData====",this.fileData)
    },
    submitUpload() {
      // this.$refs.upload.submit();
      if (this.fileList.length === 0) {
        this.$message({
          message: '请先选择文件',
          type: 'warning',
        })
      }
      else {
        this.$message({
          type: 'warning',
          message: '正在导入中，请稍候',
        })

        const formData = new FormData() //  用FormData存放上传文件
        // // console.log("this.fileList====",this.fileList)
        formData.append('file', this.fileList[0].raw)
        formData.append('brandId', sessionStorage.brandId)
        // if(this.importFlag=='1'){}
        formData.append('code', this.importFlag) // 1 店铺  2 用户
        formData.append('userId', sessionStorage.userId)

        // // console.log("formData====",formData)
        // 向webapi发起请求，等待后台接收
        const _this = this
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/excelPublic/importDataInfo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => {
          _this.importShopFlag = false
          // // console.log("-----------------",res.data);
          _this.$refs.upload.clearFiles()
          if (res.data.head.status == 0) {
            _this.$message({
              type: 'success',
              message: '导入完成!',
            })
            _this.getTreeOrgList()
            _this.fileList = []
            _this.fileData = ''
          }
          else if (res.data.head.status == 2) {
            _this.importErrDataFlag = true
            _this.importErrData = res.data.body.msgList
            // // console.log("导入返回的错误数据",_this.importErrData)
          }
          else {
            this.$message({
              dangerouslyUseHTMLString: true,
              type: 'error',
              message: res.data.head.msg,
            })
          }
        }).catch((_) => {
          this.$message({
            type: 'error',
            message: '导入店铺失败',
          })
        })
      }
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    // 导入错误数据的关闭操作
    handleImportErrClose() {
      this.$confirm('确认关闭？').then((_) => {
        this.importErrDataFlag = false
      }).catch((_) => {})
    },
    // 错误数据取消操作
    cancelErrData() {
      this.importErrDataFlag = false
    },
    // ==============导入导出店铺结束

    formtype(row, column, cellValue) {
      // // console.log(column,cellValue,"-----------");
      if (cellValue == 0) {
        return '未下发'
      }
      else if (cellValue > 0) {
        return '已下发'
      }
    },
    taskSelection(val) {
      // // console.log("task多选===",val);
      this.taskCheckedList = val
      // let tempTaskIdList = [];
      // this.taskCheckedList.forEach(el=>{
      //   if(el.taskId&&tempTaskIdList.indexOf(el.taskId)==-1){
      //     tempTaskIdList.push(el.taskId);
      //   }
      // })
      // this.taskId = tempTaskIdList.join(',');
      // // console.log("this.taskId===",this.taskId)
    },
    selectTaskItem(selection, row) {
      // console.log("selection",selection,'row',row)
    },
    bindRowKeys(row) {
      return row.taskId
    },
    // 点击用户列表、考核列表进行判断及相关参数的修改
    async clickUserTab(val) {
      // 点击tab时有些东西要初始化一下
      this.activeTab = val
      this.pageNum = 1
      this.tableData = []
      await this.$nextTick()
      if (this.$refs.taskTable) {
        this.$refs.taskTable.clearSelection()
      }
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection()
      }
      // this.taskId = null;
      // this.checkedUserArr = null;

      if (this.activeTab == 1) {
        // 为1，请求用户列表
        this.dynamicParam = [
          { key: 'pageNum', value: this.pageNum, isTrue: true, msg: '请确认pageNum.' },
          { key: 'pageSize', value: this.pageSize, isTrue: true, msg: '请确认pageSize.' },
          // { key: 'brandId', value: sessionStorage.brandId, isTrue: true, msg: '请确认品牌Id.' },
          { key: 'orgStId', value: this.orgStId, isTrue: true, msg: '请先选择区域或者店铺.' },
          { key: 'type', value: this.isShop, isTrue: true, msg: '请先选择区域或者店铺.' },
        ]
        this.serverName = this.GLOBAL.system_manager_server
        this.requestUrl = '/user/getUsers'
        sessionStorage.headTitString = this.brandTitArr[0]
        this.headTitArr = JSON.parse(sessionStorage.headTitString)
        this.headTitArr.forEach((el) => {
          // el.searchValKey = '';
          this.$set(el, 'searchValKey', '')
          if (el.fieldType == '值列') {
            // // console.log(el.fieldAttr ,typeof(el.fieldAttr))
            if (el.fieldAttr && typeof (el.fieldAttr) == 'string') {
              el.fieldAttr = JSON.parse(el.fieldAttr)
            }
            // // console.log("================",el.fieldAttr)
          }
        })
        this.$refs.child.parentHeadArr(this.headTitArr)
        this.$refs.child.getRequestUrl(this.serverName, this.requestUrl)
        this.$refs.child.parentMsgs(this.dynamicParam)
      }
      if (this.activeTab == 2) {
        // 为2，请求已发布任务列表
        this.dynamicParam = [
          { key: 'pageNum', value: this.pageNum, isTrue: true, msg: '请确认pageNum.' },
          { key: 'pageSize', value: this.pageSize, isTrue: true, msg: '请确认pageSize.' },
          { key: 'bsCode', value: sessionStorage.bsCode, isTrue: true, msg: '请确认bsCode.' },
          { key: 'releaseStatusName', value: 2, isTrue: true, msg: '请先确认任务状态.' },
          { key: 'id', value: this.nodeId, isTrue: true, msg: '请先选择区域或店铺.' },
          { key: 'type', value: this.isShop, isTrue: true, msg: '请先选择区域或店铺.' },
        ]
        this.serverName = this.GLOBAL.task_manager_server
        this.requestUrl = '/taskManage/getTaskListForManage'
        sessionStorage.headTitString = this.brandTitArr[1]
        this.headTitArr = JSON.parse(sessionStorage.headTitString)
        this.headTitArr.forEach((el) => {
          // el.searchValKey = '';
          this.$set(el, 'searchValKey', '')
          if (el.fieldType == '值列') {
            // // console.log(el.fieldAttr ,typeof(el.fieldAttr))
            if (el.fieldAttr && typeof (el.fieldAttr) == 'string') {
              el.fieldAttr = JSON.parse(el.fieldAttr)
            }
            // // console.log("================",el.fieldAttr)
          }
        })
        this.$refs.child.parentHeadArr(this.headTitArr)
        this.$refs.child.getRequestUrl(this.serverName, this.requestUrl)
        this.$refs.child.parentMsgs(this.dynamicParam)
      }
    },
    newClickUserTab(val) {
      sessionStorage.headTitString = this.brandTitArr[2]
      this.activeTab = val
    },

    // ===========================  考核列表所涉及方法
    // 获取已发布任务列表
    getPublishedTask() {
      const _this = this
      const con = {
        bsCode: sessionStorage.bsCode,
        pageNum: _this.pageNum,
        pageSize: _this.pageSize,
        releaseStatusName: 2, // 发布状态 1：未发布 2：已发布
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      // // console.log("发布/撤回任务===jsonParam====",jsonParam)

      _this.$axios.post(`${_this.GLOBAL.task_manager_server}/taskManage/getTaskListForManage`, jsonParam).then((res) => {
        // // console.log("发布/撤回任务返回信息==========",res.data.body);
        if (res.data.head.status == 0) {
          _this.publishedTaskList = res.data.body.resultList
          _this.publishedTaskCount = res.data.body.count
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    // 下发任务到区域、店铺
    issueTask(item, index) {
      // // console.log("下发任务到区域、店铺====",item,index);
      this.curCheckedIndex = index
      // // console.log("下发时的nodeId===",this.nodeId,this.isShop);
      // 要判断是否已选中相应的区域或店铺节点
      this.taskId = null
      this.taskId = item.taskId.toString()
      if (this.nodeId) {
        this.getIssueUserCount()
      }
      else {
        this.$message({
          type: 'warning',
          message: '请先选择区域或者店铺再执行下发任务操作',
        })
      }
    },
    // 查找要下发任务对应区域或者店铺下的所有用户
    getIssueUserCount() {
      const _this = this
      const con = {
        id: _this.nodeId,
        issuanceType: _this.isShop, // 0区域 1店铺 2品牌
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      // // console.log("发布/撤回任务===jsonParam====",jsonParam)
      _this.$axios.post(`${_this.GLOBAL.task_manager_server}/taskManage/getUserCount`, jsonParam).then((res) => {
        // // console.log("查找要下发任务对应区域或者店铺下的所有用户==========",res.data.body);
        if (res.data.head.status == 0) {
          if (res.data.body.userCount > 0) {
            _this.issueUserCount = res.data.body.userCount
            this.taskIssueFlag = true
          }
          else {
            _this.$message({
              message: '当前选择的区域或店铺下可下发任务的APP用户及APP+HOME用户总数为0，暂时无法下发任务',
              type: 'warning',
            })
          }
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
      this.getUserList()
    },
    // 查看任务详情
    viewTaskDetail(item, index) {
      this.$router.push({
        path: '/task/taskDetail',
        query: {
          item,
          disabledFlag: true,
        },
      })
    },
    // 查看任务考核详情列表
    viewTaskAssessment(item, index) {
      this.$router.push({
        path: '/task/assessmentDetails',
        query: {
          item,
        },
      })
    },

    // 批量任务下发
    batchIssueTaskFun() {
      // 要判断是否已选中相应的区域或店铺节点，及要批量下发的任务id
      this.taskId = null // 点击批量下发时要先把之前的taskId初始化
      const tempTaskIdList = []
      if (this.taskCheckedList.length > 0) {
        for (let i = 0; i < this.taskCheckedList.length; i++) {
          // this.taskId.push(this.taskCheckedList[i].taskId);
          tempTaskIdList.push(this.taskCheckedList[i].taskId)
          this.taskId = tempTaskIdList.join(',')
          // // console.log("this.taskId===",this.taskId)
        }
      }

      if (this.nodeId && this.taskId) {
        this.getIssueUserCount()
      }
      else {
        this.$message({
          type: 'warning',
          message: '请先选择区域/店铺和任务再执行批量下发任务',
        })
      }
    },
    // 任务时间
    changeTaskTime(val) {
      // console.log("任务时间====",val);
      // this.taskForm.taskTime = val;
    },
    // 下发任务抽屉  取消按钮
    cancelTaskIssue(formName) {
      this.taskIssueFlag = false
      this.taskForm.taskTime = null
      this.taskForm.limitTimes = null
      this.taskForm.isAll = false
      this.$refs[formName].resetFields()
    },
    // 确认任务下发
    confirmTaskIssue(formName) {
      const _this = this
      if (this.drawerCount === 0) {
        this.$message.warning('所选列表为空')
        return false
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$confirm(`确认给${this.curOsName}下发考核任务?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            const con = {
              taskId: _this.taskId, // 任务id,可多选，以“,”隔开
              id: _this.nodeId, //  下发的区域或店铺ID
              issuanceType: _this.isShop, //  0：区域  1：店铺
              startTime: _this.taskForm.taskTime[0],
              endTime: _this.taskForm.taskTime[1],
              timesLimit: _this.taskForm.limitTimes, // 任务下发限制次数
              addTaskNum: this.taskForm.isAll ? '1' : '2',
              issueId: this.drawerSelectList,
            }
            const jsonParam = _this.GLOBAL.g_paramJson(con)
            // // console.log("下发任务===jsonParam====",jsonParam)

            _this.$axios.post(`${_this.GLOBAL.task_manager_server}/taskManage/insertTaskIssuance`, jsonParam).then((res) => {
              // // console.log("批量任务下发接口返回信息==========",res.data.body);
              if (res.data.head.status == 0) {
                _this.taskIssueFlag = false
                _this.taskForm.taskTime = null
                _this.taskForm.limitTimes = null
                this.taskForm.isAll = false
                _this.$refs[formName].resetFields()
                this.clickUserTab(this.activeTab)
                if (_this.taskId.includes(',')) {
                  // 批量下发
                  let taskIdList = []
                  taskIdList = _this.taskId.split(',')
                  // // console.log('taskIdList===',taskIdList);
                  for (let i = 0; i < taskIdList.length; i++) {
                    for (let j = 0; j < _this.tableData.length; j++) {
                      if (taskIdList[i] == _this.tableData[j].taskId) {
                        _this.tableData[j].issueFlag = _this.tableData[j].issueFlag + 1
                      }
                      continue
                    }
                  }
                }
                else {
                  // taskId只有一个值
                  for (let i = 0; i < _this.tableData.length; i++) {
                    if (_this.taskId == _this.tableData[i].taskId) {
                      _this.tableData[i].issueFlag = _this.tableData[i].issueFlag + 1
                    }
                  }
                }

                _this.$message({
                  message: '任务下发成功',
                  type: 'success',
                })
                // 下发成功后清空所选项
                if (this.$refs.taskTable) {
                  this.$refs.taskTable.clearSelection()
                }
              }
              else {
                _this.$message({
                  message: res.head.msg,
                  type: 'warning',
                })
              }
            })
          }).catch(() => {
            // 点击取消
            _this.taskIssueFlag = false
            _this.taskForm.taskTime = null
            _this.taskForm.limitTimes = null
            this.taskForm.isAll = false
            _this.$message({
              message: '取消任务下发',
              type: 'info',
            })
            // 取消后也要清空所选项
            if (this.$refs.taskTable) {
              this.$refs.taskTable.clearSelection()
            }
          })
        }
        else {
          // console.log('error submit!!');
          return false
        }
      })
    },

    // ======================用户列表所涉及方法
    // 获取统计数据
    getStatisticData() {
      const _this = this
      const con = {
        brandId: sessionStorage.brandId,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/brand/SumCount`, jsonParam).then((res) => {
        // // console.log("获取统计数据===",res.data.body);
        if (res.data.head.status == 0) {
          _this.statisticData = res.data.body.countAll
          _this.orgCount = res.data.body.countAll.orgCount
          _this.shopCountNum = res.data.body.countAll.shopCount
          _this.userCountNum = res.data.body.countAll.userCount
          _this.shopCount = res.data.body.countAll.shopNum
          _this.userCount = res.data.body.countAll.userNum
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    // 左侧树改变操作标志
    changeOperate(val) {
      // this.showPanel=!this.showPanel;
      if (val == 2) {
        this.getStatisticData()
      }
      if (this.operateLabel != val) {
        this.operateLabel = val
        this.showPanel = true
      }
      else {
        this.showPanel = !this.showPanel
      }
    },
    // 当页勾选以及取消
    changeSelectUser(selection, row) {
      // 从保存项saveCheckList里面寻找,如果找到了row则删除，如果没找到则添加
      const fitemIndex = this.checkedUserArr.findIndex((item) => {
        return item == row.id
      })
      // // console.log("this.checkedUserArr---111", this.checkedUserArr);
      // // console.log("this.fitemIndex---111", fitemIndex);
      if (fitemIndex < 0) {
        this.checkedUserArr.push(row.id)
      }
      else {
        this.checkedUserArr.splice(fitemIndex, 1)
      }
      // // console.log("this.checkedUserArr---222", this.checkedUserArr);
    },
    // 表格全选内容
    selectAllUser(val) {
      // // console.log("selectAll", val);
      // 如果为空，则为清除选项状态，此时将table中的所有内容都从saveCheckList移除
      if (val && val.length == 0) {
        this.checkedUserArr = []
      }
      else if (val && val.length != 0 && this.checkedUserArr.length != 0) {
        // 如果不为空,且this.checkedUserArr也不为空则从val里面找
        val.forEach((row) => {
          // 从保存项checkedUserArr里面寻找,如果找到了row则删除，如果没找到则添加
          const fitemIndex = this.checkedUserArr.findIndex((item) => {
            return item == row.id
          })
          if (fitemIndex < 0) {
            this.checkedUserArr.push(row.id)
          }
        })
      }
      else if (val && val.length != 0 && this.checkedUserArr.length == 0) {
        val.forEach((row) => {
          this.checkedUserArr.push(row.id)
        })
      }
      // // console.log("选择的用户id数组为----",this.checkedUserArr)
    },
    // 角色选项有变化时
    roleSelection(val) {
      // console.log("val===",val)
    },

    // 当页勾选以及取消
    changeSelectRole(selection, row) {
      // 从保存项saveCheckList里面寻找,如果找到了row则删除，如果没找到则添加
      const fitemIndex = this.checkedRoleArr.findIndex((item) => {
        return item == row.roleId
      })
      // // console.log("this.checkedRoleArr---111", this.checkedRoleArr);
      // // console.log("this.fitemIndex---111", fitemIndex);
      if (fitemIndex < 0) {
        this.checkedRoleArr.push(row.roleId)
      }
      else {
        this.checkedRoleArr.splice(fitemIndex, 1)
      }
      // console.log("this.checkedUserArr---222", this.checkedRoleArr);
    },
    // 表格全选内容
    selectAllRole(val) {
      // // console.log("selectAll", val);
      // 如果为空，则为清除选项状态，此时将table中的所有内容都从saveCheckList移除
      if (val && val.length == 0) {
        this.checkedRoleArr = []
      }
      else if (val && val.length != 0 && this.checkedRoleArr.length != 0) {
        // 如果不为空,且this.checkedRoleArr也不为空则从val里面找
        val.forEach((row) => {
          // 从保存项checkedUserArr里面寻找,如果找到了row则删除，如果没找到则添加
          const fitemIndex = this.checkedRoleArr.findIndex((item) => {
            return item == row.roleId
          })
          if (fitemIndex < 0) {
            this.checkedRoleArr.push(row.roleId)
          }
        })
      }
      else if (val && val.length != 0 && this.checkedRoleArr.length == 0) {
        val.forEach((row) => {
          this.checkedRoleArr.push(row.roleId)
        })
      }
      // // console.log("选择的角色id数组为----",this.checkedRoleArr)
    },
    // 复选框控制是否可选
    selectable(row, index) {
      // // console.log("=================",row,index)
      if (row && row.accountType != '0') {
        return true
      }
      else {
        return false
      }
    },
    // 复选框选中数组处理
    handleSelectionChange(val) {
      this.multipleSelection = val
      // // console.log("multipleSelection======",this.multipleSelection);
      this.multipleSelection.forEach((el) => {
        this.checkedUserArr.push(el.id)
      })
      // // console.log("被选中用户id数组this.checkedUserArr",this.checkedUserArr)
    },
    // 批量授权
    batchEmpower() {
      if (this.checkedUserArr && this.checkedUserArr.length > 0) {
        this.batchPowerFlag = true
        this.getRolesList()
      }
      else {
        this.$message({
          message: '请先选择要批量授权的用户',
          type: 'warning',
        })
      }
    },
    // 获取要批量授权的角色列表
    getRolesList() {
      const _this = this
      let curUserId = null
      if (this.checkedUserArr && this.checkedUserArr.length == 1) {
        curUserId = this.checkedUserArr[0]
      }
      const con = {
        pageNum: 1,
        pageSize: 20,
        id: curUserId,
        // brandId: sessionStorage.brandId,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/role/getRoleList`, jsonParam).then((res) => {
        // // console.log("获取要批量授权的角色列表===",res.data.body);
        if (res.data.head.status == 0) {
          _this.rolesList = res.data.body.resultList
          if (res.data.body.isAssociatedRole) {
            _this.checkedRoleArr = res.data.body.isAssociatedRole
            // _this.checkedRoleArr = [63,65];
            // console.log("反显角色数组===",_this.checkedRoleArr)

            const checkedArr = []
            for (let i = 0; i < _this.checkedRoleArr.length; i++) {
              for (let j = 0; j < _this.rolesList.length; j++) {
                if (_this.checkedRoleArr[i] == _this.rolesList[j].roleId) {
                  checkedArr.push(_this.rolesList[j])
                }
              }
            }
            // // console.log("checkedArr====",checkedArr)
            // _this.toggleSelection(checkedArr);   // 直接执行一直不会反显
            setTimeout(() => {
              // _this.toggleSelection([_this.rolesList[3],_this.rolesList[4]])
              _this.toggleSelection(checkedArr)
            }, 100)
          }
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.roleMultipleTable.toggleRowSelection(row)
        })
      }
      else {
        this.$refs.roleMultipleTable.clearSelection()
      }
    },

    // 取消按钮
    cancelBatch() {
      this.$refs.roleMultipleTable.clearSelection()
      this.checkedRoleArr = [] // 清空所选角色数据
      this.batchPowerFlag = false
    },
    // 确认授权
    confirmBatch() {
      // this.checkedRoleArr = this.$refs.roleTree.getCheckedKeys();     // 选中的节点所组成的数组
      // // console.log("选中的角色数组==",this.checkedRoleArr)
      if (this.checkedRoleArr && this.checkedRoleArr.length > 0) {
        // 批量给用户进行批量授权逻辑,数组转字符串传参
        // this.checkedUserArr  // 被选中用户列表
        // this.checkedRoleArr   // 被选中角色列表
        // // console.log('用户授权角色传参===',this.checkedUserArr , this.checkedRoleArr )
        const _this = this
        const con = {
          userIds: this.checkedUserArr.join(','), // 	用户ID字符串
          roleIds: this.checkedRoleArr.join(','), // 	角色ID字符串
        }
        // // console.log("con====",con)
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/addUserAndRole`, jsonParam).then((res) => {
          _this.batchPowerFlag = false
          _this.$refs.roleMultipleTable.clearSelection()
          // // console.log("批量给用户进行角色授权===",res.data.body);
          if (res.data.head.status == 0) {
            // _this.areaList = res.data.body.resultList;
            _this.$message({
              message: '用户角色授权成功',
              type: 'success',
            })
          }
          else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        })
      }
      else {
        this.$message({
          message: '请先选择授权角色',
          type: 'warning',
        })
      }
    },
    // 设置用户禁用或启用  0 有效用户--可禁用   1 无效用户--可启用
    setUserDisabled(item, index) {
      const newStatus = item.status == '0' ? '1' : '0'
      const newStatusMsg = item.statusMsg == '有效' ? '无效' : '有效'

      let desc = ''
      if (item.status == '0') {
        desc = '禁用'
      }
      else {
        desc = '启用'
      }
      // // console.log("禁用或启用用户===",index,item)
      this.$confirm(`确认${desc}该用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        // 执行禁用、启用接口逻辑
        // // console.log("点击编辑的item=====",item)
        const con = {
          id: item.id,
          userName: item.userName,
          passWord: item.passWord, // passWord逻辑待定,传空的话后台自己拿默认值，有传值的话，前段用AES加密
          status: newStatus,
          accountType: item.accountType,
          headPortrait: item.headPortrait,
          job: item.job,
          sex: item.sex,
          nickName: item.nickName,
          userId: sessionStorage.userId,
          address: item.address,
          autograph: item.autograph,
          hireDate: item.hireDate,
          birthDate: item.birthDate,
          // 修改用户所属店铺或区域
          isShop: this.isShop,
          // 0 区域 1 店铺 2 品牌  为1或2时isShop有值 为null 自己取'0'
          nodeId: this.nodeId,
        }

        const jsonParam = _this.GLOBAL.g_paramJson(con)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/updateUserById`, jsonParam).then((res) => {
          // // console.log("编辑用户接口返回信息==========",res.data.body);
          if (res.data.head.status == 0) {
            _this.tableData[index].status = newStatus
            _this.tableData[index].statusMsg = newStatusMsg
            _this.$message({
              message: '操作成功',
              type: 'success',
            })
          }
          else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消',
        })
      })
    },

    // 根据品牌id查找旗下区域列表
    getAreaListByBrandId() {
      const _this = this
      const con = {
        // brandId: sessionStorage.brandId,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/getOrgByBrandId`, jsonParam).then((res) => {
        // // console.log("根据品牌id查找旗下区域列表===",res.data.body);
        if (res.data.head.status == 0) {
          _this.areaList = res.data.body.resultList
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    // 获取区域负责人列表根据品牌id
    getAreaManager() {
      const _this = this
      const con = {
        isDuty: '0',
        // brandId: sessionStorage.brandId,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/getUsers`, jsonParam).then((res) => {
        // // console.log("根据品牌id查找区域负责人列表===",res.data.body);
        if (res.data.head.status == 0) {
          _this.areaManagerList = res.data.body.resultList
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    editUser(item, index) {
      // // console.log("------------",item);
      this.editIndex = index
      this.$router.push({
        path: '/brand/addUser',
        query: {
          item,
          nodeId: this.nodeId,
          nodeType: this.isShop,
          plan: new Date().getTime(),
        },
      })
    },
    delUser(item, index) {
      // // console.log("删除用户===",index,item)
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          userId: item.id,
        }
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/user/delUserById`, jsonParam).then((res) => {
          // // console.log("删除用户===",res.data.body);
          if (res.data.head.status == 0) {
            _this.tableData.splice(index, 1)
            if (_this.total > 0) {
              _this.total = _this.total - 1
            }
            if (_this.tableData.length == 0 && _this.total > 0) {
              _this.pageNum = _this.pageNum - 1
              _this.dynamicParam.forEach((el) => {
                if (el.key == 'pageNum') {
                  el.value = _this.pageNum
                }
              })
              _this.$refs.child.parentMsgs(_this.dynamicParam)
            }

            // _this.getTreeOrgList(); // 先注释
            _this.$message({
              message: '删除成功',
              type: 'success',
            })
          }
          else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // 点击➕号时，所有的内容都要初始化
    addAreaOrShopFun() {
      this.nodeInfo = null
      this.shopDialog = true
      this.editFlag = false
      this.activeName = 'area'
      this.shopForm.shopName = ''
      this.shopForm.address = ''
      this.shopForm.gradeId = ''
      this.shopForm.telephone = ''
      this.shopForm.orgStId = ''
      this.shopForm.openDate = ''
      this.shopForm.shopCode = ''
      this.shopForm.storeId = ''

      this.areaForm.areaName = ''
      this.areaForm.areaCode = ''
      this.areaForm.dutyId = ''
    },
    addUser() {
      // // console.log("------新增用户--------");
      // if(this.clickNodeFlag){
      if (this.isShop == 1) {
        if (!this.nodeInfo.gradeId) {
          this.$message({
            type: 'warning',
            message: '所属店铺暂无等级，请先完善店铺信息',
          })
          return
        }
      }
      if (this.curCheckedKey) {
        this.$router.push({
          name: 'addUser',
          params: {
            nodeId: this.nodeId,
            nodeType: this.isShop,
          },
        })
      }
      else {
        this.$message({
          message: '请先选择区域或者店铺再执行新增操作',
          type: 'warning',
        })
      }
    },
    showChildData(tableData, total, tableEmptyText, pageNum) {
      // // console.log("搜索组件传递过来的数据====",tableData,total,tableEmptyText,pageNum)
      if (tableData) {
        this.tableData = tableData
      }
      if (total) {
        this.total = total
      }
      if (tableEmptyText) {
        this.tableEmptyText = tableEmptyText
      }
      if (pageNum) {
        this.pageNum = pageNum
      }
      if (total === 0) {
        this.total = 0
        this.pageNum = 1
      }
    },
    changeLoad(val) {
      // console.log("----userList----val------",val);
      this.loading = val
    },
    handleSizeChange(val) {
      // // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.dynamicParam.forEach((el) => {
        if (el.key == 'pageNum') {
          el.value = 1
        }
        if (el.key == 'pageSize') {
          el.value = this.pageSize
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    handleCurrentChange(val) {
      // // console.log("this.taskCheckedList====",this.taskCheckedList)
      // if(this.$refs.taskTable){
      //   this.$refs.taskTable.clearSelection();
      // }
      // // console.log(`当前页: ${val}`);
      // // console.log("this.taskId====",this.taskId)
      this.pageNum = val
      this.dynamicParam.forEach((el) => {
        if (el.key == 'pageNum') {
          el.value = this.pageNum
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    drawerCurrentChange(val) {
      // console.log(val)
      this.drawerForm.pageNum = val
      this.getUserList()
    },
    drawerSizeChange(val) {
      this.drawerForm.pageSize = val
      this.getUserList()
      // console.log(val)
    },
    // 表格公共样式函数
    rowClass({ row, rowIndex }) {
      // // console.log(rowIndex)      //0   表头行标号为0
      return this.GLOBAL.tableHeadStyle
    },
    tableCellStyle() {
      return this.GLOBAL.tableCellStyle
    },
    // 获取树形结构数据
    getTreeOrgList() {
      const _this = this
      const con = {
        // brandId: sessionStorage.brandId,
      }

      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/getTreeOrgList`, jsonParam).then((res) => {
        // // console.log("====获取综合管理树getTreeOrgList==========",res.data.body);
        _this.orgListLoading = true
        if (res.data.head.status == 0) {
          _this.orgList = res.data.body.orgList
          // _this.orgList = [];
          _this.curOsName = _this.orgList[0].osName
          _this.defaultOpenArr = [_this.orgList[0].id]
          _this.$nextTick(() => {
            // // console.log('_this.$refs.tree===',_this.$refs.tree)
            if (_this.$refs.tree) {
              _this.$refs.tree.setCurrentKey(_this.curCheckedKey)
            }
          })
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },

    // 节点拖拽处理函数开始================================
    // 拖拽时判定目标节点能否被放置。
    // type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
    allowDrop(draggingNode, dropNode, type) {
      /// / console.log("--------拖拽时判定目标节点能否被放置。--------",draggingNode, dropNode, type)
      if (dropNode.data.isShop === '2') {
        return type !== 'before' && type !== 'after' // 不能拖到节点上下
      }
      else if (dropNode.data.isShop === '1') {
        // return;
        return type !== 'inner' // 不能拖到节点里面去
      }
      else {
        return true
      }
    },
    // 判断节点能否被拖拽，只有一个参数
    allowDrag(draggingNode) {
      // // console.log("-------判断节点能否被拖拽-------",draggingNode)
      return draggingNode.data.isShop != '2' // true 可拖拽 false 不可拖拽 可排除不可被拖拽的情况
    },
    // 节点拖拽处理函数
    handleDragStart(node, ev) {
      // // console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      //  // console.log('被拖拽节点: ',draggingNode,'被放置的节点', dropNode);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // // console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // // console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // draggingNode,dropNode  被拖拽节点
      // // console.log('tree drag end: ', dropType);
      // // console.log('tree drag end 被拖拽节点: ',draggingNode,'被放置的节点', dropNode);
      // 判断拖拽节点是否为店铺
      let isShop = null
      let orgStId = null

      if (draggingNode.data.isShop && draggingNode.data.isShop == '1') {
        // // console.log("dropNode.data===========",dropNode.data)
        isShop = '1' // 拖拽点是店铺，orgStId1不需要拼接
        if (dropType != 'none') {
          // // console.log("拖拽结束，，dropType=====",dropType)
          if (dropType == 'inner') {
            // // console.log("dropNode.data===========",dropNode.data)
            orgStId = dropNode.data.id
          }
          else if (dropType == 'before' || dropType == 'after') {
            orgStId = dropNode.data.parentId
          }
          // // console.log("orgStId=====",orgStId)
        }
      }
      else if (draggingNode.data.isShop && draggingNode.data.isShop == '0') {
        isShop = '0' // 被拖拽点不是店铺，orgStId需要拼接
        // // console.log("dropNode.data===========",dropNode.data)
        // // console.log("dropNode.data.path===========",dropNode.data.path)
        if (dropType == 'inner') {
          // // console.log("dropNode.data.path===========",dropNode.data.path)
          const lastStr = dropNode.data.path.substring(dropNode.data.path.length - 1)
          if (lastStr == ',') {
            orgStId = `${dropNode.data.path}${dropNode.data.id}`
          }
          else {
            orgStId = `${dropNode.data.path},${dropNode.data.id}`
          }
          // // console.log("this is cms orgstid",orgStId)
          // orgStId = dropNode.data.id
        }
        else if (dropType == 'before' || dropType == 'after') { // dropType == 'before' || dropType == 'after'
          // orgStId = '0'
          // // console.log("父节点",dropNode.data,dropNode.parent.data)
          if (dropNode.data.isShop && dropNode.data.isShop == '1') { // 被放置点是店铺，看父节点
            if (dropNode.parent.data.isShop == '2') { // 品牌
              orgStId = '0'
            }
            if (dropNode.parent.data.isShop == '0') { // 区域
              // orgStId = dropNode.parent.data.path
              orgStId = `${dropNode.parent.data.path},${dropNode.parent.data.id}`
            }
          }
          if (dropNode.data.isShop && dropNode.data.isShop == '0') {
            orgStId = dropNode.data.path
          }
          // orgStId = dropNode.data.path
          // // console.log("before:this is cms orgstid",orgStId)
        }
      }

      let sort = null
      if (dropNode.data.isShop && dropNode.data.isShop != '2') {
        if (dropType == 'inner') {
          sort = '1'
        }
        else if (dropType == 'before') {
          sort = dropNode.data.sort
        }
        else if (dropType == 'after') {
          sort = dropNode.data.sort
        }
      }

      if (dropType != 'none') {
        const _this = this
        const con = {
          id: draggingNode.data.id, // 区域ID或店铺ID  被拖拽节点id
          dropNodeId: dropNode.data.id, // 被放置节点id
          isShop, // 0=区域;1=店铺	query	string
          orgStId, // 直接上级ID  // 即店铺所属区域id
          beforeSort: draggingNode.data.sort, // 修改之前的排序值
          sort, // 修改之后的排序值
        }

        // // console.log("迁移节点参数：",con)
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        // _this.$set(draggingNode.data,'sort',sort)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/updateShopOrOrgById`, jsonParam).then((res) => {
          // // console.log("====确认编辑接口==========",res.data.body);   // 成功时 body为null
          if (res.data.head.status == 0) {
            if (draggingNode.data.isShop && draggingNode.data.isShop == '1') {
              // // console.log("dropNode.data===========",dropNode.data)
              // isShop = '1';  // 拖拽点是店铺，orgStId1不需要拼接
              if (dropType != 'none') {
                // // console.log("拖拽结束，，dropType=====",dropType)
                if (dropType == 'inner') {
                  _this.$set(draggingNode.data, 'parentId', String(dropNode.data.id))
                  // // console.log("改变后的draggingNode.data===========",draggingNode.data)
                }
                else if (dropType == 'before' || dropType == 'after') {
                  _this.$set(draggingNode.data, 'parentId', dropNode.data.parentId)
                  // // console.log("改变后的draggingNode.data===========",draggingNode.data)
                }
              }
            }
            else if (draggingNode.data.isShop && draggingNode.data.isShop == '0') { // 被拖拽点不是店铺，orgStId需要拼接
              // // console.log("dropNode.data===========",dropNode.data)
              if (dropType == 'inner') {
                let path = ''
                path = `${dropNode.data.path},${dropNode.data.id}`
                _this.$set(draggingNode.data, 'parentId', dropNode.data.id)
                _this.$set(draggingNode.data, 'path', path)
                // // console.log("改变后的draggingNode.data===========",draggingNode.data);
              }
              else if (dropType == 'before' || dropType == 'after') {
                let path = ''
                if (dropNode.data.isShop && dropNode.data.isShop == '1') { // 被放置点是店铺，看父节点
                  if (dropNode.parent.data.isShop == '2') { // 品牌
                    path = '0'
                  }
                  if (dropNode.parent.data.isShop == '0') { // 区域
                    // path = dropNode.parent.data.path
                    path = `${dropNode.parent.data.path},${dropNode.parent.data.id}`
                  }
                  // // console.log("path==",path)
                }
                // // console.log("path==",path)
                if (dropNode.data.isShop && dropNode.data.isShop == '0') {
                  path = dropNode.data.path
                }

                _this.$set(draggingNode.data, 'parentId', dropNode.data.parentId)
                _this.$set(draggingNode.data, 'path', path)
              }
            }
            // // console.log("之前的sort===:",dropNode.data.sort,draggingNode.data.sort)
            const dropTempSort = draggingNode.data.sort
            _this.$set(dropNode.data, 'sort', dropTempSort)
            _this.$set(draggingNode.data, 'sort', sort)
            // // console.log("之后的sort===:",dropNode.data.sort,draggingNode.data.sort)

            _this.$message({
              message: '节点迁移成功',
              type: 'success',
            })
            _this.getTreeOrgList() // 每回迁移成功之后都要重亲请求，否则连续进行节点迁移以后会不生效，因为拿到的节点数据不对，只是页面节点改变，数据未改变
          }
          else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        })
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // // console.log('tree drop: ', dropNode.label, dropType);
    },
    // 树节点数据渲染
    renderContent(h, { node, data, store }) {
      // // console.log(node,"---------------")
      if (node.data.isShop == '2') {
        // return (
        //   <span class='custom-tree-node' style='diaplay:flex;align-item:center;'>
        //     <span>{node.data.osName}</span>
        //     <span style="color:#1978FE;">({node.data.member})</span>
        //     <span style="margin-left:30px;margin-right:16px;" on-click={ () => this.getTreeOrgList() }><i style='font-size:16px;' class="el-icon-refresh"></i></span>
        //   </span>
        // )
      }
      else {
        return (
          <span class='custom-tree-node'>
            <span>{node.data.osName}</span>
            <span style="color:#1978FE;">({node.data.member})</span>
          </span>
        )
      }
    },
    // 树节点搜索过滤
    filterNode(value, data) {
      // // console.log("--------------",value,data)
      if (!value) return true
      return data.osName.includes(value)
    },
    // 节点被点击时的回调
    async handleNodeClick(MouseEvent, object, Node, VueComponent) {
      this.administration.id = object.data.id
      this.administration.isShop = object.data.isShop
      this.nodeInfo = object.data // 先将data存到变量里

      this.activeTab = 1 // 左键单击节点时让tab初始化到activeTab为1

      await this.$nextTick()
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection()
      }
      // debugger
      const curCheckedKey = this.$refs.tree.getCurrentKey()
      // // console.log('当前选中节点curCheckedKey===',curCheckedKey)
      this.curCheckedKey = curCheckedKey
      this.checkedUserArr = []

      this.clickNodeFlag = true
      // console.log("树节点左键单击-----",object.data)
      this.nodeId = object.data.id
      this.orgStId = this.nodeId
      this.curOsName = object.data.osName
      this.nodeParentId = object.data.parentId
      this.path = object.data.path
      if (object.data.isShop == '1') {
        this.isShop = '1'
      }
      if (object.data.isShop == '2') {
        this.isShop = '2'
      }
      if (object.data.isShop == '0') {
        this.isShop = '0'
      }
      // 如果初始化为用户列表，要重新请求数据
      if (this.activeTab == 1) {
        this.loading = true
        this.dynamicParam = [
          { key: 'pageNum', value: this.pageNum, isTrue: true, msg: '请确认pageNum.' },
          { key: 'pageSize', value: this.pageSize, isTrue: true, msg: '请确认pageSize.' },
          // { key: 'brandId', value: sessionStorage.brandId, isTrue: true, msg: '请确认品牌Id.' },
          { key: 'orgStId', value: this.orgStId, isTrue: true, msg: '请先选择区域或者店铺.' },
          { key: 'type', value: this.isShop, isTrue: true, msg: '请先选择区域或者店铺.' },
        ]
        this.serverName = this.GLOBAL.system_manager_server
        this.requestUrl = '/user/getUsers'
        sessionStorage.headTitString = this.brandTitArr[0]
        this.headTitArr = JSON.parse(sessionStorage.headTitString)
        this.$refs.child.getRequestUrl(this.serverName, this.requestUrl)

        // 点击左侧节点时列表页headTitArr更新了，但是搜索组件没有实时接收更改后的数据，只能通过父组件向子组件传值进行更改子组件的数据了
        this.headTitArr.forEach((el) => {
          // el.searchValKey = '';
          this.$set(el, 'searchValKey', '')
          if (el.fieldType == '值列') {
            // // console.log(el.fieldAttr ,typeof(el.fieldAttr))
            if (el.fieldAttr && typeof (el.fieldAttr) == 'string') {
              el.fieldAttr = JSON.parse(el.fieldAttr)
            }
            // // console.log("================",el.fieldAttr)
          }
        })

        this.$refs.child.parentHeadArr(this.headTitArr)
        // // console.log("------this.nodeId------",this.nodeId,this.isShop,object.data.isShop);
        this.dynamicParam.forEach((el) => {
          if (el.key == 'orgStId') {
            el.value = this.nodeId
          }
          if (el.key == 'type') {
            el.value = this.isShop
          }
          if (el.key == 'pageNum') {
            el.value = 1
          }
        })
        this.$refs.child.parentMsgs(this.dynamicParam)
      }
    },
    // 当某一节点被鼠标右键点击时会触发该事件
    nodeRightClick(MouseEvent, object, Node, VueComponent) {
      // // console.log("节点右击------",MouseEvent, object, Node, VueComponent);
      // console.log("树节点右键单击======",Node.data)   // 单击节点的信息
      if (Node.data.isShop == '1') { // 店铺
        this.isShop = '1'
      }
      if (Node.data.isShop == '2') { // 品牌节点
        this.isShop = '2'
      }
      if (Node.data.isShop == '0') {
        this.isShop = '0' // 区域
      }
      if (this.isShop == '0' || this.isShop == '1') {
        this.handleClickFlag = true
      }
      this.nodeInfo = Node.data // 先将data存到变量里
    },
    // 节点拖拽处理函数结束================================

    // 点击操作-》新增按钮
    clickAdd() {
      const _this = this
      _this.activeName = 'area'
      this.handleClickFlag = false
      this.shopDialog = true
      this.editFlag = false
      // this.areaForm = {};
      // this.shopForm = {};
      _this.shopForm.shopName = ''
      _this.shopForm.address = ''
      _this.shopForm.gradeId = ''
      _this.shopForm.telephone = ''
      _this.shopForm.openDate = ''
      _this.shopForm.shopCode = ''
      if (_this.isShop == '1') {
        _this.shopForm.orgStId = ''
      }
      else {
        _this.shopForm.orgStId = _this.nodeInfo.id
      }

      _this.areaForm.areaName = ''
      _this.areaForm.areaCode = ''
      _this.areaForm.dutyId = ''
    },
    // 点击操作-》编辑按钮
    clickEdit() {
      console.log('点击编辑时的this.nodeInfo====', this.nodeInfo)
      this.handleClickFlag = false
      this.shopDialog = true
      this.editFlag = true
      if (this.nodeInfo.isShop == '1') { // 店铺
        this.activeName = 'shop'

        this.editShop = true
        this.editArea = false

        this.shopStore = !!this.nodeInfo.storeId

        this.shopForm.shopName = this.nodeInfo.osName
        this.shopForm.address = this.nodeInfo.address
        if (this.nodeInfo.gradeId) {
          this.shopForm.gradeId = this.nodeInfo.gradeId
        }
        else {
          this.shopForm.gradeId = ''
        }
        this.shopForm.telephone = this.nodeInfo.telephone
        this.shopForm.integralNumber = this.nodeInfo.integralNumber
        this.shopForm.openDate = this.nodeInfo.openDate
        this.shopForm.shopCode = this.nodeInfo.shopCode
        this.shopForm.orgStId = Number(this.nodeInfo.parentId)
        this.shopForm.storeId = Number(this.nodeInfo.storeId)
        if (this.shopForm.orgStId == 0) {
          this.shopForm.orgStId = null
        }
        if (this.shopForm.storeId == 0) {
          this.shopForm.storeId = null
        }
      }
      else if (this.nodeInfo.isShop == '0') { // 区域
        this.activeName = 'area'

        this.editArea = true
        this.editShop = false
        this.areaForm.areaName = this.nodeInfo.osName
        this.areaForm.areaCode = this.nodeInfo.nodeCode
        if (this.nodeInfo.dutyId) {
          this.areaForm.dutyId = Number(this.nodeInfo.dutyId)
          // // console.log("区域负责人id===",this.areaForm.dutyId)
        }
        else {
          this.areaForm.dutyId = null
          // // console.log("区域负责人id===",this.areaForm.dutyId)
        }
      }
    },
    // 操作-》删除区域或店铺，有子级则不能删（后台判断）
    clickDel() {
      // // console.log("========删除=========")
      // // console.log(this.nodeInfo,"====================")
      const _this = this
      // userId	用户ID	query	integer
      let isShop = null
      if (_this.nodeInfo.isShop == '1') {
        isShop = '1' // 店铺
      }
      if (_this.nodeInfo.isShop == '0') {
        isShop = '0' // 店铺
      }
      if (_this.nodeInfo.isShop == '2') {
        isShop = '2' // 店铺
      }
      const con = {
        isShop, // 是否是店铺，0=区域;1=店铺
        orgId: _this.nodeInfo.id, // 区域或店铺ID
      }

      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/delOrgOrShopById`, jsonParam).then((res) => {
          // // console.log("====删除区域/店铺接口==========",res.data.body);   // 成功时 body为null
          _this.handleClickFlag = false
          if (res.data.head.status == 0) {
            _this.$message({
              message: res.data.head.msg,
              type: 'success',
            })
            _this.getTreeOrgList() // 先注释
            _this.getAreaListByBrandId()
          }
          else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    cancelRecharge(formName) {
      this.shopDialog = false
      this.integralForm.integral = ''
      this.$refs.integralForm.resetFields()
      this.$message({
        message: '取消充值！',
        type: 'info',
      })
    },
    async conRechargeIntegral(formName) {
      const con = {
        payNum: 1,
        returnNum: 1,
        amount: this.integralForm.integral,
        shopId: this.nodeInfo.id,
      }
      const jsonParam = this.GLOBAL.g_paramJson(con)
      this.$axios.post(`${this.GLOBAL.system_manager_server}/pay/alipay`, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          document.write(res.data.body.result)
        }
        else {
          this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'warning',
        })
      })
    },

    // 取消操作
    cancelAdd(formName) {
      this.shopDialog = false
      // this.$refs[formName].resetFields();
      // // console.log(this.$refs.shopForm,this.$refs.areaForm)
      if (this.$refs.shopForm) {
        this.$refs.shopForm.resetFields()
      }
      if (this.$refs.areaForm) {
        this.$refs.areaForm.resetFields()
      }
      const _this = this
      _this.shopForm.shopName = ''
      _this.shopForm.address = ''
      _this.shopForm.gradeId = ''
      _this.shopForm.telephone = ''
      _this.shopForm.orgStId = ''
      _this.shopForm.openDate = ''
      _this.shopForm.shopCode = ''

      _this.areaForm.areaName = ''
      _this.areaForm.areaCode = ''
      _this.areaForm.dutyId = ''
    },
    // 确认新增区域
    conAddArea(formName) {
      // // console.log("确认新增区域");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateAreaLoading = true
          // // console.log("-----333333333333--------",this.nodeInfo)
          let path = null
          if (this.nodeInfo) {
            path = `${this.nodeInfo.path},${this.nodeInfo.id}`
          }
          else {
            path = '0'
          }
          // // console.log("--------path-------",path)
          const _this = this
          const con = {
            // brandId: sessionStorage.brandId,
            deptName: _this.areaForm.areaName,
            deptCode: _this.areaForm.areaCode,
            dutyId: _this.areaForm.dutyId,
            path,
            deptImg: '../../../static/images/avater.jpg',
            userId: sessionStorage.userId,
          }

          const jsonParam = _this.GLOBAL.g_paramJson(con)
          _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/insertOrg`, jsonParam).then((res) => {
            // // console.log("====确认新增区域接口==========",res.data.body);   // 成功时 body为null
            // _this.shopDialog = false;
            // _this.areaForm.areaName = '';
            // _this.areaForm.areaCode = '';
            // _this.areaForm.dutyId = '';
            // _this.areaForm = {}
            if (res.data.head.status == 0) {
              this.updateAreaLoading = false
              _this.shopDialog = false
              _this.areaForm.areaName = ''
              _this.areaForm.areaCode = ''
              _this.areaForm.dutyId = ''

              _this.$message({
                message: '新增区域成功',
                type: 'success',
              })

              _this.getAreaListByBrandId()

              _this.getTreeOrgList() // 先注释
            }
            else {
              this.updateAreaLoading = true
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          })
        }
        else {
          // console.log('error submit!!');
          return false
        }
      })
    },
    // 确认新增店铺
    conAddShop(formName) {
      // // console.log("确认新增区域");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateShopLoading = true
          const _this = this
          // // console.log("_this.shopForm============",_this.shopForm)
          let orgStId = null
          if (_this.shopForm.orgStId) {
            orgStId = _this.shopForm.orgStId
          }
          else {
            orgStId = '0'
          }

          const con = {
            // brandId: sessionStorage.brandId,
            shopName: _this.shopForm.shopName,
            address: _this.shopForm.address,
            gradeId: _this.shopForm.gradeId,
            telephone: _this.shopForm.telephone,
            orgStId,
            storeId: _this.shopForm.storeId,
            openDate: _this.shopForm.openDate,
            shopCode: _this.shopForm.shopCode,
            userId: sessionStorage.userId,
          }

          const jsonParam = _this.GLOBAL.g_paramJson(con)
          _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/insertShop`, jsonParam).then((res) => {
            // // console.log("====确认新增区域接口==========",res.data.body);   // 成功时 body为null
            if (res.data.head.status == 0) {
              this.updateShopLoading = false
              _this.shopDialog = false
              _this.shopForm.shopName = ''
              _this.shopForm.address = ''
              _this.shopForm.gradeId = ''
              _this.shopForm.telephone = ''
              _this.shopForm.openDate = ''
              _this.shopForm.shopCode = ''
              _this.shopForm.orgStId = ''

              _this.areaForm.areaName = ''
              _this.areaForm.areaCode = ''
              _this.areaForm.dutyId = ''
              _this.$message({
                message: '新增店铺成功',
                type: 'success',
              })
              _this.getTreeOrgList() // 先注释
            }
            else {
              this.updateShopLoading = false
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          })
        }
        else {
          // console.log('error submit!!');
          return false
        }
      })
    },
    // 确认编辑区域或店铺
    conEditAreaOrShop(formName) {
      // // console.log("确认编辑区域或店铺");
      // // console.log("====================",this.nodeInfo);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          let isShop = null // 0=区域;1=店铺
          let orgStId = null
          let con = {}

          if (_this.nodeInfo.isShop == '1') {
            isShop = '1' // 店铺
            con = {
              id: _this.nodeInfo.id, // 区域ID或店铺ID
              isShop, // 0=区域;1=店铺	query	string
              orgStId: _this.shopForm.orgStId, // 直接上级ID  // 店铺所属区域
              // "orgStId":_this.nodeInfo.parentId,    // 直接上级ID  // 店铺所属区域
              shopName: _this.shopForm.shopName,
              address: _this.shopForm.address,
              gradeId: _this.shopForm.gradeId,
              telephone: _this.shopForm.telephone,
              openDate: _this.shopForm.openDate,
              shopCode: _this.shopForm.shopCode,
              storeId: _this.shopForm.storeId,
            }
          }
          else if (_this.nodeInfo.isShop == '0') {
            isShop = '0' // 区域
            orgStId = '0'

            con = {
              id: _this.nodeInfo.id, // 区域ID或店铺ID
              isShop, // 0=区域;1=店铺	query	string
              // "orgStId":orgStId,    // 直接上级ID
              orgStId: _this.nodeInfo.parentId, // 直接上级ID
              deptName: _this.areaForm.areaName,
              deptCode: _this.areaForm.areaCode,
              dutyId: _this.areaForm.dutyId,
            }
          }
          // console.log("----编辑con---",con)
          const jsonParam = _this.GLOBAL.g_paramJson(con)
          _this.$axios.post(`${_this.GLOBAL.system_manager_server}/org/updateShopOrOrgById`, jsonParam).then((res) => {
            // // console.log("====确认编辑接口==========",res.data.body);   // 成功时 body为null
            if (res.data.head.status == 0) {
              _this.shopDialog = false
              _this.shopForm.shopName = ''
              _this.shopForm.address = ''
              _this.shopForm.gradeId = ''
              _this.shopForm.telephone = ''
              _this.shopForm.orgStId = ''
              _this.shopForm.openDate = ''
              _this.shopForm.shopCode = ''

              _this.areaForm.areaName = ''
              _this.areaForm.areaCode = ''
              _this.areaForm.dutyId = ''
              _this.$message({
                message: '编辑成功',
                type: 'success',
              })
              _this.getTreeOrgList() // 先注释
            }
            else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          })
        }
        else {
          // console.log('error submit!!');
          return false
        }
      })
    },
    // 店铺所属区域变化时
    changeArea(val) {
      // // console.log("=====店铺所属区域id======",val);
      this.shopForm.orgStId = val
    },
    // 更换区域负责人
    changeAreaManger(val) {
      this.areaForm.dutyId = val
    },
  },
}
</script>

<template>
  <div id="brandInteManage" class="pageCommonStyle page-container text-sm">
    <div class="leftTreeCon">
      <div class="btnBox">
        <el-tooltip class="item" effect="dark" content="新增区域或店铺" placement="top">
          <el-button style="border-color: #FF8C7C;background: #FF8C7C;color:#fff;" class="delBtnOnly" icon="el-icon-plus" circle @click="addAreaOrShopFun" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="搜索" placement="top">
          <el-button type="primary" icon="el-icon-search" circle @click="changeOperate(1)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="数据统计" placement="top">
          <el-button class="authBtnOnly" style="border-color: #FCCB02;background: #FCCB02;color:#fff;" icon="el-icon-s-data" circle @click="changeOperate(2)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导入店铺" placement="top">
          <el-button style="border-color: #4FD5AC;background: #4FD5AC;color:#fff;" class="addBtnOnly" icon="el-icon-download" circle @click="importList(&quot;1&quot;)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="导出店铺" placement="top">
          <el-button style="border-color: #ADA3EE;background: #ADA3EE;color:#fff;" class="downLoadBtnOnly" icon="el-icon-upload2" circle @click="exportList('2')" />
        </el-tooltip>
      </div>
      <div v-if="showPanel && operateLabel == 1" class="searchIpt">
        <el-input
          v-model="filterText"
          placeholder="关键字过滤"
        />
      </div>
      <div v-if="showPanel && operateLabel == 2" class="statisticsBox">
        <div class="item">
          <div class="titleBox">
            <span class="titltTip" /><span>区域</span><span class="countNums">({{ orgCount }})</span>
            <el-tooltip class="item" effect="dark" content="区域总数" placement="top">
              <i style="font-size:14px;" class="el-icon-question" />
            </el-tooltip>
          </div>
        </div>
        <div class="item">
          <div class="titleBox">
            <span class="titltTip" /><span>店铺</span><span class="countNums">({{ shopCountNum }})</span>
            <el-tooltip class="item" effect="dark" content="SABC为店铺等级，其后数字为对应等级店铺数量" placement="top">
              <i style="font-size:14px;" class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="numMain">
            <span v-for="(item, index) in shopCount" :key="index" class="numsBox">
              <span v-if="item.gradeId" class="numItemBox">
                <span>{{ item.gradeId }}</span><div class="numBox">({{ item.shopsNum }})</div> </span>
              <span v-else class="numItemBox"><span>其它</span><div class="numBox">({{ item.shopsNum }})</div></span>
            </span>
          </div>
        </div>
        <div class="item">
          <div class="titleBox">
            <span class="titltTip" /><span>用户</span><span class="countNums">({{ userCountNum }})</span>
            <el-tooltip class="item" effect="dark" content="APP为app端用户，HOME为管家端用户，A+H为同时拥有APP和管家端权限的用户" placement="top">
              <i style="font-size:14px;" class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="numMain">
            <span v-for="(item, index) in userCount" :key="index" class="numsBox">
              <span v-if="item.accountType == 0" class="numItemBox"> <span class="userTip">APP</span> <div class="numBox">({{ item.usersNum }})</div> </span>
              <span v-if="item.accountType == 1" class="numItemBox"> <span class="userTip">HOME</span> <div class="numBox">({{ item.usersNum }})</div> </span>
              <span v-if="item.accountType == 3" class="numItemBox"> <span class="userTip">A+H</span> <div class="numBox">({{ item.usersNum }})</div> </span>
            </span>
          </div>
        </div>
      </div>
      <div ref="orgTree" class="orgTreeBox">
        <el-tree
          v-if="orgList && orgList.length > 0"
          ref="tree"
          :data="orgList"
          icon-class="el-icon-s-shop"
          highlight-current
          :props="{ children: 'childrenList', label: 'osName' }"
          node-key="id"
          :current-node-key="curCheckedKey"
          :default-expanded-keys="defaultOpenArr"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :filter-node-method="filterNode"
          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop"
          @node-click="handleNodeClick"
          @node-contextmenu="nodeRightClick"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ data.osName }}</span>
            <span>({{ data.member }})</span>
            <span v-if="data.isShop == '2'" style="margin-left:30px;" @click.stop="getTreeOrgList()"><i style="font-size:16px;" class="el-icon-refresh" /></span>
          </div>
        </el-tree>
        <div v-else>
          <div v-if="!orgListLoading" style="line-height:200px;">
            加载中...
          </div>
          <div v-if="orgListLoading" style="line-height:100px;">
            暂无数据
          </div>
        </div>
        <!-- props="{children: 'childrenList', label: 'osName'}" -->
        <!-- :render-content="renderContent" -->
      </div>
    </div>

    <div style="width:0.5px;background-color:#ddd;margin-left:6px;" />
    <div ref="brandRightCon" class="rightListCon">
      <div class="userTabBox">
        <!-- <div :class="activeTab == 1 ? 'active' : ''" class="tabItem" @click="clickUserTab(1)">
          用户列表
        </div> -->
        <!-- <div :class="activeTab == 2 ? 'active' : ''" class="tabItem" @click="clickUserTab(2)">
          考核下发
        </div>
        <div :class="activeTab == 3 ? 'active' : ''" class="tabItem" @click="newClickUserTab(3)">
          设备管理
        </div> -->
        <!-- <div :class="activeTab == 4 ? 'active' : ''" class="tabItem" @click="newClickUserTab(4)">
          终端搭配
        </div> -->
      </div>
      <!-- 组件 -->
      <common-search
        v-if="activeTab == 1 || activeTab == 2"
        ref="child"
        :head-tit-arr="headTitArr"
        :page-num="pageNum"
        :page-size="pageSize"
        :server-name="serverName"
        :request-url="requestUrl"
        :node-id="nodeId"
        @changeLoading="changeLoad"
        @sendData="showChildData"
        @sendSearchData="getSearchData"
      />
      <div v-if="activeTab == 1" class="userListBox">
        <div class="operateBtn">
          <!-- isShop  0 区域 1 店铺  2 品牌 -->
          <el-button size="small" icon="el-icon-plus" type="success" style="background-color:#4FD5AC;border-color: #4FD5AC;" class="addBtnOnly" @click="addUser">
            新增用户
          </el-button>
          <el-tooltip class="item" effect="dark" content="只有管家用户和APP及管家用户才可以授权" placement="top-start">
            <el-button size="small" icon="el-icon-user" type="warning" class="authBtnOnly" @click="batchEmpower">
              角色授权
            </el-button>
          </el-tooltip>
          <el-button size="small" icon="el-icon-download" style="background:#4FD5AC;border-color: #4FD5AC;color:#fff;" class="addBtnOnly" @click="importList(&quot;2&quot;)">
            导入用户
          </el-button>
          <el-button size="small" icon="el-icon-upload2" style="background:#ADA3EE;border-color: #ADA3EE;color:#fff;" class="downLoadBtnOnly" @click="exportList('1')">
            导出用户
          </el-button>
        </div>
        <el-divider />
        <el-table
          ref="multipleTable"
          v-loading="loading"
          element-loading-text="小易拼命加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="tableData"
          :style="GLOBAL.tableStyle"
          stripe
          border
          style="width:100%;"
          :header-cell-style="rowClass"
          :cell-style="tableCellStyle"
          :row-key="(row) => row.id"
          @select="changeSelectUser"
          @select-all="selectAllUser"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            align="center"
            :selectable="selectable"
            width="55"
          />
          <el-table-column
            v-for="(item, index) in headTitArr"
            :key="index"
            show-overflow-tooltip
            sortable
            :min-width="GLOBAL.minCellWidth"
            :prop="item.fieldKey"
            :label="item.fieldName"
          />
          <el-table-column
            fixed="right"
            label="操作"
            style="border-left:none;"
            width="140"
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑用户" placement="top">
                <el-button size="mini" type="primary" class="editBtnOnly" icon="el-icon-edit" circle @click="editUser(scope.row, scope.$index)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
                <el-button size="mini" type="danger" class="delBtnOnly" icon="el-icon-delete" circle @click="delUser(scope.row, scope.$index)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="禁用用户" placement="top">
                <el-button v-if="scope.row.status == '0'" class="addBtnOnly" size="mini" type="success" icon="el-icon-open" circle @click="setUserDisabled(scope.row, scope.$index)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用用户" placement="top">
                <el-button v-if="scope.row.status == '1'" style="background-color:#ccc;border-color: #ccc;" size="mini" type="info" icon="el-icon-turn-off" circle @click="setUserDisabled(scope.row, scope.$index)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeTab == 2" class="examListBox">
        <div class="operateBtn">
          <el-tooltip class="item" effect="dark" content="请先选择要进行任务下发的区域或者店铺哦" placement="top-start">
            <el-button size="small" icon="el-icon-user" type="warning" class="authBtnOnly" @click="batchIssueTaskFun()">
              任务下发
            </el-button>
          </el-tooltip>
        </div>
        <el-table
          ref="taskTable"
          v-loading="loading"
          element-loading-text="小易拼命加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="tableData"
          :style="GLOBAL.tableStyle"
          stripe
          border
          :header-cell-style="rowClass"
          :cell-style="tableCellStyle"
          :row-key="bindRowKeys"
          @select="selectTaskItem"
          @selection-change="taskSelection"
        >
          <template slot="empty">
            <p>{{ tableEmptyText }}</p>
          </template>
          <el-table-column
            align="center"
            type="selection"
            width="50"
            :reserve-selection="true"
          />
          <el-table-column
            v-if="isShop != &quot;2&quot;"
            prop="issueFlag"
            label="下发记录"
            show-overflow-tooltip
            sortable
            min-width="130"
          >
            <!-- :formatter="formtype" -->
            <template slot-scope="scope">
              <div v-if="scope.row.issueFlag > 0" style="color:#e60012;text-align:center;">
                {{ scope.row.issueFlag | issueFlagFormat }}
              </div>
              <div v-else style="text-align:center;">
                {{ scope.row.issueFlag | issueFlagFormat }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in headTitArr"
            :key="index"
            show-overflow-tooltip
            sortable
            :prop="item.fieldKey"
            :min-width="GLOBAL.minCellWidth"
            :label="item.fieldName"
          />

          <el-table-column
            fixed="right"
            label="操作"
            style="border-lrft:none;"
            width="180"
          >
            <!-- 任务详情：el-icon-notebook-2       考核详情：el-icon-s-data，颜色：#FCCB02 -->
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="考核详情" placement="top">
                <el-button size="mini" type="primary" icon="el-icon-s-data" circle class="editBtnOnly" @click="viewTaskAssessment(scope.row, scope.$index)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="任务详情" placement="top">
                <el-button size="mini" type="primary" icon="el-icon-notebook-2" circle class="editBtnOnly" @click="viewTaskDetail(scope.row, scope.$index)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="任务下发" placement="top">
                <el-button size="mini" icon="el-icon-bottom-right" circle class="authBtnOnly" style="border-color: #FCCB02;background: #FCCB02;color:#fff;" @click="issueTask(scope.row, scope.$index)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 第三页 -->
      <div v-if="activeTab == 3" class="examListBox">
        <management-page ref="pages" :administrations="administration" />
      </div>
      <!-- 第四页 -->
      <div v-if="activeTab == 4" class="collBox" style="height:calc(100% - 30px)">
        <collocation-page ref="pages" :node-id="nodeId" :is-shop="isShop" />
      </div>
      <!-- 分页 -->
      <el-pagination
        v-if="activeTab == 1 || activeTab == 2"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      title="操作"
      :visible.sync="handleClickFlag"
      center
      width="270px"
    >
      <el-button v-if="isShop == '0'" size="small" @click="clickAdd">
        新 增
      </el-button>
      <el-button size="small" @click="clickEdit">
        编 辑
      </el-button>
      <el-button size="small" @click="clickDel">
        删 除
      </el-button>
    </el-dialog>

    <!-- 新增、编辑店铺 -->
    <el-drawer
      :title="editFlag ? '编辑' : '新增'"
      :visible.sync="shopDialog"
      :wrapper-closable="false"
      direction="rtl"
      size="40%"
    >
      <div class="demo-drawer__content px-3 py-4">
        <el-tabs v-if="!editFlag" v-model="activeName" tab-position="top" style="height:auto;">
          <el-tab-pane :key="1" label="新增区域" name="area">
            <!-- 区域表单 -->
            <el-form ref="areaForm" :model="areaForm" :rules="areaRules">
              <el-form-item label="区域名称" :label-width="formLabelWidth" prop="areaName">
                <el-input v-model="areaForm.areaName" autocomplete="off" placeholder="请输入区域名称" />
              </el-form-item>
              <!-- <el-form-item label="区域编码" :label-width="formLabelWidth">
                <el-input v-model="areaForm.areaCode" autocomplete="off"></el-input>
              </el-form-item> -->
              <el-form-item label="区域负责人" :label-width="formLabelWidth">
                <el-select v-model="areaForm.dutyId" filterable placeholder="请选择区域负责人" @change="changeAreaManger">
                  <el-option
                    v-for="item in areaManagerList"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button size="small" @click="cancelAdd('areaForm')">
                取 消
              </el-button>
              <el-button size="small" type="primary" :loading="updateAreaLoading" @click="conAddArea('areaForm')">
                确 认
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane :key="2" label="新增店铺" name="shop">
            <!-- 店铺表单 -->
            <el-form ref="shopForm" :model="shopForm" :rules="shopRules">
              <el-form-item label="店铺名称" :label-width="formLabelWidth" prop="shopName">
                <el-input v-model="shopForm.shopName" autocomplete="off" placeholder="请输入店铺名称" />
              </el-form-item>
              <el-form-item label="店铺地址" :label-width="formLabelWidth" prop="address">
                <el-input v-model="shopForm.address" autocomplete="off" maxlength="32" placeholder="请输入店铺地址" />
              </el-form-item>
              <el-form-item label="店铺等级" :label-width="formLabelWidth" prop="gradeId">
                <el-select v-model="shopForm.gradeId" placeholder="请选择店铺等级">
                  <el-option label="S" value="S" />
                  <el-option label="A" value="A" />
                  <el-option label="B" value="B" />
                  <el-option label="C" value="C" />
                </el-select>
              </el-form-item>

              <el-form-item label="联系电话" :label-width="formLabelWidth" prop="telephone">
                <el-input v-model="shopForm.telephone" autocomplete="off" placeholder="请输入联系电话" />
              </el-form-item>

              <el-form-item label="开店日期" :label-width="formLabelWidth" prop="openDate">
                <el-date-picker
                  v-model="shopForm.openDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="店铺编码" :label-width="formLabelWidth" prop="shopCode">
                <el-input v-model="shopForm.shopCode" autocomplete="off" placeholder="请输入店铺编码" />
              </el-form-item>

              <el-form-item label="所属区域" :label-width="formLabelWidth">
                <el-select v-model="shopForm.orgStId" filterable placeholder="请选择所属区域" @change="changeArea">
                  <el-option
                    v-for="item in areaList"
                    :key="item.id"
                    :label="item.osName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属商场" :label-width="formLabelWidth">
                <el-select v-model="shopForm.storeId" filterable clearable placeholder="请选择所属商场">
                  <el-option
                    v-for="item in marketList"
                    :key="item.storeId"
                    :label="item.storeName"
                    :value="item.storeId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button size="small" @click="cancelAdd('shopForm')">
                取 消
              </el-button>
              <el-button size="small" type="primary" :loading="updateShopLoading" @click="conAddShop('shopForm')">
                确 认
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>

        <el-tabs v-else v-model="activeName" tab-position="top" style="height:auto;">
          <el-tab-pane v-if="editArea" label="编辑区域" name="area">
            <!-- 区域表单 -->
            <el-form ref="areaForm" :model="areaForm" :rules="areaRules">
              <el-form-item label="区域编码" :label-width="formLabelWidth">
                <el-input v-model="areaForm.areaCode" disabled autocomplete="off" />
              </el-form-item>
              <el-form-item label="区域名称" :label-width="formLabelWidth" prop="areaName">
                <el-input v-model="areaForm.areaName" autocomplete="off" placeholder="请输入区域名称" />
              </el-form-item>
              <el-form-item label="区域负责人" :label-width="formLabelWidth">
                <el-select v-model="areaForm.dutyId" filterable placeholder="请选择区域负责人" @change="changeAreaManger">
                  <el-option
                    v-for="item in areaManagerList"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button size="small" @click="cancelAdd('areaForm')">
                取 消
              </el-button>
              <el-button size="small" type="primary" @click="conEditAreaOrShop('areaForm')">
                确 认
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="editShop" label="编辑店铺" name="shop">
            <!-- 店铺表单 -->
            <el-form ref="shopForm" :model="shopForm" :rules="shopRules">
              <el-form-item label="店铺名称" :label-width="formLabelWidth" prop="shopName">
                <el-input v-model="shopForm.shopName" autocomplete="off" placeholder="请输入店铺名称" />
              </el-form-item>
              <el-form-item label="店铺地址" :label-width="formLabelWidth" prop="address">
                <el-input v-model="shopForm.address" autocomplete="off" maxlength="32" placeholder="请输入店铺地址" />
              </el-form-item>
              <el-form-item label="店铺等级" :label-width="formLabelWidth" prop="gradeId">
                <el-select v-model="shopForm.gradeId" placeholder="请选择店铺等级">
                  <el-option label="S" value="S" />
                  <el-option label="A" value="A" />
                  <el-option label="B" value="B" />
                  <el-option label="C" value="C" />
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话" :label-width="formLabelWidth" prop="telephone">
                <el-input v-model="shopForm.telephone" autocomplete="off" placeholder="请输入店铺联系电话" />
              </el-form-item>
              <el-form-item label="所属积分" :label-width="formLabelWidth" prop="telephone">
                <el-input v-model="shopForm.integralNumber" disabled autocomplete="off" />
              </el-form-item>

              <el-form-item label="开店日期" :label-width="formLabelWidth" prop="openDate">
                <el-date-picker
                  v-model="shopForm.openDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item label="店铺编码" :label-width="formLabelWidth" prop="shopCode">
                <el-input v-model="shopForm.shopCode" autocomplete="off" placeholder="请输入店铺编码" />
              </el-form-item>

              <el-form-item label="所属区域" :label-width="formLabelWidth">
                <el-select v-model="shopForm.orgStId" filterable placeholder="请选择所属区域" @change="changeArea">
                  <el-option
                    v-for="item in areaList"
                    :key="item.id"
                    :label="item.osName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属商场" :label-width="formLabelWidth">
                <el-select v-model="shopForm.storeId" :disabled="shopStore" clearable filterable placeholder="请选择所属商场">
                  <el-option
                    v-for="item in marketList"
                    :key="item.storeId"
                    :label="item.storeName"
                    :value="item.storeId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button size="small" @click="cancelAdd('shopForm')">
                取 消
              </el-button>
              <el-button size="small" type="primary" @click="conEditAreaOrShop('shopForm')">
                确 认
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="editShop" label="积分充值" name="integral">
            <!-- 新增积分充值 接口还未调TODO -->
            <el-form ref="integralForm" :model="integralForm">
              <el-form-item label="充值积分" :label-width="formLabelWidth">
                <el-input v-model="integralForm.integral" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" autocomplete="off" placeholder="请输入充值积分数" />
              </el-form-item>
            </el-form>
            <div class="demo-drawer__footer">
              <el-button size="small" @click="cancelRecharge('integralForm')">
                取 消
              </el-button>
              <el-button size="small" type="primary" @click="conRechargeIntegral('integralForm')">
                立即支付
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>

    <!-- 批量授权 -->
    <el-drawer
      title="角色授权"
      :visible.sync="batchPowerFlag"
      :wrapper-closable="false"
      direction="rtl"
      size="40%"
    >
      <div class="demo-drawer__content px-3 py-4">
        <el-table
          ref="roleMultipleTable"
          :data="rolesList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="roleSelection"
          @select="changeSelectRole"
          @select-all="selectAllRole"
        >
          <el-table-column
            prop="id" align="center"
            type="selection"
            width="50"
          />
          <el-table-column
            prop="roleName"
            label="角色名"
            show-overflow-tooltip
          />
          <el-table-column
            prop="roleRemark"
            label="角色描述"
            show-overflow-tooltip
          />
          <el-table-column
            prop="roleCode"
            label="角色编码"
            show-overflow-tooltip
          />
        </el-table>
        <div class="roleTips">
          <i class="el-icon-magic-stick" style="font-size:16px;margin-right:6px;" />选择单用户时，可查看该用户已授权的角色。
        </div>

        <div style="margin-top: 20px">
          <el-button size="small" @click="cancelBatch()">
            取 消
          </el-button>
          <el-button size="small" type="primary" @click="confirmBatch()">
            确 认
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 任务下发配置 -->
    <el-drawer
      title="任务下发配置"
      :visible.sync="taskIssueFlag"
      :before-close="handleClose"
      :wrapper-closable="false"
      direction="rtl"
      size="40%"
    >
      <div class="demo-drawer__content px-3 py-4">
        <el-form ref="taskForm" :model="taskForm" :rules="taskFormRules">
          <el-form-item label="任务时间" :label-width="formLabelWidth" prop="taskTime">
            <el-date-picker
              v-model="taskForm.taskTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeTaskTime"
            />
          </el-form-item>
          <el-form-item label="限制次数" :label-width="formLabelWidth" prop="limitTimes">
            <el-input v-model="taskForm.limitTimes" autocomplete="off" placeholder="请输入任务限制次数" />
          </el-form-item>
          <el-form-item label="选择全部" :label-width="formLabelWidth">
            <!--            <el-switch v-model="taskForm.isAll"></el-switch> -->
            <el-checkbox v-model="taskForm.isAll" />
            ({{ drawerCount }}人 <span style="color:#e60012;">*只下发给APP终端用户</span>)
          </el-form-item>

          <el-divider />
          <div v-if="!taskForm.isAll" class="handle-table">
            <el-empty v-if="drawerTable.length === 0" description="描述文字" />
            <el-table
              v-else
              ref="multipleTable"
              v-loading="drawerLoading"
              height="450"
              element-loading-text="小易拼命加载中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :data="drawerTable"
              tooltip-effect="dark"
              class="w-full"
              @selection-change="drawerSelect"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="userName"
                label="账号"
                width="200"
              />
              <el-table-column
                prop="nickName"
                label="真实姓名"
                width="150"
              />
              <el-table-column
                prop="telephone"
                label="手机号"
                show-overflow-tooltip
              />
            </el-table>

            <el-pagination
              v-if="drawerTable.length !== 0"
              :current-page="drawerForm.pageNum"
              :page-sizes="[20, 30, 40]"
              :page-size="drawerForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="drawerCount"
              @size-change="drawerSizeChange"
              @current-change="drawerCurrentChange"
            />
          </div>
        </el-form>

        <div style="margin-top: 20px">
          <el-button size="small" @click="cancelTaskIssue('taskForm')">
            取 消
          </el-button>
          <el-button size="small" type="primary" @click="confirmTaskIssue('taskForm')">
            确 认
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 导出模板字段列表,由用户自定义勾选 -->
    <el-drawer
      title="请选择需要导出的字段"
      :visible.sync="exportModelFlag"
      :wrapper-closable="false"
      direction="rtl"
      size="30%"
    >
      <div class="demo-drawer__content px-3 py-4">
        <el-checkbox-group v-model="checkList" @change="changeChecked">
          <div
            v-for="(item, index) in exportInfoList" :key="index"
            style="text-align:left;margin:6px 0px;"
          >
            <el-checkbox
              :label="item.columnName"
              true-label
            >
              {{ item.columnDesc }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
        <div style="margin-top: 20px">
          <el-button size="small" @click="cancelExport">
            取 消
          </el-button>
          <el-button size="small" type="primary" @click="confirmExport">
            确 认
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 导入店铺/用户 -->
    <!-- :wrapperClosable='false' 设置是否隐藏‘点击遮罩层’事件 -->
    <el-drawer
      :title="importFlag == 1 ? '导入店铺' : '导入用户'"
      :visible.sync="importShopFlag"
      direction="rtl"
      size="30%"
      :before-close="handleImportClose"
    >
      <div class="demo-drawer__content px-3 py-4">
        <el-upload
          ref="upload"
          class="upload-demo"
          style="margin:30px 0px;"
          :limit="1"
          action="#"
          accept=".xlsx,.xls"
          :on-change="changeFile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :http-request="uploadFile"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button size="small" type="primary">
              选取文件
            </el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 .xlsx/.xls 文件，且不超过 1000kb
            </div>
          </template>
        </el-upload>
        <div style="margin-top: 20px">
          <el-button size="small" type="success" @click="submitUpload">
            导入文件
          </el-button>
          <el-button size="small" @click="cancelImport">
            取消导入
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 导入excel时错误数据的展示 -->
    <el-drawer
      title="导入错误数据展示"
      :visible.sync="importErrDataFlag"
      direction="rtl"
      size="40%"
      :before-close="handleImportErrClose"
    >
      <div class="demo-drawer__content px-3 py-4">
        <ul class="errDataBox" style="text-align:left;">
          <li
            v-for="(item, index) in importErrData"
            :key="index"
            class="errDataItem"
            style="line-height:30px;"
          >
            {{ item }}
          </li>
        </ul>
        <div style="margin-top: 20px">
          <el-button size="small" @click="cancelErrData">
            取消
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="less" scoped>
@deep:~">>>";
@import '../../assets/css/brand/brandInteManage.css';
</style>
