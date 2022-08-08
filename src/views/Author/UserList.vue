<template>
  <div id="customerList" class="pageCommonStyle" style="height:100%;display: flex;flex-direction: column;">
    <vc-search
      ref="child"
      :headTitArr='headTitArr'
      :pageNum='pageNum'
      :pageSize='pageSize'
      :requestUrl='requestUrl'
      @changeLoading='changeLoad'
      @sendData='showChildData'/>

    <div class="operateBtn" style="display: inline-block;">
      <el-button type="primary" size="small" @click="exportFile">导出</el-button>
      <el-button type="primary" size="small" @click="assetAllocation">资产配置</el-button>
    </div>
    <el-divider></el-divider>
    <el-table
        v-loading="loading"
        element-loading-text="拼命加载中..."
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          show-overflow-tooltip
          sortable
          v-for="(item,index) in headTitArrNew"
          :key="index"
          :min-width="GLOBAL.minCellWidth"
          :prop="item.fieldKey"
          :label="item.fieldName">
          <template scope="scopeStatus" v-if="item.fieldKey == 'status'">
            <span style="color: red;" v-if="scopeStatus.row.status == 1">禁用</span>
            <span style="color: #67C23A;" v-else-if="scopeStatus.row.status == 0">启用</span>
          </template>
          <template scope="scopeSex" v-else-if="item.fieldKey === 'sex'">
            <span v-if="scopeSex.row.sex == 0">男</span>
            <span v-else-if="scopeSex.row.sex == 1">女</span>
            <span v-else-if="scopeSex.row.sex == -1">暂无</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                class="editBtnOnly"
                circle
                @click="editCustomerItem(scope.row,scope.$index)"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status == 1" class="item" effect="dark" content="启用" placement="top">
              <el-button
                size="mini"
                type="success"
                icon="el-icon-open"
                @click="updateStatus(scope.row,scope.$index,0)"
                circle>
              </el-button>
            </el-tooltip>
            <el-tooltip  v-else-if="scope.row.status == 0" class="item" effect="dark" content="停用" placement="top">
              <el-button
                size="mini"
                type="info"
                icon="el-icon-turn-off"
                @click="updateStatus(scope.row,scope.$index,1)"
                circle>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[15, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <el-drawer
      :visible.sync="drawerProportion"
      :before-close="handleClose"
      :with-header="false"
    >
      <el-tabs class="py-3 px-4" value="0">
        <el-tab-pane label="冻结资产配置比例" :v-model="proportionValList">
          <el-form label-position="top">
            <el-form-item label="资产比例" prop="proportionVal">
              <vc-input
                v-model="proportionVal"
                type="number"
                placeholder="请输入资产比例"
                :formatter="formatter"
                format-trigger="blur"
                class="input-with-select"
              >
              </vc-input>
              <span class="percentSign">%</span>
            </el-form-item>
            <div>
              <el-button class="w-full" type="primary"  @click="confirmProportionInfo()">确认</el-button>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import VcSearch from '../../components/basic/CommonSearch'
import { downloadFile } from '@oit/utils'
import { Input as VcInput } from '@oit/element-ui-extend'

export default {
  components: {
    VcSearch,
    VcInput,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      total: 0,
      pageNum: 0,
      pageSize: 15,
      requestUrl: '',
      editIndex: null,
      dynamicParam: [],
      loading: true,
      tableData: [],
      headTitArr: [],
      searchParams: {},
      drawerProportion:false,
      proportionCreatedId:'',
      proportionValList:'',
      proportionVal:'',
      isAddProportion:false
    }
  },
  created() {
    this.requestUrl = this.Api.getUsers
    
    if (sessionStorage.headTitString&&sessionStorage.headTitString.indexOf('@') == -1) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    this.dynamicParam = [
      {
        key: 'pageNum',
        value: '1',
        isTrue: true,
        msg: '请确认pageNum',
      },
      {
        key: 'pageSize',
        value: '15',
        isTrue: true,
        msg: '请确认pageSize',
      },
    ]
  },
  computed:{
    headTitArrNew() {
      return this.headTitArr.filter(item => !item.noTableShow)
    },
  },
  mounted() {
    this.pageNum = 1
    this.dynamicParam.forEach(el => {
      if (el.key === 'pageNum') {
        el.value = this.pageNum
      }
    })
    // this.$refs.child.parentMsgs(this.dynamicParam)
  },
  activated() {
    console.log(this.isAddProportion)
    if (sessionStorage.headTitString&&sessionStorage.headTitString.indexOf('@') == -1) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    const _this = this
    // _this.$bus.$off('detailShow')
    // /* 接收参数 */
    // _this.$bus.$on('detailShow', (data) => {
    //   if (!data.id) {
    //     _this.$nextTick(() => {
    //       _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
    //     })
    //   } else {
    //     _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
    //   }
    // })
    _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
  },
  watch: {},
  methods: {
    formatter(value){
      value = Math.min(Math.max(0, +value), 100)
      return value.toFixed(2)
    },
    // 导出用户列表
     exportFile() {
      this.$axios
        .post(this.Api.getExportUser, this.GLOBAL.paramJson({
          ...this.searchParams,
        }), {
          responseType: 'arraybuffer',
        })
        .then(res => {
          const date = new Date().toLocaleDateString().replace(/\//g, '-')
          downloadFile(res.data, `用户列表${date}.xls`)
        })
    },
    // 资产配置确认
    confirmProportionInfo() {
      if(!this.proportionVal) {
         this.$message({
          message: '资产比例不能为空！请重新输入',
          type: 'warning'
        })
        return
      }
      this.isAddProportion ? this.addDictitemInfoAllMethod() : this.updateDictitemInfoAllMethod()
      this.drawerProportion = false
    },
    // 新增资产比例
    addDictitemInfoAllMethod(){
      const _this = this
      const con = {
        dictCode: "USER_ASSETS",
        dictitemDisplayName: this.formatter(this.proportionVal),
        dictitemOrderkey:1,
        remark:"资产解封比例",
        createId:this.proportionCreatedId
      }
      const cmd = 100002
      const jsonParam = _this.GLOBAL.paramJson(con,cmd)
      _this.$axios.post(_this.Api.addDictitemInfoAllMethod, jsonParam).then((res)=>{
        if(res.data.head.status === 0){
          console.log(res)

        } else{
          _this.$message({
            message:res.data.head.msg,
            type:'warning',
          })
        }
      })
    },
    // 获取资产比例
    getDictitemInfoAllMethod(){
     const _this = this
      const con = {
        type: "USER_ASSETS"
      }
      const cmd = 100009
      const jsonParam = _this.GLOBAL.paramJson(con,cmd)
      _this.$axios.post(_this.Api.getDictitemInfoAllMethod, jsonParam).then((res) => {
        if(res.data.head.status === 0) {
          if(res.data.body.result.length===0){
            this.isAddProportion = true
            this.proportionVal= ''
            this.proportionCreatedId = sessionStorage.getItem('userId')
            return
          }
          this.isAddProportion=false
          this.proportionValList = res.data.body.result[0]
          this.proportionVal = res.data.body.result[0].dicttimeDisplayName
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
       
      })
    },
    // 修改资产比例
    updateDictitemInfoAllMethod(){
      const _this = this
      const con = {
        dictitemCode: this.proportionValList.dictitemCode,
        dictCode: this.proportionValList.dictCode,
        dictitemOrderkey: 1,
        dictitemDisplayName: this.formatter(this.proportionVal)
      }
      const cmd = 100003
      const jsonParam = _this.GLOBAL.paramJson(con,cmd)
      _this.$axios.post(_this.Api.getDictitemInfoAllMethod, jsonParam).then((res) => {
        if(res.data.head.status === 0) {
          console.log(res)
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
       
      })
    },
    assetAllocation(){
      this.drawerProportion = true
      this.getDictitemInfoAllMethod()
    },
    editCustomerItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/author/edituserinfo',
        query: {
          item,
        },
      })
    },
    updateStatus(item, index, status) {
      let msg = ''
      if (status == 0) {
        msg = '启用'
      } else if(status == 1) {
        msg = '停用'
      }
      this.$confirm(`确认${msg}该用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          id: item.id,
          status: status
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.Api.updateStatus, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            item.status = status
            _this.$message({
              type: 'success',
              message: `${msg}成功`,
            })
          } else {
            _this.$message({
              type: 'error',
              message: res.data.head.msg,
            })
          }
        })
      }).catch(() => {
      })
    },
    changeLoad(val) {
      this.loading = val
    },
    showChildData(tableData, total, tableEmptyText, pageNum, params) {
      this.searchParams = params
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
    handleSizeChange(val) {
      this.pageSize = val
      this.dynamicParam.forEach(el => {
        if (el.key === 'pageSize') {
          el.value = this.pageSize
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.dynamicParam.forEach(el => {
        if (el.key === 'pageNum') {
          el.value = this.pageNum
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    addMenu() {
      this.$router.push({
        path: '/author/addauthor',
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
    async handleClose() {
      if (!this.proportionVal) {
        await this.$confirm('确定要关闭修改吗？', {
          type: 'warning',
        })
        this.drawerProportion = false
      } else {
        this.drawerProportion = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-form-item__content .input-with-select{
    width: 50%;
  }
  .percentSign{
    margin-left: 10px;
  }
</style>