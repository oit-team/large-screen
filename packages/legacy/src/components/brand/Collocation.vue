<script>
// import commonSearch from '../common/commonSearch'
export default {
  name: 'RoleList',
  // components: { CommonSearch: commonSearch },
  props: {
    nodeId: {
      type: Number,
    },
    isShop: {
      type: String,
    },
  },
  data() {
    return {
      drawer: false,
      drawerData: [],
      creatorActive: 0, // 选中的用户creator
      pickerDate: [], // 选中的时间
      CollData: {
        resultList: [], // 用户审批列表
        statList: [], // 总上传数据
      },
      collImgList: [], // 图片列表
      loading: false,
      type: '0',
      creator: '0',
      total: 0,
      pageSize: 30,
      pageNum: 1,
      isLoadData: false, // 是否可以下拉加载数据
      loadMsg: false, // 下拉加载提示是否显示
      menuStatus: '',
      selectU: '1',
    }
  },
  watch: {
    $route(to, from) {},
  },
  created() {
    this.getDate()
  },
  mounted() {

  },
  activated() {

  },
  methods: {
    handleClose() {
      this.drawer = false
    },
    openDrawer(item) {
      this.drawerData = ''
      this.drawer = true
      const _this = this
      const con = {
        // collId: 2751
        collId: item.id,
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/api/coll/selectApprovalByCollId`, jsonParam).then((res) => {
        if (res.data.head.status == 0) {
          _this.drawerData = res.data.body.resultList
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
    // load() {
    //   if (this.isLoadData) {
    //     this.getCollocation()
    //   }
    // },
    test() {
      console.log(this.pickerDate)
    },
    selectmenu(e) {
      this.pageNum = 1
      this.collImgList = []
      this.menuStatus = `${e}`
      this.getCollocation()
    },
    menuClick(data) {
      this.creatorActive = data.creator
      this.pageNum = 1
      this.collImgList = []
      this.getCollocation()
    },
    DateChange() {
      this.pageNum = 1
      this.collImgList = []
      this.getCollData()
    },
    getDate() {
      const start = new Date(new Date().toLocaleDateString())
      const end = new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000 - 1)
      start.setDate(1)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
      const startTime = this.formatTime(start)
      const endTime = this.formatTime(end)
      // this.pickerDate = ['2019-06-03','2022-07-14']
      this.pickerDate = [startTime, endTime]
      this.getCollData()
    },
    formatTime(time) {
      if (!time) {
        return ''
      }
      const year = new Date(time).getFullYear()
      let month = new Date(time).getMonth() + 1
      if (month < 10) {
        month = `0${month}`
      }
      let day = new Date(time).getDate()
      if (day < 10) {
        day = `0${day}`
      }
      return `${year}-${month}-${day}`
    },
    getCollData() {
      const _this = this
      const con = {
        brandId: sessionStorage.brandId,
        // brandId: 63,
        isShop: this.isShop,
        orgStId: this.nodeId,
        startTime: this.pickerDate[0],
        endTime: this.pickerDate[1],
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/api/coll/selectCollDataByBrand`, jsonParam).then((res) => {
        if (res.data.head.status == 0) {
          _this.CollData = res.data.body
          if (_this.CollData.resultList.length > 0) {
            _this.loading = true
            _this.getCollocation()
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
    getCollocation() {
      this.loadMsg = true
      const _this = this
      const con = {
        creator: this.creatorActive,
        startTime: this.pickerDate[0],
        endTime: this.pickerDate[1],
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        brandId: sessionStorage.brandId,
        isShop: this.isShop,
        orgStId: this.nodeId,
      }
      if (_this.menuStatus !== '' && _this.menuStatus !== '0') {
        con.status = this.menuStatus
      }
      const jsonParam = _this.GLOBAL.g_paramJson(con)
      _this.$axios.post(`${_this.GLOBAL.goods_manager_server}/api/coll/selectCollocationByCreator`, jsonParam).then((res) => {
        if (res.data.head.status == 0) {
          this.total = res.data.body.count
          if (res.data.body.resultList.length < _this.pageSize) {
            _this.isLoadData = false
            _this.loadMsg = false
          }
          else {
            _this.isLoadData = true
            // _this.pageNum ++
          }
          _this.collImgList.push(...res.data.body.resultList)
        }
        else {
          this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
        this.loadMsg = false
        this.loading = false
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    },
    getRequestUrl() {

    },
    handleSizeChange(val) {
      this.pageSize = val
      this.collImgList = []
      this.collImgList.length = 0
      this.getCollocation()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.collImgList = []
      this.collImgList.length = 0
      this.getCollocation()
    },
  },
}
</script>

<template>
  <div id="roleList" class="pageCommonStyle" style="height:calc(100% - 20px);">
    <div class="searchBox">
      <ul>
        <li>
          <span>日期:</span>
          <ElDatePicker
            v-model="pickerDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="DateChange"
          />
        </li>
        <li :class="selectU === '1' ? 'selectUp' : ''" @click="selectU = '1', selectmenu(0)">
          <span>总上传数:</span>{{ CollData.statList.find(item => item.status == 4) ? CollData.statList.find(item => item.status == 4).count : 0 }}套
        </li>
        <li :class="selectU === '2' ? 'selectUp' : ''" @click="selectU = '2', selectmenu(2)">
          <span>审批拒绝:</span>{{ CollData.statList.find(item => item.status == 2) ? CollData.statList.find(item => item.status == 2).count : 0 }}套
        </li>
        <li :class="selectU === '3' ? 'selectUp' : ''" @click="selectU = '3', selectmenu(1)">
          <span>审批中:</span>{{ CollData.statList.find(item => item.status == 1) ? CollData.statList.find(item => item.status == 1).count : 0 }}套
        </li>
        <li :class="selectU === '4' ? 'selectUp' : ''" @click="selectU = '4', selectmenu(3)">
          <span>审批通过:</span>{{ CollData.statList.find(item => item.status == 3) ? CollData.statList.find(item => item.status == 3).count : 0 }}套
        </li>
      </ul>
    </div>
    <div class="headNav">
      <ul>
        <li v-for="(item, index) in CollData.resultList" :key="index" :class="creatorActive == item.creator ? 'active' : ''" @click="menuClick(item)">
          {{ item.userName }}({{ item.amount }})
        </li>
        <li v-if="CollData.resultList.length == 0">
          暂无数据
        </li>
      </ul>
    </div>
    <div v-loading="loading" class="ImgListContent">
      <ul class="infinite-list" style="overflow:auto">
        <li v-for="(item, index) in collImgList" :key="index">
          <div class="imageDiv">
            <ElImage
              style="width: 140px; height: 160px;float:left"
              :src="item.collImgUrlList[0]"
              fit="cover"
              :preview-src-list="item.collImgUrlList"
            />
            <div class="imageadd">
              {{ item.collImgUrlList.length }}张
            </div>
          </div>
          <div class="Imgfoot">
            <p>{{ item.userName }}</p>
            <p>{{ item.shopName }}</p>
            <!-- <p>{{formatTime(item.createTime)}}</p> -->
            <p>{{ item.createTime }}</p>
          </div>
          <div v-if="item.status == 0" class="state state1" @click="openDrawer(item)">
            已保存
          </div>
          <div v-else-if="item.status == 1" class="state state1" @click="openDrawer(item)">
            审批中
          </div>
          <div v-else-if="item.status == 2" class="state state2" @click="openDrawer(item)">
            审批拒绝
          </div>
          <div v-else-if="item.status == 3" class="state state3" @click="openDrawer(item)">
            已发布
          </div>
        </li>
      </ul>

      <!-- <p v-if="loadMsg&&collImgList.length == 0">加载中...</p> -->
      <!-- <p v-if="isLoadData == false&&collImgList.length != 0">已经到底了~</p> -->
      <ElEmpty v-if="collImgList.length == 0 && !loadMsg" description="暂无数据" />
      <ElPagination
        class="pagination"
        :current-page="pageNum"
        :page-sizes="[30, 40, 50]"
        :hide-on-single-page="isLoadData"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <ElDrawer
      title="审核详情"
      :visible.sync="drawer"
      direction="rtl"
      class="drawerContent"
      :before-close="handleClose"
    >
      <div v-for="(item, index) in drawerData" :key="index">
        <p>审批人:{{ item.userName }}</p>
        <p>审批原因:{{ item.remark }}</p>
        <p>审批时间:{{ item.createDate }}</p>
      </div>
    </ElDrawer>
  </div>
</template>

<style lang="less" scoped>
@deep:~">>>";
@{deep} .el-tooltip {
  padding: 7px 7px!important;
}
@{deep} .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  color:#1978FE;
  // background-color:#C5DDFF;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 250px!important;
}
@{deep} .el-date-editor .el-range-separator{
  width: 24px;
}
#roleList{
  height:100%;
  overflow:hidden;
  display:flex;
  flex:1;
  flex-direction:column;
  .ImgListContent{
    flex:1;
    height:100%;
    overflow:auto;
  }
}
.searchBox ul{
  text-align:left;
  >li{
    display: inline-block;
    padding: 5px;
    margin: 0 10px 10px;
    cursor: pointer;
    border-radius: 2px;
  }
  .selectUp{
    background-color: #6096e6;
    color: #fff;
  }
}
.headNav ul{
  background: #6096E6;
  text-align: left;
  border-radius: 4px;
  padding: 6px 6px 0;
  >li {
    display:inline-block;
    color:#fff;
    padding:4px 6px;
    background: #6096E6;
    // background: #74a7f2;
    cursor:pointer;
    border-radius: 2px;
    margin-right: 6px;
    margin-bottom: 6px;
    transition: all 0.2s;
  }
  >li:hover {
    transition: all 0.2s;
    // background: #6096E6;
  }
  >li.active{
    transition: all 0.2s;
    background: #74a7f2;
  }
}
.ImgListContent ul{
  text-align:left;
  li{
    position:relative;
    display: inline-block;
    border: 1px solid #D9D9D9;
    margin: 20px 10px 0;
    overflow:hidden;
    background:#D9D9D9;
    padding:6px 0;
    text-align:center;
    >div{
      overflow:hidden;
    }
    div.state{
      cursor:pointer;
      position:absolute;
      left: -26px;
      top: 8px;
      background: red;
      font-size: 14px;
      padding: 2px 6px;
      width: 110px;
      height:30px;
      line-height:30px;
      text-align: center;
      transform:rotate(320deg);
      color:#fff;
    }
    div.imageDiv{
      position: relative;
    }
    div.imageadd{
      position: absolute;
      bottom: 5px;
      right: 5px;
      border-radius: 3px;
      background: #ccc;
      padding: 0 3px;
      box-sizing: border-box;
    }
    div.state0{
      background:#3086FE;
    }
    div.state1{
      background:#E6A23C;
    }
    div.state2{
      background:#F56C6C;
    }
    div.state3{
      background:#67C23A;
    }
  }
}
.selectUp{
  background-color: #6096e6;
  color: #fff;
}
.pagination{
  position: sticky;
  // right: 80px;
  // bottom: 40px;
}
.drawerContent div{
  border:1px solid #7e8286;
  padding:10px;
  margin-bottom:20px;
}
.drawerContent p{
  text-align:left;
  line-height: 22px;
}
</style>
