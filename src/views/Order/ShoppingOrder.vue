<template>
  <div id="customerList" class="pageCommonStyle">
    <vc-search
      ref="child"
      :headTitArr='headTitArr'
      :pageNum='pageNum'
      :pageSize='pageSize'
      :requestUrl='requestUrl'
      @changeLoading='changeLoad'
      @sendData='showChildData'/>
    <div class="operateBtn" style="display: inline-block;">
  
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
          <template scope="scopeStatus" v-if="item.fieldKey == 'state'">
            <span v-if="scopeStatus.row.state == 0">所有</span>
            <span v-else-if="scopeStatus.row.state == 1">待付款</span>
            <span v-else-if="scopeStatus.row.state == 2">待收货</span>
            <span v-else-if="scopeStatus.row.state == 3">已完成</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button
                size="mini"
                type="success"
                icon="el-icon-view"
                circle
                @click="readShoppingItem(scope.row,scope.$index)"></el-button>
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
  </div>
</template>

<script>
import VcSearch from '../../components/basic/CommonSearch'

export default {
  components: {
    VcSearch,
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
    }
  },
  created() {
    this.requestUrl = this.Api.getAllShoppingOrder
    if (sessionStorage.headTitString&&sessionStorage.headTitString.indexOf('@') != -1) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString.split('@')[1])
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
  },
  activated() {
    if (sessionStorage.headTitString&&sessionStorage.headTitString.indexOf('@') != -1) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString.split('@')[1])
    }
    const _this = this
    _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
  },
  watch: {},
  methods: {
    readShoppingItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/order/editshoppinginfo',
        query: {
          item,
        },
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
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
  },
}
</script>
