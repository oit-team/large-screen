<template>
  <div class="common-search">
    <div ref="opeSlideBox" class="operateBox">
      <div class="searchBox">
        <div class="itemBox">
          <div v-for="(item, index) in headArr" :key="index">
            <div v-if="!item.noSearchShow" class="searchItem">
              <div v-if="item.fieldType == '文本'">
                <div v-if="item.fieldType == '文本'" class="searchTit">
                  {{ item.fieldName }}
                </div>
                <el-input
                  v-if="item.fieldType == '文本'"
                  v-model="item.searchValKey"
                  placeholder="请输入搜索内容"
                  prefix-icon="el-icon-search"
                  clearable
                  @keyup.enter.native="clickSearch()"
                >
                </el-input>
              </div>
              <div v-if="item.fieldType == '值列'">
                <div v-if="item.fieldType == '值列'" class="searchTit">
                  {{ item.fieldName }}
                </div>
                <el-select
                  v-if="item.fieldType == '值列'"
                  v-model="item.searchValKey"
                  clearable
                  placeholder="请选择"
                  @keydown.enter.native="clickSearch()"
                >
                  <el-option
                    v-for="i in item.fieldAttr"
                    :key="i.optionKey"
                    :label="i.optionValue"
                    :value="i.optionKey"
                  >
                  </el-option>
                </el-select>
              </div>
              <div v-if="item.fieldType == '日期'">
                <div v-if="item.fieldType == '日期'" class="searchTit">
                  {{ item.fieldName }}
                </div>
                <el-date-picker
                  v-if="item.fieldType == '日期'"
                  v-model="item.searchValKey"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="onChange"
                >
                </el-date-picker>
              </div>
              <div v-if="item.fieldType == '时间'">
                <div v-if="item.fieldType == '时间'" class="searchTit">
                  {{ item.fieldName }}
                </div>
                <el-time-picker
                  v-if="item.fieldType == '时间'"
                  v-model="item.searchValKey"
                  is-range
                  value-format="HH:mm"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                >
                </el-time-picker>
              </div>
              <div v-if="item.fieldType == '日期时间'">
                <div v-if="item.fieldType == '日期时间'" class="searchTit">
                  {{ item.fieldName }}
                </div>
                <el-date-picker
                  v-if="item.fieldType == '日期时间'"
                  v-model="item.searchValKey"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="searchBtnBox">
          <el-button size="small" icon="el-icon-refresh" type="primary" @click="clickSearch()">
            查询
          </el-button>
          <el-button size="small" icon="el-icon-close" type="info" @click="clearSearch()">
            清空
          </el-button>
        </div>
        <div v-if="foldFlag" class="moreBtn" @click="clickMore">
          <i v-if="foldFlag" class="el-icon-caret-bottom"></i>
        </div>
        <div v-else class="newMoreBtn" @click="clickMore">
          <i class="el-icon-caret-top"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonSearch',
  props: {
    headTitArr: Array,
    pageNum: Number,
    pageSize: Number,
    OtherData: Object,
    serverName: String,
    requestUrl: String,
    cmdVal: Number,
  },
  data() {
    return {
      height: '180px',
      searchName: '',
      foldFlag: true,
      headArr: '',
      tableEmptyText: '',
      total: '',
      tableData: '',
      pMsg: [
        {
          key: 'pageNum',
          value: '1',
          isTrue: true,
          msg: '请确认pageNum',
        },
        {
          key: 'pageSize',
          value: '10',
          isTrue: true,
          msg: '请确认pageSize',
        }],
    }
  },
  created() {
    this.headArr = this.headTitArr
    this.curRequestUrl = this.requestUrl
    this.headArr.forEach((el) => {
      if (el.fieldType === '值列') {
        if (el.fieldAttr && typeof (el.fieldAttr) === 'string') {
          el.fieldAttr = JSON.parse(el.fieldAttr)
        }
      }
    })
  },
  mounted() {
  },
  activated() {},
  methods: {
    onChange() {},
    clickMore() {
      this.foldFlag = !this.foldFlag
      if (this.foldFlag) { // 折叠---------
        this.$refs.opeSlideBox.style.height = '60px'
        this.$refs.opeSlideBox.style.overflow = 'hidden'
      } else { // 展开---------
        this.$refs.opeSlideBox.style.height = this.height
        this.$refs.opeSlideBox.style.overflow = 'auto'
      }
    },
    parentMsgs(msg) {
      this.pMsg = msg
      this.searchList()
    },
    parentMsg() {},
    getRequestUrl(serverName, url) {},
    parentHeadArr(val) {},
    sendOptions(val) {},
    handleChangeBand(value) {},
    resetSearch(msg, cmd) {
      this.pMsg = msg
      let curCmd = null
      if (cmd) {
        curCmd = cmd
      }
      this.clearSearch(curCmd)
    },
    clickSearch() {
      this.searchList(1)
    },
    searchList(PageNum) {
      if (PageNum) {
        this.pMsg.forEach((el) => {
          if (el.key === 'pageNum') {
            el.value = PageNum
          }
        })
      }
      this.$emit('changeLoading', true)
      let con1 = ''
      this.headArr.forEach((el) => {
        if (el.searchValKey) {
          if (el.fieldType === '日期') {
            con1 += `"start${el.fieldKey}":"${el.searchValKey[0]}","end${el.fieldKey}":"${el.searchValKey[1]}",`
          } else {
            con1 += `"${el.fieldKey}":"${el.searchValKey}",`
          }
        }
      })
      let con2 = ''
      for (let i = 0; i < this.pMsg.length; i++) {
        if (this.pMsg[i].isTrue && !this.pMsg[i].value) {
          this.$message({
            message: this.pMsg[i].msg,
            type: 'warning',
          })
          this.$emit('changeLoading', false)
        } else {
          con2 += `"${this.pMsg[i].key}":"${this.pMsg[i].value}",`
        }
      }
      for (const i in this.OtherData) {
        con2 += `"${i}":"${this.OtherData[i]}",`
      }
      const con4 = null
      let con3 = ''
      let str = ''
      let con = ''
      if (con4) {
        str += `{${con1}${con2}${con4}}`
      } else {
        str += `{${con1}${con2}}`
      }
      const str1 = str.slice(0, str.length - 2)
      const str2 = str.substr(str.length - 1, 1)
      con3 = str1 + str2
      con = JSON.parse(con3)
      if (this.curRequestUrl) {
        const _this = this
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.curRequestUrl, jsonParam).then((res) => {
          _this.$emit('changeLoading', false)
          if (res.data.head.status === 0) {
            if (res.data.body.result) {
              _this.tableData = res.data.body.result
            } else if (res.data.body.resultList) {
              _this.tableData = res.data.body.resultList
            } else if (res.data.body.usersList) {
              _this.tableData = res.data.body.usersList
            } else if (res.data.body.allResultList) {
              _this.tableData = res.data.body.allResultList
            }
            if (_this.tableData.length === 0) {
              _this.tableEmptyText = '暂无数据'
              _this.$message({
                message: '请求成功，暂无数据',
                type: 'success',
              })
            }
            if (res.data.body.totalCount) {
              _this.total = res.data.body.totalCount
            } else if (res.data.body.count) {
              _this.total = res.data.body.count
            }
            _this.$emit('sendData', _this.tableData, _this.total, _this.tableEmptyText, PageNum, con)
          }
        })
      }
    },
    clearSearch(curCmd) {
      const PageNum = curCmd || 1
      this.$emit('changeLoading', true)
      this.pMsg.forEach((el) => {
        if (el.key === 'pageNum') {
          el.value = PageNum
        }
      })
      let con1 = ''
      this.headArr.forEach((el) => {
        if (el.searchValKey) {
          this.$set(el, 'searchValKey', '')
          if (el.fieldType === '日期') {
            con1 += `"start${el.fieldKey}":"${el.searchValKey[0]}","end${el.fieldKey}":"${el.searchValKey[1]}",`
          } else {
            con1 += `"${el.fieldKey}":"${el.searchValKey}",`
          }
        }
      })
      let con2 = ''
      for (let i = 0; i < this.pMsg.length; i++) {
        if (this.pMsg[i].isTrue && !this.pMsg[i].value) {
          this.$message({
            message: this.pMsg[i].msg,
            type: 'warning',
          })
          this.$emit('changeLoading', false)
        } else {
          con2 += `"${this.pMsg[i].key}":"${this.pMsg[i].value}",`
        }
      }
      // if (this.customSearchData.length > 0) {
      //   for (let j = 0; j < this.customSearchData.length; j++) {
      //     this.customSearchData[j].searchValKey = ''
      //   }
      // }
      let con3 = ''
      let str = ''
      str += `{${con1}${con2}}`
      const str1 = str.slice(0, con3.length - 2)
      const str2 = str.substr(con3.length - 1, 1)
      con3 = str1 + str2
      const con = JSON.parse(con3)
      const _this = this
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.curRequestUrl, jsonParam).then((res) => {
        _this.$emit('changeLoading', false)
        if (res.data.head.status === 0) {
          if (res.data.body.result) {
            _this.tableData = res.data.body.result
          } else if (res.data.body.resultList) {
            _this.tableData = res.data.body.resultList
          } else if (res.data.body.usersList) {
            _this.tableData = res.data.body.usersList
          } else if (res.data.body.allResultList) {
            _this.tableData = res.data.body.allResultList
          }
          if (_this.tableData.length === 0) {
            _this.tableEmptyText = '暂无数据'
            _this.$message({
              message: '请求成功，暂无数据',
              type: 'success',
            })
          }
          if (res.data.body.totalCount) {
            _this.total = res.data.body.totalCount
          } else if (res.data.body.count) {
            _this.total = res.data.body.count
          }
          _this.$emit('sendData', _this.tableData, _this.total, _this.tableEmptyText, PageNum)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.common-search{
    position: relative;
  .operateBox{
    width:100%;
    display: flex;
    justify-content: space-between;
    // transition: height 0.3s linear 0s;   // 不要动画左侧就不会有闪现的滚动条
    margin-bottom: 10px;
    border:1px solid #ddd;
    border-radius:4px;
    box-sizing: border-box;
    // background-color: pink;
    height:60px;
    overflow: hidden;
    .moreBtn{
      position: absolute;
      top: 39px;
      right: 0;
      width: 28px;
      height: 25px !important;
      font-size: 15px;
      border: 1px solid #ddd ;
      border-top: 1px solid #fff;
      text-align: center;
      height:40px;
      flex-shrink: 0;
      margin-right:16px;
      margin-top:20px;
      border-radius:4px;
      cursor: pointer;
    }
     .newMoreBtn{
      position: absolute;
      text-align: center;
      top: 159px;
      right: 10px;
      font-size: 15px;
      width: 28px;
      height: 25px !important;
      border: 1px solid #ddd ;
      border-top: 1px solid #fff;
      height:40px;
      flex-shrink: 0;
      margin-right:16px;
      margin-top:20px;
      border-radius:4px;
      cursor: pointer;
    }
    .searchBox{
      flex:1;
      .itemBox{
        flex: 1;
        padding:5px 16px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: flex-start;
        outline:none;
        >div>div{
          margin-right:8px;
        }
        .searchItem{
          margin:5px 0px;
          // margin-right:30px;
          overflow: hidden;
          display: flex;
          align-items: center;
          // background-color: pink;
          flex-wrap: wrap;
          >div{
            width:268px;
            display:flex;
            align-items:center;
            margin-bottom:10px;
          }
          .searchTit{
            width:70px;
            text-align: center;
          }
          .el-input__inner{
            width:216px!important;
          }

          .el-input {
            width: 216px!important;
          }
          .el-select{
            width: 216px!important;
          }
        }
      }
      .searchBtnBox{
        // background-color: orange;
        margin-top:10px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
      }
    }
    .operateBtn{
      margin-bottom:16px;
      display:flex;
      .clearSearch{
        margin-right:auto;
      }
    }
  }
}
::v-deep .el-date-editor .el-range-input{
  width: 60%;
}
</style>
