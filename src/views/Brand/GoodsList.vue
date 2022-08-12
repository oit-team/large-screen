<template>
  <div id="taskList" class="pageCommonStyle">
    <VcSearch
      ref="child"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :request-url="requestUrl"
      @changeLoading="changeLoad"
      @sendData="showChildData"
    />
    <div class="operateBtn">
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addGoods">
        新增商品
      </el-button>
    </div>
    <el-divider></el-divider>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中..."
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in headTitArrNew"
        :key="index"
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        :prop="item.fieldKey"
        :label="item.fieldName"
      >
        <template slot-scope="scope">
          <span v-if="item.fieldKey == &quot;status&quot;" class="imgBox">
            <span v-if="scope.row.status === 0" style="color: #FF0000;">未上架</span>
            <span v-else style="color: #42B983;">已上架</span>
          </span>
          <span v-else-if="item.fieldKey == &quot;resUrl&quot;" class="imgBox">
            <img v-if="scope.row.mainImage && scope.row.mainImage.length > 0 && scope.row.mainImage[0].resUrl" style="display:block;margin:0 auto;" :src="scope.row.mainImage[0].resUrl" alt="">
            <span v-else>无</span>
          </span>
          <div v-else>
            <span>{{ scope.row[(item.fieldKey)] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="166"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-view"
              circle
              @click="readMenuItem(scope.row, scope.$index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              size="mini"
              :disabled="scope.row.status === 1"
              type="primary"
              icon="el-icon-edit"
              class="editBtnOnly"
              circle
              @click="editMenuItem(scope.row, scope.$index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="上架" placement="top">
            <el-button
              v-if="scope.row.status === 0"
              size="mini"
              type="warning"
              icon="el-icon-s-promotion"
              class="authBtnOnly"
              circle
              @click="issueTimerItem(scope.row, scope.$index, 1)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下架" placement="top">
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="danger"
              icon="el-icon-minus"
              class="delBtnOnly"
              circle
              @click="issueTimerItem(scope.row, scope.$index, 0)"
            >
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              :disabled="scope.row.status === 1"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="delBtnOnly"
              circle
              @click="delMenuItem(scope.row, scope.$index)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageNum"
      :page-sizes="[15, 20, 30]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
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
  computed: {
    headTitArrNew() {
      return this.headTitArr.filter(item => !item.noTableShow)
    },
  },
  watch: {},
  created() {
    this.requestUrl = this.Api.getGoodsList
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
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
    this.dynamicParam.forEach((el) => {
      if (el.key === 'pageNum') {
        el.value = this.pageNum
      }
    })
    // this.$refs.child.parentMsgs(this.dynamicParam)
  },
  activated() {
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    const _this = this
    _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
  },
  methods: {
    issueTimerItem(item, index, type) {
      let msg = ''
      let newState = ''
      let tipMsg = ''
      if (type === 1) {
        msg = '确认上架该商品'
        tipMsg = '上架成功！'
        newState = 1
      } else if (type === 0) {
        msg = '确认下架该商品'
        tipMsg = '下架成功！'
        newState = 0
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          goodsId: item.goodsId,
          status: newState,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(this.Api.updateGoodsStatusById, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.tableData[index].status = newState
            _this.$message({
              type: 'success',
              message: tipMsg,
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
    editMenuItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/brand/addgoods',
        query: {
          item,
        },
      })
    },
    readMenuItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/brand/addgoods',
        query: {
          item,
          flag: 'read',
        },
      })
    },
    delMenuItem(item, index) {
      this.$confirm('确认删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          goodsId: item.goodsId,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.Api.deleteGoodsInfo, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.tableData.splice(index, 1)
            if (_this.total > 0) {
              _this.total -= 1
            }
            if (_this.tableData.length === 0 && _this.total > 0) {
              _this.pageNum -= 1
              _this.dynamicParam.forEach((el) => {
                if (el.key === 'pageNum') {
                  el.value = _this.pageNum
                }
              })
              _this.$refs.child.parentMsgs(_this.dynamicParam)
            }
            _this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else {
            _this.$message({
              type: 'error',
              message: res.data.head.msg,
            })
          }
        })
      }).catch(() => {})
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
      this.dynamicParam.forEach((el) => {
        if (el.key === 'pageSize') {
          el.value = this.pageSize
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.dynamicParam.forEach((el) => {
        if (el.key === 'pageNum') {
          el.value = this.pageNum
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    addGoods() {
      this.$router.push({
        path: '/brand/addgoods',
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
  },
}
</script>

<style lang="scss" scoped>
  .imgBox img{
    max-width:100%;
    height:auto;
    max-height:50px;
  }
</style>
