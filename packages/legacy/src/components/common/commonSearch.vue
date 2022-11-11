<script>
export default {
  name: 'CommonSearch',
  props: {
    headTitArr: Array,
    pageNum: Number,
    pageSize: Number,
    serverName: String,
    requestUrl: String,
    loading: Boolean, // 貌似没啥用，多此一举了
    nodeId: Number,
    cmdVal: Number,
  },
  data() {
    return {
      foldFlag: true, // true  折叠   false  展开
      height: '180px',
      tableData: [],
      total: 0,
      orgStId: null,
      nodeType: '0', // 店铺查询传1，非店铺的传非1
      tableEmptyText: '',
      pMsg: [], // 父组件传递过来的自定义接口参数列表

      headArr: [],
      customSearchData: [],

      bandOptions: [], // 针对于商品列表页搜索框的搜索条件选项值，需要单独做操作
      idList: [],

    }
  },
  created() {
    this.curServerName = this.serverName
    this.curRequestUrl = this.requestUrl
    if (this.headTitArr) {
      this.headArr = this.headTitArr
    }
    else if (sessionStorage.headTitString) {
      this.headArr = JSON.parse(sessionStorage.headTitString)
    }
    this.headArr.forEach((el) => {
      this.$set(el, 'searchValKey', '')
      // el.searchValKey = ''
      if (el.fieldType == '值列') {
        // console.log(el.fieldAttr)
        if (el.fieldAttr && typeof (el.fieldAttr) == 'string') {
          el.fieldAttr = JSON.parse(el.fieldAttr)
        }
        // console.log("================",el.fieldAttr)
      }
    })
    // console.log("赋值searchValKey的this.headArr===",this.headArr);
  },
  mounted() {

  },
  activated() {},
  methods: {
    // 日期组件值改变后，搜索按钮聚焦，点击enter键相当于执行搜索事件
    onChange() {
      this.clickSearch()
    },
    // 点击收起折叠按钮
    clickMore() {
      this.foldFlag = !this.foldFlag
      if (this.foldFlag) { // 折叠---------
        this.$refs.opeSlideBox.style.height = '60px'
        this.$refs.opeSlideBox.style.overflow = 'hidden'
      }
      else { // 展开---------
        this.$refs.opeSlideBox.style.height = this.height
        this.$refs.opeSlideBox.style.overflow = 'auto'
      }
    },
    // 拿到父组件传递过来的自定义的参数值
    parentMsgs(msg) {
      // console.log("父组件传递过来的msg===",msg)
      this.pMsg = msg
      this.searchList()
    },
    // 只针对于用户页面的方法----------start
    // parentMsg 针对用户页面单独的一个方法 只传参，不调方法
    parentMsg(msg) {
      this.pMsg = msg
    },
    // 列表页有tab切换时，切换serverName和url
    getRequestUrl(serverName, url) {
      this.curServerName = serverName
      this.curRequestUrl = url
      // this.searchList();
    },
    // parentHeadArr 针对用户页面单独的一个方法 点击左侧节点时列表页headTitArr更新了，但是搜索组件没有实时接收更改后的数据，只能通过父组件向子组件传值进行更改子组件的数据了
    parentHeadArr(val) {
      // console.log("val------------------------",val);
      this.headArr = val
    },
    // 只针对于用户页面的方法----------end

    sendOptions(val) {
      this.customSearchData = val
      // console.log("搜索组件---",this.customSearchData);
    },
    handleChangeBand(value) {
      // console.log("波段改变后的值---",value);
    },

    // cmd是为了兼容迁移过来的旧页面接口所新加的一个参数，请求列表无需cmd时可为假
    resetSearch(msg, cmd) {
      // 这个cmd是为了兼容迁移过来的旧页面接口所做的操作
      this.pMsg = msg
      // console.log("cmd=====,",cmd);
      let curCmd = null
      if (cmd) {
        curCmd = cmd
      }
      // console.log("curCmd==",curCmd)
      this.clearSearch(curCmd)
    },
    // 点击搜索按钮，重置pageNum为1；
    clickSearch() {
      // console.log("-----------this.pMsg-----------",this.pMsg)
      this.pMsg.forEach((el) => {
        if (el.key == 'pageNum') {
          el.value = 1
        }
      })
      // console.log("this.pMsg===",this.pMsg)
      this.searchList()
    },
    // 搜索
    searchList() {
      this.$emit('changeLoading', true) // 将父组件加载中的状态置为true
      // console.log(' this.headArr===', this.headArr)
      // 将头部搜索组件里的请求参数进行组装
      let con1 = ''
      this.headArr.forEach((el) => {
        if (el.searchValKey) {
          if (el.fieldType == '日期') {
            con1 += `"start${el.fieldKey}":"${el.searchValKey[0]}","end${el.fieldKey}":"${el.searchValKey[1]}",`
          }
          else {
            con1 += `"${el.fieldKey}":"${el.searchValKey}",`
          }
        }
      })
      // console.log("con1==========",con1);
      sessionStorage.headTitString = JSON.stringify(this.headArr)

      // 将父组件传递过来的自定义请求参数进行组装
      let con2 = ''
      // 在项目中使用forEach进行遍历，是无法实现return 解决方法：使用for替换forEach
      for (let i = 0; i < this.pMsg.length; i++) {
        if (this.pMsg[i].isTrue && !this.pMsg[i].value) { // 必填且val为空 给提示
          // debugger
          this.$message({
            message: this.pMsg[i].msg,
            type: 'warning',
          })
          this.$emit('changeLoading', false)
          return false
        }
        else {
          con2 += `"${this.pMsg[i].key}":"${this.pMsg[i].value}",`
        }
      }
      // console.log("con2=====",con2)

      // 自定义搜索组件的请求参数组装之波段系列
      let con4 = ''
      if (this.customSearchData.length > 0) {
        for (let j = 0; j < this.customSearchData.length; j++) {
          if (this.customSearchData[j].fieldName == '波段/系列') {
            if (this.customSearchData[j].searchValKey[0]) {
              con4 = `"bandId":${this.customSearchData[j].searchValKey[0]},`
              if (this.customSearchData[j].searchValKey[1]) {
                con4 = `${con4}"seriesId":${this.customSearchData[j].searchValKey[1]},`
              }
            }
            else {
              con4 = '"bandId":"","seriesId":"",'
            }
          }
        }
      }
      // console.log("con4=====",con4)

      // console.log("con1===",con1)
      // console.log("con2===",con2)
      // console.log("con3===",con4)
      // 导出列表需要按照条件搜索时要把参数传递到父组件去
      let searchData = ''
      searchData = `${con1}${con2}${con4}`
      // console.log("搜索参数：searchData======",searchData)
      this.$emit('sendSearchData', searchData)

      // 将con1和con2进行组合
      let con3 = ''
      let str = ''
      let con = ''
      if (con4) {
        str += `{${con1}${con2}${con4}}`
      }
      else {
        str += `{${con1}${con2}}`
      }
      // str += `{${con1}${con2}}`
      // console.log("str===",str)   // 字符串有个多余的“，”要处理，否则会报错
      const str1 = str.slice(0, str.length - 2)
      const str2 = str.substr(str.length - 1, 1)
      con3 = str1 + str2
      // console.log(str1,str2,con3);
      // console.log("con3===",con3)

      // 最终请求参数，将json字符串转化为json对象
      con = JSON.parse(con3)
      // console.log("最终参数：",con)

      if (this.curRequestUrl) {
        const _this = this
        const jsonParam = _this.GLOBAL.g_paramJson(con, _this.cmdVal)
        // console.log("jsonParam=====",jsonParam)
        _this.$axios.post(_this.curServerName + this.curRequestUrl, jsonParam).then((res) => {
          // console.log("========请求回来的相应列表数据为==========",res.data.body);
          _this.$emit('changeLoading', false)
          if (res.data.head.status == 0) {
            _this.tableData = res.data.body.resultList
            // _this.tableData = []
            if (_this.tableData.length == 0) {
              _this.tableEmptyText = '暂无数据'
            }
            _this.total = res.data.body.count
            _this.$emit('sendData', _this.tableData, _this.total, _this.tableEmptyText)
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
      }
      else {
        this.$message({
          message: '请求url为空',
          type: 'warning',
        })
      }
    },
    // 清空搜索
    clearSearch(curCmd) {
      // console.log("000000000",curCmd)
      this.$emit('changeLoading', true)
      this.pMsg.forEach((el) => {
        if (el.key == 'pageNum') {
          el.value = 1
        }
      })

      // 将头部搜索组件里的请求参数进行组装，this.headArr的el.searchValKey本都为空
      let con1 = ''
      this.headArr.forEach((el) => {
        // el.searchValKey = '';
        this.$set(el, 'searchValKey', '')
        if (el.searchValKey) {
          con1 += `"${el.fieldKey}":"${el.searchValKey}",`
        }
      })

      let con2 = ''
      // 在项目中使用forEach进行遍历，是无法实现return 解决方法：使用for替换forEach
      for (let i = 0; i < this.pMsg.length; i++) {
        if (this.pMsg[i].isTrue && !this.pMsg[i].value) { // 必填且val为空 给提示
          this.$message({
            message: this.pMsg[i].msg,
            type: 'warning',
          })
          this.$emit('changeLoading', false)
          return false
        }
        else {
          con2 += `"${this.pMsg[i].key}":"${this.pMsg[i].value}",`
        }
      }

      // 将搜索框自定义参数值清空
      if (this.customSearchData.length > 0) {
        for (let j = 0; j < this.customSearchData.length; j++) {
          this.customSearchData[j].searchValKey = ''
        }
      }

      let con3 = ''
      let str = ''
      str += `{${con1}${con2}}`
      // console.log("con3===",con3)   // 字符串有个多余的“，”要处理，否则会报错
      const str1 = str.slice(0, con3.length - 2)
      const str2 = str.substr(con3.length - 1, 1)
      con3 = str1 + str2
      // console.log(str1,str2,con3);
      const con = JSON.parse(con3)

      const _this = this
      const jsonParam = _this.GLOBAL.g_paramJson(con, this.cmdVal)
      // console.log("jsonParam=====",jsonParam)

      _this.$axios.post(_this.curServerName + this.curRequestUrl, jsonParam).then((res) => {
        _this.$emit('changeLoading', false)
        // console.log("========清空搜索请求回来的相应列表数据为==========",res.data.body);
        if (res.data.head.status == 0) {
          _this.tableData = res.data.body.resultList

          if (_this.tableData.length == 0) {
            _this.tableEmptyText = '暂无数据'
            _this.$message({
              message: '请求成功，暂无数据',
              type: 'success',
            })
          }
          _this.total = res.data.body.count
          // 清空搜索时，pageNum重置为1，搜索时不用
          const pageNum = 1
          _this.$emit('sendData', _this.tableData, _this.total, _this.tableEmptyText, pageNum)
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

  },
}
</script>

<template>
  <div class="common-search">
    <div ref="opeSlideBox" class="operateBox">
      <div class="searchBox">
        <div id="searchBtn" class="itemBox" tabindex="-1">
          <!-- @keydown.enter="clickSearch()" -->
          <div v-for="(item, index) in headArr" :key="index">
            <div v-if="!item.noSearchShow" class="searchItem">
              <div v-if="item.fieldType == '文本'" class="searchTit">
                {{ item.fieldName }}
              </div>
              <ElInput
                v-if="item.fieldType == '文本'"
                v-model="item.searchValKey"
                placeholder="请输入搜索内容"
                prefix-icon="el-icon-search"
                clearable
                @keyup.enter.native="clickSearch()"
              />

              <div v-if="item.fieldType == '值列'" class="searchTit">
                {{ item.fieldName }}
              </div>
              <ElSelect
                v-if="item.fieldType == '值列'" v-model="item.searchValKey"
                clearable placeholder="请选择" @keydown.enter.native="clickSearch()"
              >
                <ElOption
                  v-for="i in item.fieldAttr"
                  :key="i.optionKey"
                  :label="i.optionValue"
                  :value="i.optionKey"
                />
              </ElSelect>

              <div v-if="item.fieldType == '日期'" class="searchTit">
                {{ item.fieldName }}
              </div>
              <ElDatePicker
                v-if="item.fieldType == '日期'"
                v-model="item.searchValKey"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="onChange"
              />
              <div v-if="item.fieldType == '时间'" class="searchTit">
                {{ item.fieldName }}
              </div>
              <ElTimePicker
                v-if="item.fieldType == '时间'"
                v-model="item.searchValKey"
                is-range
                value-format="HH:MM"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              />
            </div>
          </div>

          <div v-for="(item, i) in customSearchData" :key="i + 100">
            <div class="searchItem">
              <div v-if="item.fieldType == '级联'" class="searchTit">
                {{ item.fieldName }}
              </div>
              <ElCascader
                v-if="item.fieldType == '级联'"
                ref="cascader"
                v-model="item.searchValKey"
                placeholder="请选择/输入..."
                clearable
                filterable
                :options="item.cascOptions"
                :props="{ checkStrictly: true, children: 'children', value: 'id', label: 'name' }"
                @change="handleChangeBand"
              />
            </div>
          </div>
          <!-- 针对于商品列表页搜索框所独有搜索条件 -->
          <!-- <div class='searchItem' v-if='cmdVal==40001'>
            <div class="searchTit">所属系列波段</div>
            <el-cascader
              ref='cascader'
              v-model="idList"
              clearable
              :options="bandOptions"
              :props="{ children:'children',value:'id',label:'name'}"
              @change="handleChange"></el-cascader>
          </div> -->
        </div>
        <div class="searchBtnBox">
          <ElButton size="small" icon="el-icon-refresh" type="primary" @click="clickSearch">
            查询
          </ElButton>
          <ElButton size="small" icon="el-icon-close" type="info" @click="clearSearch">
            清空
          </ElButton>
        </div>
      </div>

      <div v-if="foldFlag" class="moreBtn" @click="clickMore">
        <i v-if="foldFlag" class="el-icon-caret-bottom" />
      </div>
      <div v-else class="newMoreBtn" @click="clickMore">
        <i class="el-icon-caret-top" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
 @deep:~">>>";
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
      z-index: 10;
      background-color: #fff;
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
        .searchItem{
          width:284px;
          height: 40px;
          margin:5px 0px;
          // margin-right:30px;
          overflow: hidden;
          display: flex;
          align-items: center;
          // background-color: pink;
          .searchTit{
            width:60px;
          }
          @{deep} .el-date-editor--daterange.el-input__inner{
            width:216px!important;
          }

          @{deep} .el-input {
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
</style>
