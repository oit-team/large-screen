<template>
  <div class="goodsDrawer">
    <el-drawer
      title="选择资源"
      size="50%"
      :append-to-body="true"
      :modal-append-to-body="true"
      :before-close="handleClose"
      :visible="goodsDrawer"
      :direction="direction">
      <vc-search
        ref="child"
        :headTitArr='headTitArr'
        :pageNum='pageNum'
        :pageSize='pageSize'
        :OtherData="OtherData"
        :requestUrl='requestUrl'
        @changeLoading='changeLoad'
        @sendData='showChildData'/>
        <div class="operateBtn">
          <el-button size="small" @click='addGoods'  icon="el-icon-plus" type="primary">添加商品</el-button>
        </div>
        <el-divider></el-divider>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中..."
          :data="tableData"
          :row-key="getRowKey"
          border
          ref="elTable"
          style="width: 100%">
          </el-table-column>
          <el-table-column
            type="selection"
            :selectable="selected"
            :reserve-selection="true"
            width="55">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            sortable
            v-for="(item,index) in headTitArrNew"
            :key="index"
            :min-width="GLOBAL.minCellWidth"
            :prop="item.fieldKey"
            :label="item.fieldName">
            <template slot-scope="scope">
              <span v-if='item.fieldKey=="status"'>
                <span style="color: #FF0000;" v-if="scope.row.status === 0">未上架</span>
                <span style="color: #42B983;" v-else>已上架</span>
              </span>
              <span class="imgBox" v-else-if='item.fieldKey=="resUrl"'>
                <img style="display:block;margin:0 auto;"  v-if='scope.row.mainImage&&scope.row.mainImage.length>0&&scope.row.mainImage[0].resUrl' :src="scope.row.mainImage[0].resUrl" alt="">
                <span v-else>无</span>
              </span>
              <div v-else>
                <span>{{scope.row[(item.fieldKey)]}}</span>
              </div>
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
    </el-drawer>
  </div>
</template>

<script>
import VcSearch from '../../basic/CommonSearch'

export default {
  name: 'goodsDrawer',
  components: {
    VcSearch,
  },
  data() {
    return {
      OtherData:{status:'1'},
      goodsDrawer:false,
      direction: 'rtl',
      total: 0,
      pageNum: 0,
      pageSize: 15,
      requestUrl: '',
      editIndex: null,
      dynamicParam: [],
      loading: true,
      tableData: [],
      headTitArr: [],
    }
  },
  computed:{
    headTitArrNew() {
      return this.headTitArr.filter(item => !item.noTableShow)
    },
  },
  created() {
    const headTitArr = '[{"fieldName":"商品名称","fieldType":"文本","fieldKey":"goodsName","dbField":"GOODS_NAME"},{"fieldName":"商品图片","fieldType":"图片","fieldKey":"resUrl","dbField":"RES_URL"},{"fieldName":"商品状态","fieldType":"","fieldKey":"statusName","dbField":"STATUS_NAME"},{"fieldName":"商品作者","fieldType":"文本","fieldKey":"authorName","dbField":"AUTHOR_NAME"},{"fieldName":"创建时间","fieldType":"日期","fieldKey":"createTime","dbField":"CREATE_TIME"}]'
    this.requestUrl = this.Api.getGoodsList
    // if (sessionStorage.headTitString) {
    //   this.headTitArr = JSON.parse(sessionStorage.headTitString)
    // }
    this.headTitArr = JSON.parse(headTitArr)
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
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
    // if (sessionStorage.headTitString) {
    //   this.headTitArr = JSON.parse(sessionStorage.headTitString)
    // }
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    const _this = this
    _this.$bus.$off('detailShow')
    /* 接收参数 */
    _this.$bus.$on('detailShow', (data) => {
       _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
    })
  },
  methods: {
    selected(row , index) {
      if (row.status == 1){
        return true
      } else {
        return false
      }
    },
    getRowKey(row) {
      return row.goodsId
    },
    handleClose() {
      this.$refs.elTable.clearSelection();
      this.goodsDrawer = false
    },
    loadManage() {
      this.$nextTick(() => {
        this.$refs.child.parentMsgs(this.dynamicParam)
      })
    },
    changeLoad(val) {
      this.loading = val
    },
    showChildData(tableData, total, tableEmptyText, pageNum) {
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
    handleOpen(data) {
      this.goodsDrawer = true
    },
    addGoods(){
      this.$emit('addGoods', this.$refs.elTable.selection)
      this.handleClose()
    },
  },
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-range-separator{
    width: 8%;
  }
  ::v-deep .checkBox{
    i{
      color:#409EFF;
      cursor: pointer;
      font-size: 26px;
    }
  }
  ::v-deep .el-drawer{
    padding:0 10px;
  }
  .imgBox img{
    max-width:100%;
    height:auto;
    max-height:50px;
  }
</style>
