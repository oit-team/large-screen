<script>
import commonSearch from '../common/commonSearch'
export default {
  name: 'GoodsList',
  components: { CommonSearch: commonSearch },
  filters: {
    formatStatus(val) {
      return val == 'GROUNDING' ? '已上架' : '未上架'
    },
    formatPoint(val) {
      return val == '0' ? '否' : '是'
    },
  },
  data() {
    return {
      tableEmptyText: '',
      loading: false,

      total: 0,
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      requestUrl: '/style/styleAllMethod',
      headTitArr: null,
      dynamicParam: [], // 动态参数  需要用户自定义

      editIndex: null,
      customSearchData: [], // 自定义搜索条件

      exportModelFlag: false,
      checkList: [],
      exportInfoList: [],
      tempCheckList: [], // 默认全部选中，先把选项临时存储起来，方便赋值操作
      rowList: null,

      importType: 1, // 导入类型  1 商品  2 商品库存
      importFlag: false,
      fileList: [],

      importErrDataFlag: false,
      addCount: null,
      upDateCount: null,
      failureCount: null,
      importErrData: null,

      searchData: '',
    }
  },
  created() {
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    if (!this.headTitArr) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
      return
    }

    this.dynamicParam = [
      { key: 'pageNum', value: this.pageNum, isTrue: true, msg: '请确认pageNum.' },
      { key: 'pageSize', value: this.pageSize, isTrue: true, msg: '请确认pageSize.' },
      { key: 'brandId', value: sessionStorage.brandId, isTrue: true, msg: '请确认brandId.' },
    ]
  },
  mounted() {
    this.getBandAndSeries() // 获取波段和系列--给搜索组件传过去

    this.pageNum = 1
    this.dynamicParam.forEach((el) => {
      if (el.key == 'pageNum') {
        el.value = this.pageNum
      }
    })
    this.$refs.child.parentMsgs(this.dynamicParam)
  },
  activated() {
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    // console.log("this.headTitArr========",this.headTitArr);
    if (!this.headTitArr) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    const _this = this
    _this.$bus.$off('goodsDetail')
    _this.$bus.$on('goodsDetail', (data) => { // 接收
      // console.log("----------data---------",data)
      if (data == 'add') { // 是新增
        _this.$nextTick(() => {
          _this.$refs.child.resetSearch(this.dynamicParam, 40001)
        })
      }
      else { // 编辑
        _this.$set(_this.tableData, _this.editIndex, data) // 用set方法修改数据
      }
    })
  },
  methods: {
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
    // 获取品牌相应的波段和系列
    getBandAndSeries() {
      const _this = this
      const con = {
        brandId: sessionStorage.brandId,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con, 40007)
      _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/style/styleAllMethod`, jsonParam).then((res) => {
        // console.log("获取品牌波段和系列：",res.data.body);
        if (res.data.head.status == 0) {
          if (res.data.body) {
            _this.bandOptions = res.data.body.BandAndSeries

            const obj = {}
            obj.dbField = '' // 后台逻辑并没有用到这个字段
            obj.fieldKey = ''
            obj.fieldName = '波段/系列'
            obj.fieldType = '级联'
            obj.searchValKey = 'idList'
            obj.searchValKey = ''
            obj.cascOptions = _this.bandOptions
            _this.customSearchData.push(obj)
            // console.log("-------------",_this.customSearchData);
            _this.$refs.child.sendOptions(_this.customSearchData)
          }
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 修改加载状态
    changeLoad(val) {
      // console.log("--------val------",val);
      this.loading = val
    },
    // 从搜索组件拿到的数据
    showChildData(tableData, total, tableEmptyText, pageNum) {
      // console.log("搜索组件传递过来的数据===1111111111=",tableData,total,tableEmptyText,pageNum)
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
    },

    // 表格样式
    rowClass({ row, rowIndex }) {
      // console.log(rowIndex)      //0   表头行标号为0
      return this.GLOBAL.tableHeadStyle
    },
    tableCellStyle() {
      return this.GLOBAL.tableCellStyle
    },
    // 点击导入商品按钮
    clickImportGoods() {
      this.importType = 1
      this.importFlag = true
    },
    // 点击导入库存按钮
    clickImportStock() {
      this.importType = 2
      this.importFlag = true
    },
    handleImportClose() {
      this.$confirm('确认关闭？').then((_) => {
        this.importFlag = false
        this.$refs.upload.clearFiles()
      }).catch((_) => {})
    },
    // 监控上传文件列表
    changeFile(file, fileList) {
      const existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
      if (existFile) {
        this.$message.error('当前文件已经存在!')
        fileList.pop()
      }
      this.fileList = fileList
      // console.log("this.fileList===",this.fileList)
    },
    // 限制每次只能上传一个文件
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // // 上传文件
    uploadFile(file) {
      this.fileData.append('file', file.file)
      // console.log("this.fileData====",this.fileData)
    },
    // 确认导入商品
    confirmImportGoods() {
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
          duration: '1000',
        })

        const formData = new FormData() //  用FormData存放上传文件
        // console.log("this.fileList====",this.fileList)
        formData.append('file', this.fileList[0].raw)
        formData.append('brandId', sessionStorage.brandId)

        // console.log("formData====",formData)
        // 向webapi发起请求，等待后台接收
        const _this = this
        _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/style/addimporStyleInfo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => {
          _this.importFlag = false
          // console.log("-----------------",res.data);
          _this.$refs.upload.clearFiles()
          if (res.data.head.status == 0) {
            _this.importResult = res.data.body

            _this.addCount = res.data.body.addCount
            _this.upDateCount = res.data.body.upDateCount
            _this.failureCount = res.data.body.failureCount

            _this.fileList = []
            _this.fileData = ''
            if (res.data.body.errorStr && res.data.body.errorStr.length > 0) {
              _this.importErrDataFlag = true
              _this.importErrData = res.data.body.errorStr
            }
            else {
              this.$alert(`导入完成,${res.data.body.addCount},${res.data.body.upDateCount},${res.data.body.failureCount}`, '提示', {
                confirmButtonText: '确定',
                callback: (action) => {

                },
              })
            }
          }
          else {
            this.$message({
              type: 'error',
              message: res.data.head.msg,
            })
          }
        }).catch((_) => {
          this.$message({
            type: 'warning',
            message: '导入商品失败',
          })
        })
      }
    },
    // 确认导入库存
    confirmImportStock() {
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
        // console.log("this.fileList====",this.fileList)
        formData.append('file', this.fileList[0].raw)
        formData.append('brandId', sessionStorage.brandId)

        // console.log("formData====",formData)
        // 向webapi发起请求，等待后台接收
        const _this = this

        _this.$axios.post(`${_this.GLOBAL.data_manager_server}/dataStockInfo/importStockInfo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => {
          _this.importFlag = false
          // console.log("-----------------",res.data);
          _this.$refs.upload.clearFiles()
          if (res.data.head.status == 0) {
            // console.log("导入库存成功",res.data.body)
            _this.importResult = res.data.body
            _this.addCount = res.data.body.addCount
            _this.upDateCount = res.data.body.upDateCount
            _this.failureCount = res.data.body.failureCount

            _this.fileList = []
            _this.fileData = ''

            if (res.data.body.errorStr && res.data.body.errorStr.length > 0) {
              _this.importErrDataFlag = true
              _this.importErrData = res.data.body.errorStr
            }
            else {
              this.$alert(`导入完成,${res.data.body.addCount},${res.data.body.upDateCount},${res.data.body.failureCount}`, '提示', {
                confirmButtonText: '确定',
                callback: (action) => {},
              })
            }
          }
          else {
            this.$message({
              type: 'error',
              message: res.data.head.msg,
            })
          }
        }).catch((_) => {
          this.$message({
            type: 'warning',
            message: '导入商品失败',
          })
        })
      }
    },
    cancelImport() {
      this.importFlag = false
      this.$refs.upload.clearFiles()
    },

    // 点击导出商品按钮
    clickExportGoods() {
      this.exportModelFlag = true
      this.getExportInfo()
    },
    // 查询导出商品字段
    getExportInfo() {
      this.tempCheckList = []
      const _this = this
      const con = {
        type: sessionStorage.menuCode,
        code: 'goods',
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.system_manager_server}/excelPublic/getExportInfo`, jsonParam).then((res) => {
        // console.log("获取导出摸板需要导出的字段列表===",res.data.body);
        if (res.data.head.status == 0) {
          _this.exportInfoList = res.data.body.exportTitle
          for (let i = 0; i < _this.exportInfoList.length; i++) {
            _this.tempCheckList.push(_this.exportInfoList[i].columnName)
          }
          _this.checkList = _this.tempCheckList
          // console.log("默认全选===",this.checkList)
        }
        else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取选中项的值
    changeChecked(val) {
      // console.log("复选框变化后的值===",val);
      this.checkList = val
      // console.log("this.checkList===",this.checkList);
    },
    getSearchData(val) {
      if (val) {
        this.searchData = val.slice(0, val.length - 1)
      }
    },
    // 确认导出商品
    confirmExportGoods() {
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
      // console.log("this.rowList===",this.rowList);
      if (this.rowList) {
        this.exportModelFlag = false
        this.checkList = this.tempCheckList
        // 选择好相应字段后，调用导出接口
        const _this = this
        // 导出按条件搜索
        const conStr = `{"rowList":${JSON.stringify(this.rowList)},${this.searchData}}`
        // console.log(conStr);
        // console.log(JSON.parse(conStr))
        const con = JSON.parse(conStr)
        // console.log("导出参数con：",con)
        const jsonParam = _this.GLOBAL.g_paramJson(con)
        _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/style/getExportStyleInfo`, jsonParam, { responseType: 'arraybuffer' }).then((res) => {
          // console.log("导出店铺===",res.data);
          const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8' }) // application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
          const contentDisposition = res.headers['content-disposition'] // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
          const patt = new RegExp('Filename=([^;]+\\.[^\\.;]+);*')
          const result = patt.exec(contentDisposition)
          // console.log("result",result)
          const filename = result[1]
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.style.display = 'none'
          downloadElement.href = href
          downloadElement.download = `商品列表-${filename}` // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }).catch((err) => {
          console.log(err)
        })
      }
      else {
        this.$message({
          type: 'warning',
          message: '请先选择导出数据相关字段',
        })
      }
    },
    // 取消导入
    cancelExportGoods() {
      this.exportModelFlag = false
    },

    // 新增
    addGoods() {
      this.$router.push({
        path: '/brand/addGoods',
        query: {
          operateFlag: 'add',
        },
      })
    },
    // 查看商品信息
    viewGoodsItem(row, index) {
      this.$router.push({
        path: '/brand/addGoods',
        query: {
          item: row,
          operateFlag: 'view',
        },
      })
    },
    // 未上架商品可进行编辑
    editGoodsItem(row, index) {
      // console.log("编辑商品：",row);
      this.editIndex = index
      this.$router.push({
        path: '/brand/addGoods',
        query: {
          item: row,
          operateFlag: 'edit',
        },
      })
    },
    // 未上架商品可删除
    delGoodsItem(row, index) {
      // console.log("删除商品：",row);
      this.$confirm('确认删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          styleId: row.styleId,
        }
        const jsonParam = _this.GLOBAL.g_paramJson(con, 40004)
        _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/style/styleAllMethod`, jsonParam).then((res) => {
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
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // 已上架商品禁止删除
    noDelGoodsItem() {
      this.$message({
        message: '已上架商品不可删除',
        type: 'warning',
      })
    },
    // 上架
    putOnGoodsItem(row, index) {
      // console.log("商品上架：",row);
      this.$confirm('确上架该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          sId: row.styleId,
          status: 'GROUNDING', // 同一个cmd,以status来判断是否为上下架
        }
        const jsonParam = _this.GLOBAL.g_paramJson(con, 40006)
        _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/style/styleAllMethod`, jsonParam).then((res) => {
          // console.log("商品上架-----",res.data.body);
          if (res.data.head.status == 0) {
            _this.tableData[index].status = 'GROUNDING'
          }
          else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // 下架
    offGoodsItem(row, index) {
      // console.log("商品下架：",row);
      this.$confirm('确认下架该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          sId: row.styleId,
          status: 'NOTGROUNDING',
        }
        const jsonParam = _this.GLOBAL.g_paramJson(con, 40006)
        _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/style/styleAllMethod`, jsonParam).then((res) => {
          // console.log("商品下架-----",res.data.body);
          if (res.data.head.status == 0) {
            _this.tableData[index].status = 'NOTGROUNDING'
          }
          else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
    },
    // 查看商品库存
    viewGoodStock(row, index) {
      // console.log("查看商品库存",row,index);
      this.$router.push({
        path: '/brand/goodStock',
        query: {
          item: row,
        },
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.dynamicParam.forEach((el) => {
        if (el.key == 'pageSize') {
          el.value = this.pageSize
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNum = val
      this.dynamicParam.forEach((el) => {
        if (el.key == 'pageNum') {
          el.value = this.pageNum
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
  },
}
</script>

<template>
  <div id="goodsList" class="pageCommonStyle">
    <CommonSearch
      ref="child"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :server-name="GLOBAL.goods_manager_server"
      :request-url="requestUrl"
      :cmd-val="40001"
      @changeLoading="changeLoad"
      @sendData="showChildData"
      @sendSearchData="getSearchData"
    />

    <div class="operateBtn">
      <ElButton size="small" icon="el-icon-plus" class="addBtnOnly" type="success" @click="addGoods">
        新增商品
      </ElButton>
      <ElButton size="small" icon="el-icon-download" style="background:#4FD5AC;border-color: #4FD5AC;color:#fff;" class="addBtnOnly" @click="clickImportGoods">
        导入商品
      </ElButton>
      <ElButton size="small" icon="el-icon-upload2" style="background:#ADA3EE;border-color: #ADA3EE;color:#fff;" class="downLoadBtnOnly" @click="clickExportGoods">
        导出商品
      </ElButton>
      <ElButton size="small" icon="el-icon-download" style="background:#4FD5AC;border-color: #4FD5AC;color:#fff;" class="addBtnOnly" @click="clickImportStock">
        导入库存
      </ElButton>
    </div>
    <ElDivider />

    <ElTable
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
    >
      <template slot="empty">
        <p>{{ tableEmptyText }}</p>
      </template>
      <ElTableColumn
        v-for="(item, index) in headTitArr"
        :key="index"
        show-overflow-tooltip
        sortable

        :prop="item.fieldKey"
        :min-width="GLOBAL.minCellWidth"
        :label="item.fieldName"
      >
        <template slot-scope="scope">
          <!-- <img width='50px' height="50px"  v-if='index==3' :src="scope.row.resUrl" alt=""> -->
          <span v-if="item.fieldKey == &quot;resUrl&quot;">
            <img v-if="scope.row.resUrl" width="50px" height="50px" style="display:block;margin:0 auto;" :src="scope.row.resUrl" alt="">
            <span v-else>无</span>
          </span>
          <div v-else>
            <span v-if="item.fieldKey == &quot;status&quot;" style="text-align:center;" :style="scope.row[(item.fieldKey)] == &quot;GROUNDING&quot; ? &quot;color:#1978FE;&quot; : &quot;color:#e60012;&quot;">{{ scope.row[(item.fieldKey)] | formatStatus }}</span>
            <span v-else-if="item.fieldKey == &quot;recommendationLevel&quot;">{{ scope.row[(item.fieldKey)] | formatPoint }}</span>
            <span v-else>{{ scope.row[(item.fieldKey)] }}</span>
          </div>
          <!-- <span v-else>{{scope.row[(item.fieldKey)]}}</span> -->
        </template>
      </ElTableColumn>
      <ElTableColumn
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        prop="amountTo"
        label="库存总数"
      />

      <ElTableColumn
        fixed="right"
        label="操作"
        style="border-lrft:none;"
        width="180"
      >
        <template slot-scope="scope">
          <ElTooltip v-if="scope.row.status == &quot;GROUNDING&quot;" class="item" effect="dark" content="查看商品详情" placement="top">
            <ElButton size="mini" type="primary" icon="el-icon-view" circle class="editBtnOnly" @click="viewGoodsItem(scope.row, scope.$index)" />
          </ElTooltip>
          <ElTooltip v-if="scope.row.status == &quot;NOTGROUNDING&quot;" class="item" effect="dark" content="编辑商品" placement="top">
            <ElButton size="mini" type="primary" icon="el-icon-edit" circle class="editBtnOnly" @click="editGoodsItem(scope.row, scope.$index)" />
          </ElTooltip>
          <ElTooltip v-if="scope.row.status == &quot;NOTGROUNDING&quot;" class="item" effect="dark" content="删除商品" placement="top">
            <ElButton size="mini" type="danger" icon="el-icon-delete" class="delBtnOnly" circle @click="delGoodsItem(scope.row, scope.$index)" />
          </ElTooltip>
          <ElTooltip v-if="scope.row.status == &quot;GROUNDING&quot;" class="item" effect="dark" content="已上架商品不可删除" placement="top">
            <ElButton size="mini" icon="el-icon-delete" circle @click="noDelGoodsItem(scope.row, scope.$index)" />
          </ElTooltip>
          <ElTooltip v-if="scope.row.status == &quot;NOTGROUNDING&quot;" class="item" effect="dark" content="商品上架" placement="top">
            <ElButton size="mini" class="authBtnOnly" style="border-color: #FCCB02;background: #FCCB02;color:#fff;" icon="el-icon-top" circle @click="putOnGoodsItem(scope.row, scope.$index)" />
          </ElTooltip>
          <ElTooltip v-if="scope.row.status == &quot;GROUNDING&quot;" class="item" effect="dark" content="商品下架" placement="top">
            <ElButton size="mini" class="authBtnOnly" style="border-color: #FCCB02;background: #FCCB02;color:#fff;" icon="el-icon-bottom" circle @click="offGoodsItem(scope.row, scope.$index)" />
          </ElTooltip>
          <ElTooltip class="item" effect="dark" content="库存分布" placement="top">
            <ElButton size="mini" class="authBtnOnly" style="border-color: #FCCB02;background: #FCCB02;color:#fff;" icon="el-icon-s-data" circle @click="viewGoodStock(scope.row, scope.$index)" />
          </ElTooltip>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElPagination
      :current-page="pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 导出商品 -->
    <ElDrawer
      title="请选择需要导出的字段"
      :visible.sync="exportModelFlag"
      :wrapper-closable="false"
      direction="rtl"
      size="40%"
    >
      <div class="demo-drawer__content">
        <ElCheckboxGroup v-model="checkList" @change="changeChecked">
          <div
            v-for="(item, index) in exportInfoList" :key="index"
            style="text-align:left;margin:6px 0px;"
          >
            <ElCheckbox
              :label="item.columnName"
              true-label
            >
              {{ item.columnDesc }}
            </ElCheckbox>
          </div>
        </ElCheckboxGroup>
        <div style="margin-top: 20px">
          <ElButton size="small" @click="cancelExportGoods">
            取 消
          </ElButton>
          <ElButton size="small" type="primary" @click="confirmExportGoods">
            确 认
          </ElButton>
        </div>
      </div>
    </ElDrawer>

    <!-- 导入商品 -->
    <ElDrawer
      :title="importType == 1 ? '导入商品' : '导入商品库存'"
      :visible.sync="importFlag"
      direction="rtl"
      size="40%"
      :before-close="handleImportClose"
    >
      <div class="demo-drawer__content">
        <ElUpload
          ref="upload"
          class="upload-demo"
          style="margin:30px 0px;"
          :limit="1"
          action="#"
          accept=".xlsx,.xls"
          :http-request="uploadFile"
          :on-change="changeFile"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :auto-upload="false"
        >
          <template #trigger>
            <ElButton size="small" type="primary">
              选取文件
            </ElButton>
          </template>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 .xlsx/.xls 文件，且不超过 1000kb
            </div>
          </template>
        </ElUpload>
        <div style="margin-top: 20px">
          <ElButton v-if="importType == 1" size="small" type="success" @click="confirmImportGoods">
            导入商品
          </ElButton>
          <ElButton v-if="importType == 2" size="small" type="success" @click="confirmImportStock">
            导入库存
          </ElButton>
          <ElButton size="small" @click="cancelImport">
            取消导入
          </ElButton>
        </div>
      </div>
    </ElDrawer>

    <!-- 导入excel时错误数据的展示 -->
    <ElDrawer
      title="导入错误数据展示"
      :visible.sync="importErrDataFlag"
      direction="rtl"
      size="40%"
      :before-close="handleImportErrClose"
    >
      <div class="demo-drawer__content">
        <h3>{{ addCount }}</h3>
        <h3>{{ upDateCount }}</h3>
        <h3>{{ failureCount }}</h3>
        <h3>失败数据如下:</h3>
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
          <ElButton size="small" @click="cancelErrData">
            取消
          </ElButton>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<style lang="less" scoped>
@deep:~">>>";
#goodsList{
  text-align: left;
  .operateBtn{
    margin-bottom:10px;
    display:flex;
  }
  @{deep} .el-tooltip {
    padding: 7px!important;
  }
  .active{
    color:orangered;
  }
  h2{
    line-height: 30px;
  }

}
</style>
