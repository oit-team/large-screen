<template>
  <el-container class = 'AuctionConfig'>
    <el-aside  width="240px" class="scrollbar">
      <div class="AuctionMenu">
        <div class="addMenu">
        <!--   <i @click="handleAddClick('menuDrawer')" class="el-icon-circle-plus"></i> -->
           <el-button
             size="mini"
             icon="el-icon-plus"
             @click="handleAddClick('menuDrawer')"
             circle>
           </el-button>
         </div>
         <span class="menuNull" v-if="menuList.length == 0">暂无数据</span>
        <el-button class="animate" @click="menuClick(item)" @contextmenu.prevent.native="rightClick('menuDrawer', item)" v-for="(item,index) in menuList" :key="item.id" :class="{'active': (item.id === activeMenu.id)}">
          <div class="left animate">
            <span>{{index+1}}</span>
          </div>
          <div class="center">
            <span class="animate">{{item.conferenceHallName}}</span>
            <span>{{$moment(item.startTime).format("HH:mm")+' - '+$moment(item.endTime).format("HH:mm")}}</span>
          </div>
          <div class="right">
            <span @click.stop.prevent>
              <el-switch
                :disabled="roomList.length == 0"
                active-color="#8d1323"
                inactive-color="#BFBFBF"
                @change='menuChange(item)'
                v-model="item.state == 0">
              </el-switch>
            </span>
          </div>
        </el-button>

      </div>
    </el-aside>
    <el-container id="Content">
      <div>
        <el-header height="auto" class='scrollbar' >
          <div class="AuctionMenu">
            <div class="roomNull" v-if="roomList.length == 0">
              <span>暂无数据</span>
            </div>
            <div v-for="item in roomList" :key="item.roomId">
              <el-button class="animate"  @click="roomClick(item)" @contextmenu.prevent.native="rightClick('areaDrawer', item)"  :class="{'active': (item.roomId === activeRoom.roomId)}">
                <span>{{item.roomName}}</span>
                <span @click.stop.prevent>
                  <el-switch
                    :disabled='inDuringDate'
                    active-color="#8d1323"
                    inactive-color="#BFBFBF"
                    @change='menuChange(item, 1)'
                    v-model="item.state == 0">
                  </el-switch>
                </span>
              </el-button>
            </div>
            <div>
              <el-button
                :disabled="inDuringDate"
                size="mini"
                type="danger"
                icon="el-icon-plus"
                @click="openDrawer('areaDrawer')"
                circle>
              </el-button>
            </div>
          </div>
        </el-header>
        <el-main  v-loading="loading">
          <div class="AuctionManage">
            <span>预约人数：{{relationInfo.appointedNum}}人</span>
            <span>抢购人数：{{relationInfo.auctionNum}}人</span>
            <span>水滴限制：<span style="color:#8d1323;cursor:pointer" @click="openRelationDrawer">{{relationInfo.integralLimit}}<i style="margin-left:4px;" class="el-icon-edit"></i></span></span>
            <span>能量值限制：<span style="color:#8d1323;cursor:pointer" @click="openRelationDrawer">{{relationInfo.byLimit}}<i style="margin-left:4px;" class="el-icon-edit"></i></span></span>
          </div>
          <div>
            <el-checkbox-group id="ImgList" class='scrollbar' v-model="checkList">
              <div v-for="item in goodsList" :key="item.goodsCode">
                <div class="imgBox">
                  <img :src="item.resUrl||item.mainImage[0].resUrl||''" alt="">
                </div>
                <el-checkbox :label="item.goodsCode"  @change="handleCheckedChange(item)">{{item.goodsName}}</el-checkbox>
              </div>
              <div class="addImg">
                <div :class="inDuringDate?'disabled':''" @click="openDrawer('goodsDrawer')">
                  <i class="el-icon-plus"></i>
                </div>
              </div>
            </el-checkbox-group>
          </div>
          <div class="Price">
            <div>
              <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="60px">
                <el-form-item label="起拍价" prop="biddingPrice">
                  <el-input v-model.number="ruleForm.biddingPrice" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-form-item>
                <el-form-item label="交割价" prop="transactionPrice">
                  <el-input v-model.number="ruleForm.transactionPrice" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                </el-form-item>
                <el-form-item label="溢价比" prop="premiumRatio">
                  <el-input v-model.number="ruleForm.premiumRatio" oninput="value=value.replace(/[^\d.]/g,'')">
                    <i slot="suffix">%</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="水滴比" prop="integralRatio">
                  <el-input v-model.number="ruleForm.integralRatio"  oninput="value=value.replace(/[^\d.]/g,'')">
                    <i slot="suffix">%</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="定金比" prop="depositRatio" >
                  <el-input v-model.number="ruleForm.depositRatio" oninput="value=value.replace(/[^\d.]/g,'')">
                    <i slot="suffix">%</i>
                  </el-input>
                </el-form-item>
              </el-form>
              <div class="btnBox">
                <el-button type="primary" :disabled="inDuringDate" @click='getCalculatePrice'>模拟生成</el-button>
                <el-button type="primary" :disabled="inDuringDate" @click='addGoodsAndPriceDetailed'>保存价格</el-button>
              </div>
            </div>
          </div>
          <div class="tableBox">
            <el-table
              :data="prices"
              border
              style="width: 100%">
              <el-table-column
                label="平台分润"
                align="center">
                <template slot-scope="scope">
                  <span>
                    {{scope.row.platformRevenue || scope.row.plaftormRevenum}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="deductPoints"
                label="扣水滴"
                align="center">
              </el-table-column>
              <el-table-column
                prop="deposit"
                label="应付定金"
                align="center">
              </el-table-column>
              <el-table-column
                prop="personalIncome"
                label="个人分润"
                align="center">
              </el-table-column>
              <el-table-column
                prop="biddingPrice"
                label="竞拍价"
                align="center">
              </el-table-column>
              <el-table-column
                prop="premiumPrice"
                label="总溢价"
                align="center">
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </div>
    </el-container>
    <vc-menudrawer
      ref="menuDrawer"
      @reloadManage="reloadManage"/>
    <vc-areadrawer
      ref="areaDrawer"
      @reloadManage="reloadManage"/>
    <vc-goodsdrawer
      ref="goodsDrawer"
      @addGoods="addGoods"/>
    <vc-relationdrawer
      ref="relationDrawer"
      @relationChange="relationChange"/>
    <el-dialog
      :title="drawerData.conferenceHallName || drawerData.roomName || 'test'"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>请选择您的操作</span>
      <el-dialog
        width="30%"
        title="提示"
        :visible.sync="innerVisible"
        center
        append-to-body>
        <span>确认删除</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteItem">确 认</el-button>
          <el-button type="primary" @click="closeDialog">取 消</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditClick">编 辑</el-button>
        <el-button type="primary" @click="innerVisible = true">删 除</el-button>
      </span>
    </el-dialog>
    <!-- <el-button @click="setgoodsManage">click me</el-button> -->
  </el-container>
</template>

<script>
import VcMenudrawer from '../../components/business/Auction/menuDrawer'
import VcAreadrawer from '../../components/business/Auction/areaDrawer'
import VcGoodsdrawer from '../../components/business/Auction/goodsDrawer'
import VcRelationdrawer from '../../components/business/Auction/relationDrawer'

export default {
  name: 'AuctionConfig',
  components: {
    VcMenudrawer,
    VcAreadrawer,
    VcGoodsdrawer,
    VcRelationdrawer,
  },
  props: {},
  data() {
    return {
      loading:false,
      relationInfo: {
        appointedNum: 0,
        auctionNum: 0,
        byLimit: 0,
        integralLimit: 0,
      },
      serialNum: '', //竞拍流水编号
      innerVisible: false,
      centerDialogVisible: false,
      isAdd: true,
      drawerName: '',
      drawerData: {},
      menuList: [],
      activeMenu: '',  //左侧菜单选中的信息
      activeRoom: '',  //房间选中信息
      roomList: [],
      prices: [],
      CalculatePrice: {},
      ruleForm: {
        biddingPrice: '',
        transactionPrice: '',
        premiumRatio: 6,
        depositRatio: 20,
        integralRatio: 60,
      },
      rules: {
        biddingPrice: [{ type: 'number', required: true, message: '输入起拍价(数字)', trigger: 'blur'},{validator: this.testValidator , trigger: 'blur'}],
        transactionPrice: [{ type: 'number', required: true, message: '输入交割价(数字)', trigger: 'blur'},{validator: this.testValidator , trigger: 'blur'}],
        premiumRatio: { type: 'number', required: true, message: '输入溢价比(数字)', trigger: 'blur'},
        depositRatio: { type: 'number', required: true, message: '输入水滴比(数字)', trigger: 'blur'},
        integralRatio: { type: 'number', required: true, message: '输入定金比(数字)', trigger: 'blur'},
      },
      goodsList: [],
      subGoodsList:[], //提交过的商品id
      value: true,
      checkList: [],
    }
  },
  created() {
  },
  mounted() {
    this.getConferenceHall()
  },
  activated() {},
  watch: {
    roomList(newVal ,oldVal) {
      if (newVal.length == 0 && this.activeMenu.state == 0) {
        const _this = this
        const con = {
          id: this.activeMenu.id,
          roomCode : this.activeMenu.roomCode,
          state: '1',
          conferenceCode: this.activeMenu.conferenceHallCode
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        this.$axios.post(_this.Api.updateConferenceHallState, jsonParam).then((res) => {
          if (res.data.head.status == 0) {
            _this.activeMenu.state = 1
            _this.$message({
              message: res.data.head.msg,
              type: 'success',
            })
          }
        }).catch(err => {
          _this.activeMenu.state = 0
          _this.$message({
            message: '失败',
            type: 'error',
          })
        })
      }
    }
  },
  computed: {
    // 判断当前时间是否在场次时间以内
    inDuringDate() {
      const curDate = new Date()
      const beginDate  = new Date(this.activeMenu.startTime)
      const endDate  = new Date(this.activeMenu.endTime)
      if (curDate >= beginDate && curDate <= endDate) {
        return true;
      }
      return false
    },
  },
  methods: {
    testValidator(rule,value,callback) {
      if(this.ruleForm.biddingPrice && this.ruleForm.transactionPrice && this.ruleForm.biddingPrice > this.ruleForm.transactionPrice) {
        return callback(new Error('起拍价应小于交割价'));
      } else {
        return callback();
      }
    },
    // 点击左侧菜单，增加选中状态
    menuClick(data) {
      this.activeMenu = data
      this.getRoomInfo()
    },
    roomClick(data) {
      this.activeRoom = data
      this.getAuctionRoomInfo()
    },
    handleEditClick() {
      this.isAdd = false
      this.closeDialog()
      this.openDrawer(this.drawerName, this.drawerData)
    },
    handleAddClick(data) {
      this.isAdd = true
      this.openDrawer(data)
    },
    closeDialog() {
      this.innerVisible = false;
      this.centerDialogVisible = false;
    },
    rightClick(clickName,data) {
      if (data.state == 0) {
        this.$message({
          message: '请关闭后再操作',
          type: 'warning',
        })
        return;
      }
      this.drawerData = data
      this.drawerName = clickName
      this.centerDialogVisible = true;
    },
    deleteItem() {
      const _this = this
      let PostApi = ''
      let menuList = [];
      let con = '';
      if (this.drawerName === 'menuDrawer') {
        PostApi = this.Api.delConferenceHallById
        menuList = this.menuList
      }else if (this.drawerName === 'areaDrawer') {
        PostApi = this.Api.delRoomInfo
      }
      con = {
        id: this.drawerData.id||this.drawerData.roomId,
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      this.$axios.post(PostApi, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (this.drawerName === 'menuDrawer') {
            _this.menuList = menuList.filter((item)=>{return item !== _this.drawerData})
            if(_this.drawerData == _this.activeMenu&&_this.menuList.length>0) {
              _this.menuClick(_this.menuList[0])
            }else if(_this.menuList.length == 0) {
              _this.menuClick('')
            }
          } else {
            _this.roomList = _this.roomList.filter((item)=>{return item !== _this.drawerData})
            if(_this.drawerData == _this.activeRoom&&_this.roomList.length>0) {
              _this.roomClick(_this.roomList[0])
            }else if(_this.roomList.length == 0) {
              _this.roomClick()
            }
          }

          _this.closeDialog()
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'error',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    openDrawer(Name, data) {
      if(Name === 'goodsDrawer') {
        if (this.inDuringDate) {
          return
        } else {
          this.$refs.goodsDrawer.handleOpen();
          this.$refs.goodsDrawer.loadManage();
        }
      }else {
        this.$refs[Name].handleOpen(data);
      }
    },
    openRelationDrawer() {
      const con = {
        conferenceCode:this.activeMenu.conferenceHallCode,
        roomCode:this.activeRoom.roomCode,
        integralLimit:this.relationInfo.integralLimit,
        byLimit:this.relationInfo.byLimit,
      }
      this.openDrawer('relationDrawer',con)
    },
    relationChange(res){
      this.relationInfo.integralLimit = res.integralLimit
      this.relationInfo.byLimit = res.byLimit
    },
    getRoomInfo() {
      const _this = this
      const con = {
        conferenceCode:_this.activeMenu.conferenceHallCode
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      this.$axios.post(this.Api.getRoomInfo, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (res.data.body.resultList.length > 0) {
            _this.roomList = res.data.body.resultList
            _this.activeRoom = res.data.body.resultList[0]
            _this.getAuctionRoomInfo()
          }
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getConferenceHall() {
      const _this = this
      const con = {
        conferenceHallName: '',
        startstartTime: '',
        endstartTime: '',
        startendTime: '',
        endendTime: '',
        pageNum: 1,
        pageSize: 99,
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      this.$axios.post(this.Api.getConferenceHall, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (res.data.body.resultList.length > 0) {
            _this.menuList = res.data.body.resultList
            if (_this.activeMenu  == '') {
              _this.activeMenu = res.data.body.resultList[0] //默认选中第一个菜单
              _this.getRoomInfo()
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    reloadManage(msg, data) {
      if (msg === 'menuDrawer') {
        if (data) {
          let MenuItem = this.menuList.filter((item)=>{return item.id === data.id})
          MenuItem[0].conferenceHallName = data.conferenceHallName
          MenuItem[0].startTime = data.startTime
          MenuItem[0].endTime = data.endTime
        } else {
          this.getConferenceHall()
        }
      } else if (msg = 'areaDrawer') {
        if (data) {
          let MenuItem = this.roomList.filter((item)=>{return item.roomId === data.id})
          MenuItem[0].roomName = data.roomName
          MenuItem[0].roomCode = data.roomCode
        } else {
          this.getRoomInfo()
        }
      }
    },
    menuChange(item , val) {
      // val == 1 判定为房间列表
      let swtichStr = ''
      let str = ''
      if(item.state == 0) {
        swtichStr = '关闭'
      } else if (item.state == 1){
        swtichStr = '开启'
      }
      if (val == 1 && this.relationInfo.integralLimit == 0&& this.relationInfo.byLimit == 0) {
        str = '当前能量值和水滴为0，'
      }
      this.$confirm(`${str}确认要在app里${swtichStr}预约竞拍吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postApi = ''
        if (val === 1) {
          postApi = this.Api.updateRoomState
        }else {
          postApi = this.Api.updateConferenceHallState
        }
        const _this = this
        const con = {
          id: item.id,
          roomCode : item.roomCode,
          state: item.state==0 ? '1':'0',
          conferenceCode: this.activeMenu.conferenceHallCode
        }
        item.state = item.state == 0 ? '1':'0'
        const jsonParam = _this.GLOBAL.paramJson(con)
        this.$axios.post(postApi, jsonParam).then((res) => {
          if (res.data.head.status !== 0) {
            item.state = item.state == 0 ? '1':'0'
            _this.$message({
              message: res.data.head.msg,
              type: 'error',
            })
          } else {
            _this.$message({
              message: res.data.head.msg,
              type: 'success',
            })
          }
        }).catch(err => {
          item.state = !item.state
          _this.$message({
            message: '失败',
            type: 'error',
          })
        })
      }).catch(() => {

      })
    },
    getCalculatePrice (){
      this.$refs.ruleForm.validate((valid) => {
        if(valid) {
          if(this.checkList.length == 0){
            _this.$message({
              message: '请勾选商品',
              type: 'warning',
            })
            return
          }
          const _this = this
          this.CalculatePrice = JSON.parse(JSON.stringify(this.ruleForm)) //复制一份请求的起拍价等信息
          const con = this.CalculatePrice
          const jsonParam = _this.GLOBAL.paramJson(con)
          this.$axios.post(this.Api.getCalculatePrice, jsonParam).then((res) => {
            if (res.data.head.status === 0) {
              _this.prices = res.data.body.result
              _this.CalculatePrice.prices = _this.prices
              _this.setgoodsManage(_this.CalculatePrice)
            }else {
              _this.$message({
                message: res.data.head.msg,
                type: 'error',
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },

    addGoodsAndPriceDetailed() {
      const _this = this
      if (_this.checkList.length == 0) {
        _this.$message({
          message: '请选择商品',
          type: 'warning',
        })
        return
      }
      this.$confirm('请确认保存价格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        console.log(this.checkList)
        console.log(this.subGoodsList)
        const noSub = this.checkList.filter(item => this.subGoodsList.indexOf(item.goodsCode) == -1)
        console.log(noSub)
        debugger;
        return;
        let goods = this.goodsList.filter(item => this.checkList.indexOf(item.goodsCode) != -1)
        let goodsList = [];
        goods.forEach((item,i) => {
          goodsList.push({
            goodsCode:item.goodsCode,
            biddingPrice:item.startingPrice,
            transactionPrice:item.transactionPrice,
            premiumRatio:item.premiumRatio,
            depositRatio:item.depositRatio,
            integralRatio:item.integralProportion,
            prices:item.price
          })
        })
        const con = {
          conferenceCode: this.activeMenu.conferenceHallCode,
          roomCode: this.activeRoom.roomCode,
          serialNum: this.serialNum,
          goodsList:goodsList,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        this.$axios.post(this.Api.addGoodsAndPriceDetailed, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.$message({
              message: res.data.head.msg,
              type: 'success',
            })
            _this.getAuctionRoomInfo()
          }else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }

        }).catch(err => {
          console.log(err)
        })
      }).catch(()=>{

      })
    },
    setgoodsManage(con){
      let goodslist = this.goodsList.filter(item => this.checkList.indexOf(item.goodsCode) != -1)
      const _this = this
      goodslist.forEach(function(item){
        _this.subGoodsList.push(item.goodsCode)
        item.price = con.prices
        item.startingPrice = con.biddingPrice
        item.transactionPrice = con.transactionPrice
        item.premiumRatio = con.premiumRatio
        item.integralProportion = con.integralRatio
        item.depositRatio = con.depositRatio
      })
    },
    getAuctionRoomInfo() {
      const _this = this
      this.loading = true
      const con = {
        conferenceHallCode: this.activeMenu.conferenceHallCode,
        roomCode: this.activeRoom.roomCode,
      }
      // 每次更新商品列表前，清空下面表格
      this.prices = []
      this.$refs.ruleForm.resetFields()
      this.goodsList = []
      this.checkList = []
      _this.relationInfo.appointedNum = 0
      _this.relationInfo.auctionNum = 0
      _this.relationInfo.byLimit = 0
      _this.relationInfo.integralLimit = 0
      const jsonParam = _this.GLOBAL.paramJson(con)
      this.$axios.post(this.Api.getAuctionRoomInfo, jsonParam).then((res) => {
        if (res.data.head.status === 0&&res.data.body) {
          if(res.data.body.auctionGoodsInfo || res.data.body.auctionGoodsInfo.length != 0) {
            _this.goodsList = res.data.body.auctionGoodsInfo
            console.log(_this.goodsList)
          }
          _this.serialNum = res.data.body.serialNum
          _this.relationInfo.appointedNum = res.data.body.appointedNum
          _this.relationInfo.auctionNum = res.data.body.auctionNum
          _this.relationInfo.byLimit = res.data.body.byLimit
          _this.relationInfo.integralLimit = res.data.body.integralLimit
        }  else if(res.data.head.status !== 0) {
          _this.$message({
            message: `res.data.head.msg`,
            type: 'error',
          })
        }
        setTimeout(()=>{this.loading = false}, 500)
      }).catch(err => {
        setTimeout(()=>{this.loading = false}, 500)
        console.log(err)
      })
    },
    addGoods(data) {
      const newGoods = data.filter((item)=> !this.goodsList.some((item2) => item2.goodsCode == item.goodsCode))
      this.goodsList.push(...newGoods)
      if(newGoods.length != data.length) {
        this.$message({
          message: `成功添加${newGoods.length}条，有${data.length - newGoods.length}条重复数据`,
          type: 'warning',
        })
      } else {
        this.$message({
          message: `成功添加${newGoods.length}条`,
          type: 'success',
        })
      }
    },
    handleCheckedChange(item) {
      if (this.checkList.length == 1) {
        const goodsInfo = this.goodsList.find(item => this.checkList.indexOf(item.goodsCode) != -1)
        if(goodsInfo.price instanceof Array) {
          this.ruleForm.biddingPrice = goodsInfo.startingPrice
          this.ruleForm.transactionPrice = goodsInfo.transactionPrice
          this.ruleForm.premiumRatio = goodsInfo.premiumRatio
          this.ruleForm.depositRatio = goodsInfo.depositRatio
          this.ruleForm.integralRatio = goodsInfo.integralProportion
          this.CalculatePrice = JSON.parse(JSON.stringify(this.ruleForm))
          this.prices = goodsInfo.price
        }
      } else{
        this.prices = [];
        this.$refs.ruleForm.resetFields();
      }

    }
  },
}
</script>
<style lang="scss" scoped>
    .el-header{
      background:#fff;
      height: auto;
      max-height: 120px;
      padding:10px 10px;
      overflow: auto;
      li{
        margin-right:20px;
        float:left;
        >span{
          margin-right:6px;
        }
        .el-switch{
          position:relative!important;
          top:-1px!important;
          right:0px!important;
        }
      }
    }
    .el-aside {
      background: #fff;
      direction: rtl;
      position: absolute;
      height: calc(100% - 60px);
      .AuctionMenu{
        direction: ltr;
        padding-bottom: 50px;
        .menuNull{
          text-align: center;
          font-size:16px;
          color:#BFBFBF;
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left:-32px;
        }
        >div:last-child{
          float: unset;
          margin: 0 auto;
        }

        >.el-button{
          width:100%;
          margin-left:0px;
          font-size: 16px;
          padding:14px 6px;
          border:0px;
          border-radius: 0px;
          color: #635a5a;
          ::v-deep >span{
            display: flex;
            justify-content: center;
            align-items: center;
          };
          .left{
            width:20px;
            float:left;
            height:20px;
            line-height: 20px;
            border-radius: 50%;;
            background: #BFBFBF;
            color:#fff;
            font-size:12px;
          }
          .right{
            width: 50px;
            float:right;
          }
          .center{
            width:calc(100% - 80px);
            display: inline-block;
            >span{
              display: block;
            }
            >span:nth-child(1){
              font-size:18px;
            }
            >span:nth-child(2){
              font-size:14px;
              margin-top:6px;
            }
          }
        }
        >.el-button:hover{
          background:#F7F7F7;
          .center{
            >span:nth-child(1){
              color:#000;
            }
          }
        }
        >.el-button.active{
          background:#F7F7F7;
          .left{
            background:#8d1323;
          }
          .center{
            >span:nth-child(1){
              color:#000;
            }
          }
        }
        .addMenu{
          border-bottom:1px solid #ececec;
          padding:10px 0;
          text-align: center;
          margin-top: 0!important;
          .el-button{
            border:1px solid #635a5a;
            color:#635a5a;
            padding:4px;
            font-size:16px;
          }
          .el-button:hover{
            border:1px solid #635a5a;
            color:#635a5a;
            background:#fff;
          }
        }
      }
    }
    ::v-deep .el-main {
      background:#fff;
      text-align: center;
      padding:0px 10px 10px!important;
      .AuctionManage{
        float: left;
        margin-left:4px;
        margin-bottom:20px;
        >span{
          margin-right:18px;
          color:#606266;
          font-size: 14px;
        }
        .el-form{
          display: inline-block;
          .el-form-item{
            display: inline-block;
            width: 152px;
            margin-right:18px;
            margin-bottom:0px;
          }
          .el-form-item__label{
            padding:0 4px 0 0;
          }
        }
      }
      .Price{
        margin-top: 20px;
        .el-form-item{
          display:inline-block;
          width:152px;
        }
        .el-form{
          display: inline-block;
          float: left;
        }
        .el-form-item__label{
          padding:0 6px 0 0;
        }
        .btnBox{
          width:224px;
          overflow:hidden;
          padding-left:18px;
          padding-bottom: 20px;
          .el-button{
            background:#8d1323;
            border:1px solid #8d1323;
          }
        }
      }
    }

    body > .el-container {
      margin-bottom: 40px;
    }
    #Content{
      background:#F7F7F7;
      padding:10px 10px 10px 250px;
      display:inline-block!important;
      >div{
        border:1px solid #efefef;
      }
      .AuctionMenu{
        .roomNull{
          color:#BFBFBF;
          font-size:16px;
          heihgt:50px;
          line-height: 50px;
        }
        .roomNull::after{
          border-right:0px solid #BFBFBF!important;
        }
        padding:6px 12px 0;
        overflow:hidden;
        line-height: 56px;
        margin-bottom: 0px;
        .active{
          span{
            color: #8d1323;
          }
        }
        >div:not(:last-child){
          overflow:hidden;
          display: inline-block;
          float: left;
          padding:0 16px;
          position:relative;
        }
        >div:not(:last-child)::after{
          content:'';
          display: inline-block;
          border-right:1px solid #BFBFBF;
          height:20px;
          position:absolute;
          right:0px;
          top:50%;
          margin-top:-14px;
        }
        >div:last-child{
          text-align: center;
          float: left;
          width: 130px;
          margin-left:12px;
          overflow: hidden;;
          display: flex;
          justify-content: center;
          .el-button{
            border:1px solid #635a5a;
            display: flex;
            justify-content: center;
            align-items: center;
            width:26px;
            height:26px;
            font-weight: bolder;
            padding:6px;
            font-size:16px;
            margin-top:6px;
          }
        }
        .el-button{
          color: #635a5a;
          position:relative;
          list-style: none;
          border:#fff;
          background:  #fff;
          line-height: 26px;
          padding:8px 60px 8px 10px;
          text-align: center;
          float: left;
          width:130px;
          span{
            display: inline-block;
            width:70px;
            overflow:hidden;
            text-align: center;
            text-overflow:ellipsis;
          }
          .el-switch{
            position:absolute;
            top:10px;
            right:6px;
          }
          >div{
            font-size:18px;
            >span{
              font-size:16px;
            }
          }
        }
      }
    }
    #ImgList{
      border: 2px solid #efefef;
      width: 100%;
      max-height: 460px;
      overflow: auto;
      >div{
        float: left;
        margin:20px 22px;
      }
      .imgBox{
        width: 150px;
        border:1px solid #ccc;
        height:170px;
        margin-bottom:5px;
        display: flex;
        justify-content: center;
        align-items: center;
        >img{
          max-width: 100%;
          max-height: 100%;
        }
      }
      >div.addImg{
        width:150px;
        height:194px;
        display: flex;
        justify-content: center;
        >div{
          cursor: pointer;
          margin-top: 45px;
          border:2px solid #ebeef5;
          width:80px;
          height:80px;
          display: flex;
          justify-content: center;
          align-items: center;
          >i{
            color:#ebeef5;
            font-size:56px;
          }
        }
      }
    }
    ::v-deep .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before{
      content:''!important;
    }
    .disabled{
      cursor: not-allowed!important;
    }
    .el-button:focus{
      background-color:#fff;
    }
    .el-switch.is-disabled{
      opacity: 0.3
    }
</style>
<style>
  #elMain{
    padding:0px;
  }

</style>
