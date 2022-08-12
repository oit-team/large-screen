<template>
  <el-container class="AuctionConfig">
    <el-aside width="240px" class="scrollbar">
      <div class="AuctionMenu">
        <div class="addMenu">
          <!--   <i @click="handleAddClick('menuDrawer')" class="el-icon-circle-plus"></i> -->
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="handleAddClick('menuDrawer')"
          >
            添加
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-setting"
            @click="couponDrawer = true"
          >
            券配置
          </el-button>
        </div>
        <span v-if="menuList.length == 0" class="menuNull">暂无数据</span>
        <el-button
          v-for="(item, index) in menuList"
          :key="item.id"
          class="animate"
          :class="{ active: (item.id === activeMenu.id) }"
          @click="menuClick(item)"
          @contextmenu.prevent.native="rightClick('menuDrawer', item)"
        >
          <div class="left animate">
            <span>{{ index + 1 }}</span>
          </div>
          <div class="center">
            <span class="animate">{{ item.conferenceHallName }}</span>
            <span>{{ `${$moment(item.startTime).format("HH:mm")} - ${$moment(item.endTime).format("HH:mm")}` }}</span>
          </div>
          <div class="right">
            <span @click.stop.prevent>
              <el-switch
                :value="item.state == 0"
                :disabled="roomList.length == 0"
                active-color="#8d1323"
                inactive-color="#BFBFBF"
                @change="menuChange(item)"
              >
              </el-switch>
            </span>
          </div>
        </el-button>
      </div>
    </el-aside>
    <el-container id="Content">
      <div id="roomBox" class="scrollbar" style="height: 48px;background:#fff;border:0px;line-height: 28px;padding:10px;overflow:auto">
        <el-checkbox-group v-model="roomCheckList">
          <el-checkbox v-for="(item) in roomList" :key="item.roomCode" :label="item.roomCode" @contextmenu.prevent.native="rightClick('areaDrawer', item)" @change="checked => roomCheckListChange(checked, item)">
            {{ item.roomName }}
          </el-checkbox>
          <div class="addBtn">
            <el-button
              :disabled="inDuringDate"
              size="mini"
              type="danger"
              icon="el-icon-plus"
              circle
              @click="openDrawer('areaDrawer')"
            >
            </el-button>
          </div>
        </el-checkbox-group>
      </div>
      <div>
        <el-header height="auto" class="scrollbar">
          <div class="AuctionMenu">
            <div v-if="associatedRoom.length == 0" class="roomNull">
              <span>暂无数据</span>
            </div>
            <div v-for="item in associatedRoom" :key="item.roomId">
              <el-button class="animate" :class="{ active: (item.roomId === activeRoom.roomId) }" @click="roomClick(item)">
                <span>{{ item.roomName }}</span>
                <span @click.stop.prevent>
                  <el-switch
                    :value="item.state == 0"
                    :disabled="inDuringDate"
                    active-color="#8d1323"
                    inactive-color="#BFBFBF"
                    @change="menuChange(item, 1)"
                  >
                  </el-switch>
                </span>
              </el-button>
            </div>
          </div>
        </el-header>
        <el-main v-loading="loading">
          <div class="AuctionManage">
            <span>预约人数（有券）：{{ relationInfo.haveTicketAppointedNum || 0 }}人</span>
            <span>预约人数（无券）：{{ relationInfo.noTicketAppointedNum || 0 }}人</span>
            <span>抢购人数：{{ relationInfo.auctionNum }}人</span>
            <span>水滴限制：<span style="color:#8d1323;cursor:pointer" @click="openRelationDrawer">{{ relationInfo.integralLimit }}<i style="margin-left:4px;" class="el-icon-edit"></i></span></span>
            <span>能量值限制：<span style="color:#8d1323;cursor:pointer" @click="openRelationDrawer">{{ relationInfo.byLimit }}<i style="margin-left:4px;" class="el-icon-edit"></i></span></span>
          </div>
          <div>
            <el-checkbox-group id="ImgList" v-model="checkList" class="scrollbar">
              <div v-for="item in goodsList" :key="item.goodsCode">
                <span class="deleteBox">
                  <el-tooltip class="item" effect="dark" content="复制价格" placement="top">
                    <i class="el-icon-document-copy" style="color: #e6a23c;" @click="ClickCopy(item)"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i class="el-icon-delete" style="color:#8d1323" @click="deleteGoods(item)"></i>
                  </el-tooltip>
                </span>
                <div class="imgBox">
                  <img v-if="item.resUrl" :src="item.resUrl || item.mainImage[0].resUrl" alt="">
                  <img v-else-if="item.mainImage && item.mainImage.length > 0" :src="item.resUrl || item.mainImage[0].resUrl" alt="">
                  <span v-else>暂无图片</span>
                </div>
                <el-checkbox :label="item.goodsCode" @change="handleCheckedChange()">
                  {{ item.goodsName }}
                </el-checkbox>
              </div>
              <div class="addImg">
                <div :class="inDuringDate || associatedRoom.length == 0 ? 'disabled' : ''" @click="openDrawer('goodsDrawer')">
                  <i class="el-icon-plus"></i>
                </div>
              </div>
            </el-checkbox-group>
          </div>
          <div class="Price">
            <div>
              <el-form ref="ruleForm" class="PriceFrom" :rules="rules" :model="ruleForm" label-width="76px">
                <el-form-item label="起拍价" prop="biddingPrice">
                  <el-input v-model="ruleForm.biddingPrice" oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')">
                    <i slot="suffix">元</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="交割价" prop="transactionPrice">
                  <el-input v-model="ruleForm.transactionPrice" oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')">
                    <i slot="suffix">元</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="起始定金" prop="depositPrice">
                  <el-input v-model="ruleForm.depositPrice" oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')">
                    <i slot="suffix">元</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="溢价比" prop="premiumRatio">
                  <el-input v-model="ruleForm.premiumRatio" oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')">
                    <i slot="suffix">%</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="水滴比" prop="integralRatio">
                  <el-input v-model="ruleForm.integralRatio" oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')">
                    <i slot="suffix">%</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="定金比" prop="depositRatio">
                  <el-input v-model="ruleForm.depositRatio" oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')">
                  </el-input>
                </el-form-item>
                <el-form-item label="个人收益" prop="profitRatio">
                  <el-input v-model="ruleForm.profitRatio" oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')">
                    <i slot="suffix">%</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="平台收益" prop="platformRatio">
                  <el-input v-model="ruleForm.platformRatio" oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')">
                    <i slot="suffix">%</i>
                  </el-input>
                </el-form-item>
                <el-button type="primary" :disabled="inDuringDate || associatedRoom.length == 0" @click="getCalculatePrice">
                  模拟生成
                </el-button>
                <el-button type="primary" :disabled="inDuringDate || associatedRoom.length == 0" @click="addGoodsAndPriceDetailed">
                  保存价格
                </el-button>
              </el-form>
              <!--              <div class="btnBox">
                <el-button type="primary" :disabled="inDuringDate" @click='getCalculatePrice'>模拟生成</el-button>
                <el-button type="primary" :disabled="inDuringDate" @click='addGoodsAndPriceDetailed'>保存价格</el-button>
              </div> -->
            </div>
          </div>
          <div class="tableBox">
            <el-table
              ref="priceRef"
              :data="prices"
              border
              :row-class-name="rowClass"
              highlight-current-row
              style="width: 100%"
              @select="handleSelect"
              @select-all="handleALL"
            >
              <el-table-column
                type="selection"
                width="55"
              >
              </el-table-column>
              <el-table-column
                label="序号"
                width="55"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="平台分润"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    :ref="`platformRevenue${scope.$index}`"
                    v-model="scope.row.platformRevenue"
                    oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                    placeholder="平台分润"
                    @blur="checkNull(scope.row, scope.$index, 'platformRevenue', '平台分润')"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="扣除水滴"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    :ref="`deductPoints${scope.$index}`"
                    v-model="scope.row.deductPoints"
                    oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                    placeholder="扣除水滴"
                    @blur="checkNull(scope.row, scope.$index, 'deductPoints', '扣除水滴')"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="应付定金"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    :ref="`deposit${scope.$index}`"
                    v-model="scope.row.deposit"
                    oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                    placeholder="应付定金"
                    @blur="checkNull(scope.row, scope.$index, 'deposit', '应付定金')"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="个人分润"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    :ref="`personalIncome${scope.$index}`"
                    v-model="scope.row.personalIncome"
                    oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                    placeholder="个人分润"
                    @blur="checkNull(scope.row, scope.$index, 'personalIncome', '个人分润')"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="竞拍价"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    :ref="`biddingPriceInput${scope.$index}`"
                    v-model="scope.row.biddingPrice"
                    oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                    placeholder="竞拍价"
                    @blur="checkNull(scope.row, scope.$index, 'biddingPrice', '竞拍价')"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="溢价"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    :ref="`premiumPrice${scope.$index}`"
                    v-model="scope.row.premiumPrice"
                    oninput="value=value.replace(/[^\d\.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')"
                    placeholder="溢价"
                    @blur="checkNull(scope.row, scope.$index, 'premiumPrice', '溢价')"
                  >
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </div>
    </el-container>
    <VcMenudrawer
      ref="menuDrawer"
      @reloadManage="reloadManage"
    />
    <VcAreadrawer
      ref="areaDrawer"
      @reloadManage="reloadManage"
    />
    <VcGoodsdrawer
      ref="goodsDrawer"
      @addGoods="addGoods"
    />
    <VcRelationdrawer
      ref="relationDrawer"
      @relationChange="relationChange"
    />
    <VcCopyprice
      ref="copyPrice"
      @CopyGoodsPrice="CopyGoodsPrice"
    />
    <VcCopyhistory
      ref="copyhistory"
      @CopyHistory="CopyHistory"
    />
    <el-dialog
      :title="drawerData.conferenceHallName || drawerData.roomName || 'test'"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>请选择您的操作</span>
      <el-dialog
        width="30%"
        title="提示"
        :visible.sync="innerVisible"
        center
        append-to-body
      >
        <span>确认删除</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteItem">确 认</el-button>
          <el-button type="primary" @click="closeDialog">取 消</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditClick">编 辑</el-button>
        <el-button type="success" @click="handleCopyHistory">复 制</el-button>
        <el-button type="primary" @click="innerVisible = true">删 除</el-button>
      </span>
    </el-dialog>
    <el-drawer :visible.sync="couponDrawer" title="竞拍券配置">
      <el-form class="px-6" label-width="7rem" :model="form">
        <el-form-item label="所需水滴">
          <el-input v-model="form.auctionTicket" type="number"></el-input>
        </el-form-item>
        <el-form-item label="有效天数">
          <el-input v-model="form.validDays" type="number"></el-input>
        </el-form-item>
        <el-form-item label="兑换比例">
          <el-input v-model="form.integral" type="number">
            <template slot="append">
              %
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="可使用次数">
          <el-input v-model="form.usedTime" type="number"></el-input>
        </el-form-item>
        <div>
          <el-button class="w-full" type="primary" @click="saveCouponConfig">
            保存
          </el-button>
        </div>
      </el-form>
    </el-drawer>
    <!-- <el-button @click="setgoodsManage">click me</el-button> -->
  </el-container>
</template>

<script>
import VcMenudrawer from '../../components/business/Auction/menuDrawer'
import VcAreadrawer from '../../components/business/Auction/areaDrawer'
import VcGoodsdrawer from '../../components/business/Auction/goodsDrawer'
import VcRelationdrawer from '../../components/business/Auction/relationDrawer'
import VcCopyprice from '../../components/business/Auction/copyPrice'
import VcCopyhistory from '../../components/business/Auction/copyHistory'

export default {
  name: 'AuctionConfig',
  components: {
    VcMenudrawer,
    VcAreadrawer,
    VcGoodsdrawer,
    VcRelationdrawer,
    VcCopyprice,
    VcCopyhistory,
  },
  props: {},
  data() {
    return {
      form: {
        auctionTicket: '',
        validDays: '',
        integral: '',
        usedTime: '',
      },
      roomCheckList: [],
      loading: false,
      relationInfo: {
        appointedNum: 0,
        auctionNum: 0,
        byLimit: 0,
        integralLimit: 0,
      },
      serialNum: '', // 竞拍流水编号
      innerVisible: false,
      centerDialogVisible: false,
      isAdd: true,
      drawerName: '',
      drawerData: {},
      menuList: [],
      activeMenu: '', // 左侧菜单选中的信息
      activeRoom: '', // 房间选中信息
      roomList: [],
      associatedRoom: [],
      prices: [],
      CalculatePrice: {},
      ruleForm: {
        biddingPrice: 5000,
        transactionPrice: 10000,
        premiumRatio: 6,
        integralRatio: 30,
        depositRatio: 1.1665,
        depositPrice: 300,
        profitRatio: 1,
        platformRatio: 43,
      },
      rules: {
        biddingPrice: [{ required: true, message: '输入起拍价(数字)', trigger: 'blur' }, { validator: this.testValidator, trigger: 'blur' }],
        transactionPrice: [{ required: true, message: '输入交割价(数字)', trigger: 'blur' }, { validator: this.testValidator, trigger: 'blur' }],
        premiumRatio: { required: true, message: '输入溢价比(数字)', trigger: 'blur' },
        integralRatio: { required: true, message: '输入水滴比(数字)', trigger: 'blur' },
        depositRatio: { required: true, message: '输入定金比(数字)', trigger: 'blur' },
        depositPrice: { required: true, message: '输入定金(数字)', trigger: 'blur' },
        profitRatio: { required: true, message: '输入个人收益(数字)', trigger: 'blur' },
        platformRatio: { required: true, message: '输入平台收益(数字)', trigger: 'blur' },
      },
      goodsList: [],
      subGoodsList: [],
      value: true,
      checkList: [],
      selectID: [],
      couponDrawer: false,
    }
  },
  computed: {
    // 判断当前时间是否在场次时间以内
    inDuringDate() {
      const curDate = new Date()
      const beginDate = new Date(this.activeMenu.startTime)
      const endDate = new Date(this.activeMenu.endTime)
      if (curDate >= beginDate && curDate <= endDate) {
        return true
      }
      return false
    },
  },
  watch: {
    couponDrawer() {
      this.couponDrawer && this.getAuctionTicketConfig()
    },
    roomList(newVal, oldVal) {
      if (newVal.length == 0 && this.activeMenu.state == 0) {
        const _this = this
        const con = {
          id: this.activeMenu.id,
          roomCode: this.activeMenu.roomCode,
          state: '1',
          conferenceCode: this.activeMenu.conferenceHallCode,
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
        }).catch((err) => {
          _this.activeMenu.state = 0
          _this.$message({
            message: '失败',
            type: 'error',
          })
        })
      }
    },
  },
  created() {
  },
  mounted() {
    this.getConferenceHall()
  },
  activated() {},
  methods: {
    saveCouponConfig() {
      this.$axios
        .post(this.Api.setAuctionTicketConfig, this.GLOBAL.paramJson(this.form))
        .then((res) => {
          if (res.data.head.status !== 0) return Promise.reject(res)
          this.$message.success('修改成功')
          this.couponDrawer = false
        })
        .catch((err) => {
          this.$message.error(err.data.head.msg ?? '修改失败')
        })
    },
    getAuctionTicketConfig() {
      this.$axios
        .post(this.Api.getAuctionTicketConfig, this.GLOBAL.paramJson())
        .then((res) => {
          this.form = res.data.body
        })
    },
    handleALL(val) {
      this.handleSelect(val)
    },
    /*  获取当前选中的数据 */
    handleSelect(row) {
      this.selectID = []
      if (row.length > 0) {
        row.forEach((value, index) => {
          this.selectID.push(value.sortNum)
        })
      }
    },
    rowClass({ row, rowIndex }) {
      if (this.selectID.includes(row.sortNum)) {
        return 'activeRow'
      }
    },
    checkNull(res, index, refName, message) {
      if (!res[refName]) {
        this.$refs[refName + index].$el.querySelector('input').focus()
        this.$message({
          message: `${message}不能为空`,
          type: 'warning',
        })
      }
    },
    testValidator(rule, value, callback) {
      if (this.ruleForm.biddingPrice && this.ruleForm.transactionPrice && Number(this.ruleForm.biddingPrice) > Number(this.ruleForm.transactionPrice)) {
        return callback(new Error('起拍价应小于交割价'))
      } else {
        return callback()
      }
    },
    // 点击左侧菜单，增加选中状态
    menuClick(data) {
      this.activeMenu = data
      if (data == '') {
        this.roomList = []
        this.activeRoom = ''
        this.associatedRoom = []
        this.clearData()
      } else {
        this.getRoomInfo()
      }
    },
    roomClick(data) {
      this.activeRoom = data
      if (data == '') {
        // this.roomList = [];
        this.activeRoom = ''
        this.clearData()
      } else {
        this.getAuctionRoomInfo()
      }
    },
    clearData() {
      this.prices = []
      this.$refs.ruleForm.resetFields()
      this.goodsList = []
      this.checkList = []
      this.relationInfo.appointedNum = 0
      this.relationInfo.auctionNum = 0
      this.relationInfo.byLimit = 0
      this.relationInfo.integralLimit = 0
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
      this.innerVisible = false
      this.centerDialogVisible = false
    },
    rightClick(clickName, data) {
      if (data.state == 0) {
        this.$message({
          message: '请关闭后再操作',
          type: 'warning',
        })
        return
      }
      this.drawerData = data
      this.drawerName = clickName
      this.centerDialogVisible = true
    },
    deleteItem() {
      const _this = this
      let PostApi = ''
      let menuList = []
      let con = ''
      if (this.drawerName === 'menuDrawer') {
        PostApi = this.Api.delConferenceHallById
        menuList = this.menuList
      } else if (this.drawerName === 'areaDrawer') {
        PostApi = this.Api.delRoomInfo
      }
      con = {
        id: this.drawerData.id || this.drawerData.roomId,
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      this.$axios.post(PostApi, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (this.drawerName === 'menuDrawer') {
            _this.menuList = menuList.filter((item) => { return item !== _this.drawerData })
            if (_this.drawerData == _this.activeMenu && _this.menuList.length > 0) {
              _this.menuClick(_this.menuList[0])
            } else if (_this.menuList.length == 0) {
              _this.menuClick('')
            }
          } else {
            _this.roomList = _this.roomList.filter((item) => { return item !== _this.drawerData })
            if (_this.drawerData == _this.activeRoom && _this.roomList.length > 0) {
              _this.roomClick(_this.roomList[0])
            } else if (_this.roomList.length == 0) {
              _this.roomClick('')
            }
          }

          _this.closeDialog()
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'error',
          })
        }
      }).catch((err) => {})
    },
    openDrawer(Name, data) {
      if (Name === 'goodsDrawer') {
        if (!(this.inDuringDate || this.associatedRoom.length == 0)) {
          this.$refs.goodsDrawer.handleOpen()
          this.$refs.goodsDrawer.loadManage()
        }
      } else {
        this.$refs[Name].handleOpen(data)
      }
    },
    openRelationDrawer() {
      if (this.inDuringDate || this.associatedRoom.length == 0) {
        return
      }
      const con = {
        conferenceCode: this.activeMenu.conferenceHallCode,
        roomCode: this.activeRoom.roomCode,
        integralLimit: this.relationInfo.integralLimit,
        byLimit: this.relationInfo.byLimit,
      }
      this.openDrawer('relationDrawer', con)
    },
    relationChange(res) {
      this.relationInfo.integralLimit = res.integralLimit
      this.relationInfo.byLimit = res.byLimit
    },
    getRoomInfo(type) {
      // type == 1 不改变 activeRoom 不重新加载数据
      const _this = this
      const con = {
        conferenceCode: _this.activeMenu.conferenceHallCode,
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      this.$axios.post(this.Api.getRoomInfo, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (res.data.body.roomList.length > 0) {
            _this.roomList = res.data.body.roomList
          }
          if (res.data.body.associatedRoom.length > 0) {
            _this.associatedRoom = res.data.body.associatedRoom
            const curActive = _this.associatedRoom.find(curActiveItem => curActiveItem.roomCode == _this.activeRoom.roomCode)
            if (curActive && type == 1) {
              _this.activeRoom = curActive
            } else {
              _this.activeRoom = res.data.body.associatedRoom[0]
              _this.getAuctionRoomInfo()
            }
            const roomCheckList = []
            _this.associatedRoom.forEach((item) => {
              roomCheckList.push(item.roomCode)
            })
            _this.roomCheckList = roomCheckList
          } else {
            _this.associatedRoom = []
            _this.roomCheckList = []
            _this.activeRoom = ''
            _this.clearData()
          }
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
      })
    },
    getConferenceHall(loadRoomInfo) {
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
            if (_this.activeMenu == '') {
              _this.activeMenu = res.data.body.resultList[0] // 默认选中第一个菜单
              _this.getRoomInfo()
            } else if (loadRoomInfo == 'loadRoomInfo') {
              _this.getRoomInfo()
            }
          }
        }
      }).catch((err) => {
      })
    },
    reloadManage(msg, data) {
      if (msg === 'menuDrawer') {
        if (data) {
          const MenuItem = this.menuList.filter((item) => { return item.id === data.id })
          MenuItem[0].conferenceHallName = data.conferenceHallName
          MenuItem[0].startTime = data.startTime
          MenuItem[0].endTime = data.endTime
        } else {
          this.getConferenceHall()
        }
      } else if (msg === 'areaDrawer') {
        if (data) {
          const MenuItem = this.roomList.filter((item) => { return item.roomId === data.id })
          const associatedRoomItem = this.associatedRoom.find(item => item.roomId == data.id)
          if (associatedRoomItem) {
            associatedRoomItem.roomName = data.roomName
          }
          MenuItem[0].roomName = data.roomName
        } else {
          this.getRoomInfo(1)
        }
      }
    },
    ClickCopy(data) {
      this.$refs.copyPrice.handleOpen(data, this.goodsList)
    },
    CopyGoodsPrice(data) {
      const goods = this.goodsList.find(item => item.goodsCode == data.goodsCode)
      goods.price = data.price
      goods.startingPrice = data.startingPrice
      goods.transactionPrice = data.transactionPrice
      goods.premiumRatio = data.premiumRatio
      goods.integralRatio = data.integralRatio
      // goods.integralProportion  = data.integralProportion
      goods.depositRatio = data.depositRatio
      // goods.depositPrice  = data.depositPrice
      // goods.profitRatio  = data.profitRatio
      // goods.platformRatio  = data.platformRatio
      this.checkList = [data.goodsCode]
      this.handleCheckedChange(goods)
      this.$refs.priceRef.toggleAllSelection()
      this.$message({
        message: '复制成功',
        type: 'success',
      })
    },
    menuChange(item, val) {
      // val == 1 判定为房间列表
      let swtichStr = ''
      let str = ''
      if (item.state == 0) {
        swtichStr = '关闭'
      } else if (item.state == 1) {
        swtichStr = '开启'
      }
      if (val == 1 && this.relationInfo.integralLimit == 0 && this.relationInfo.byLimit == 0) {
        str = '当前能量值和水滴为0，'
      }
      this.$confirm(`${str}确认要在app里${swtichStr}预约竞拍吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let postApi = ''
        if (val === 1) {
          postApi = this.Api.updateRoomState
        } else {
          postApi = this.Api.updateConferenceHallState
        }
        const _this = this
        const con = {
          id: item.id,
          roomCode: item.roomCode,
          state: item.state == 0 ? '1' : '0',
          conferenceCode: this.activeMenu.conferenceHallCode,
        }
        item.state = item.state == 0 ? '1' : '0'
        const jsonParam = _this.GLOBAL.paramJson(con)
        this.$axios.post(postApi, jsonParam).then((res) => {
          if (res.data.head.status !== 0) {
            item.state = item.state == 0 ? '1' : '0'
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
        }).catch((err) => {
          item.state = !item.state
          _this.$message({
            message: '失败',
            type: 'error',
          })
        })
      }).catch(() => {

      })
    },
    getCalculatePrice() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const _this = this
          if (_this.checkList.length == 0) {
            _this.$message({
              message: '请选择商品',
              type: 'warning',
            })
            return
          }
          this.CalculatePrice = JSON.parse(JSON.stringify(this.ruleForm)) // 复制一份请求的起拍价等信息
          // return;
          const con = {
            biddingPrice: this.CalculatePrice.biddingPrice,
            depositRatio: this.CalculatePrice.depositRatio,
            premiumRatio: this.CalculatePrice.premiumRatio,
            integralRatio: this.CalculatePrice.integralRatio,
            transactionPrice: this.CalculatePrice.transactionPrice,
            depositPrice: this.CalculatePrice.depositPrice,
            profitRatio: this.CalculatePrice.profitRatio,
            platformRatio: this.CalculatePrice.platformRatio,
          }

          const jsonParam = _this.GLOBAL.paramJson(con)
          this.$axios.post(this.Api.getCalculatePrice, jsonParam).then((res) => {
            if (res.data.head.status === 0) {
              res.data.body.result.forEach((item, index) => {
                item.sortNum = index
              })
              _this.prices = res.data.body.result
              _this.selectID = []
              _this.CalculatePrice.prices = _this.prices
              _this.subGoodsList = _this.checkList // 记录生成价格的商品
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'error',
              })
            }
          }).catch((err) => {
          })
        }
      })
    },

    addGoodsAndPriceDetailed() {
      const _this = this
      const prices = this.$refs.priceRef.selection
      prices.sort((a, b) => {
        return a.platformRevenue - b.platformRevenue
      })
      if (_this.checkList.length == 0) {
        _this.$message({
          message: '请选择商品',
          type: 'warning',
        })
        return
      } else if (!this.prices || this.prices.length == 0) {
        _this.$message({
          message: '请重新生成模拟价格',
          type: 'warning',
        })
        return
      } else if (prices.length == 0) {
        _this.$message({
          message: '请勾选已生成价格',
          type: 'warning',
        })
        return
      }
      this.$confirm('请确认保存价格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const goods = []
        let goodsInfo = ''
        _this.checkList.forEach((item, i) => {
          goodsInfo = {
            biddingPrice: this.CalculatePrice.biddingPrice,
            transactionPrice: this.CalculatePrice.transactionPrice,
            premiumRatio: this.CalculatePrice.premiumRatio,
            depositRatio: this.CalculatePrice.depositRatio,
            integralRatio: this.CalculatePrice.integralRatio,
            // depositPrice: this.CalculatePrice.depositPrice,
            // profitRatio: this.CalculatePrice.profitRatio,
            // platformRatio: this.CalculatePrice.platformRatio,
            prices,
            goodsCode: item,
          }
          goods.push(goodsInfo)
        })
        const con = {
          conferenceCode: this.activeMenu.conferenceHallCode,
          roomCode: this.activeRoom.roomCode,
          serialNum: this.serialNum,
          goodsList: goods,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        this.$axios.post(this.Api.addGoodsAndPriceDetailed, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.$message({
              message: res.data.head.msg,
              type: 'success',
            })
            _this.setgoodsManage(goodsInfo)
            _this.selectID = [] // 清空选中的class样式
            _this.$refs.priceRef.clearSelection()
          } else {
            _this.$message({
              message: res.data.head.msg,
              type: 'warning',
            })
          }
        }).catch((err) => {
        })
      }).catch(() => {})
    },
    setgoodsManage(con) {
      const goodslist = this.goodsList.filter(item => this.checkList.includes(item.goodsCode))
      goodslist.forEach((item) => {
        item.price = con.prices
        item.startingPrice = con.biddingPrice
        item.transactionPrice = con.transactionPrice
        item.premiumRatio = con.premiumRatio
        item.depositRatio = con.depositRatio
        item.integralRatio = con.integralRatio
        // item.depositPrice = con.depositPrice
        // item.profitRatio = con.profitRatio
        // item.platformRatio = con.platformRatio
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
      this.selectID = []
      this.$refs.ruleForm.resetFields()
      this.goodsList = []
      this.checkList = []
      _this.relationInfo.appointedNum = 0
      _this.relationInfo.auctionNum = 0
      _this.relationInfo.byLimit = 0
      _this.relationInfo.integralLimit = 0
      const jsonParam = _this.GLOBAL.paramJson(con)
      this.$axios.post(this.Api.getAuctionRoomInfo, jsonParam).then((res) => {
        if (res.data.head.status === 0 && res.data.body) {
          if (res.data.body.auctionGoodsInfo) {
            _this.goodsList = res.data.body.auctionGoodsInfo
          }
          _this.serialNum = res.data.body.serialNum
          _this.relationInfo = res.data.body
        } else if (res.data.head.status !== 0) {
          _this.$message({
            message: res.data.head.msg,
            type: 'error',
          })
        }
        setTimeout(() => { this.loading = false }, 500)
      }).catch((err) => {
        setTimeout(() => { this.loading = false }, 500)
      })
    },
    addGoods(data) {
      const newGoods = data.filter(item => !this.goodsList.some(item2 => item2.goodsCode == item.goodsCode))
      this.goodsList.push(...newGoods)
      if (newGoods.length != data.length) {
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
    handleCheckedChange(Item) {
      if (this.checkList.length == 1) {
        const goodsInfo = this.goodsList.find(item => this.checkList.includes(item.goodsCode))
        if (Array.isArray(goodsInfo.price)) {
          this.ruleForm.biddingPrice = goodsInfo.startingPrice
          this.ruleForm.transactionPrice = goodsInfo.transactionPrice
          this.ruleForm.premiumRatio = goodsInfo.premiumRatio
          this.ruleForm.depositRatio = goodsInfo.depositRatio
          this.ruleForm.integralRatio = goodsInfo.integralRatio
          this.ruleForm.depositPrice = 300
          this.ruleForm.profitRatio = 1
          this.ruleForm.platformRatio = 43
          // this.ruleForm.depositPrice = ''
          // this.ruleForm.profitRatio = ''
          // this.ruleForm.platformRatio = ''
          this.CalculatePrice = JSON.parse(JSON.stringify(this.ruleForm))
          this.selectID = []
          this.prices = goodsInfo.price
        } else {
          this.selectID = []
          this.prices = []
          this.$refs.ruleForm.resetFields()
        }
      } else {
        this.prices = []
        this.$refs.ruleForm.resetFields()
      }
    },
    deleteGoods(item) {
      this.$confirm(`请确认是否删除${item.goodsName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        if (Array.isArray(item.price)) {
          const con = {
            conferenceCode: this.activeMenu.conferenceHallCode,
            roomCode: this.activeRoom.roomCode,
            serialNum: this.serialNum,
            goodsList: [item.goodsCode],
          }
          const jsonParam = _this.GLOBAL.paramJson(con)
          this.$axios.post(_this.Api.delAuctionGoodsInfo, jsonParam).then((res) => {
            if (res.data.head.status === 0) {
              _this.goodsList = _this.goodsList.filter(Item => Item.goodsCode != item.goodsCode)
              _this.checkList = _this.checkList.filter(Item => Item != item.goodsCode)
              _this.handleCheckedChange()
              _this.$message({
                type: 'success',
                message: '删除成功!',
              })
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          }).catch((err) => {})
        } else {
          _this.goodsList = _this.goodsList.filter(Item => Item.goodsCode != item.goodsCode)
          _this.checkList = _this.checkList.filter(Item => Item != item.goodsCode)
          _this.handleCheckedChange()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        }
      }).catch(() => {
      })
    },
    roomCheckListChange(val, item) {
      // 选中某项
      const _this = this
      if (val === true) {
        this.$confirm(`请确认是否绑定 ${item.roomName} 分区`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const con = {
            conferenceCode: this.activeMenu.conferenceHallCode,
            roomCode: item.roomCode,
          }
          const jsonParam = _this.GLOBAL.paramJson(con)
          this.$axios.post(this.Api.addConferenceRelation, jsonParam).then((res) => {
            if (res.data.head.status == 0) {
              _this.getRoomInfo(1)
              this.$message({
                type: 'success',
                message: '绑定成功成功!',
              })
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
              this.roomCheckList = this.roomCheckList.filter(Item => Item != item.roomCode)
            }
          }).catch((err) => {})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
          this.roomCheckList = this.roomCheckList.filter(Item => Item != item.roomCode)
        })
      } else {
        this.$confirm(`解除 ${item.roomName} 将会删除相关配置内容，确认吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const room = _this.associatedRoom.find(roomItem => roomItem.roomCode == item.roomCode)
          const con = {
            conferenceCode: this.activeMenu.conferenceHallCode,
            roomCode: item.roomCode,
            serialNum: room.serialNum,
          }
          const jsonParam = this.GLOBAL.paramJson(con)
          this.$axios.post(this.Api.delConferenceRelation, jsonParam).then((res) => {
            if (res.data.head.status == 0) {
              const associatedRoom = _this.associatedRoom.filter(associatedRoomItem => associatedRoomItem.roomCode != item.roomCode)
              _this.associatedRoom = associatedRoom
              if (_this.associatedRoom.length > 0 && room.roomCode == _this.activeRoom.roomCode) {
                _this.roomClick(_this.associatedRoom[0])
              } else if (_this.associatedRoom.length == 0) {
                _this.roomClick('')
              }
              this.$message({
                type: 'success',
                message: '解除绑定成功!',
              })
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
            }
          }).catch((err) => {})
        }).catch(() => {
          this.roomCheckList.push(item.roomCode)
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
      }
    },
    handleCopyHistory() {
      this.closeDialog()
      if (this.menuList.length > 0) {
        this.$refs.copyhistory.handleOpen(this.menuList, this.drawerData)
      } else {
        this.$message({
          type: 'error',
          message: '场次列表为空',
        })
      }
    },
    CopyHistory() {
      this.getConferenceHall('loadRoomInfo')
    },
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
          background:#dedede;
          .center{
            >span:nth-child(1){
              color:#000;
            }
          }
        }
        >.el-button.active{
          background:#dedede;
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
            width: 186px;
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
        >div{
          overflow: hidden;
        }
        .el-form-item{
          display:inline-block;
          width:186px;
        }
        .el-form{
          width: 100%;
          float: left;
          text-align:left;
        }
        .el-form-item__label{
          padding:0 6px 0 0;
        }
        // .btnBox{
        //   width:230px;
        //   overflow:hidden;
        //   padding-left:18px;
        //   padding-bottom: 20px;
          .el-button{
            background:#8d1323;
            border:1px solid #8d1323;
            margin-left:28px;
          }
          .el-button:nth-child(1){
            background:#dd6161;
            border:1px solid #dd6161;
          }
        // }
      }
    }

    body > .el-container {
      margin-bottom: 40px;
    }
    #Content{
      background:#F7F7F7;
      // background:#ccc;
      padding:0px 0px 0px 246px;
      display:inline-block!important;
      >div{
        border:1px solid #eaeaea;
      }
      .AuctionMenu{
        .roomNull{
          color:#BFBFBF;
          font-size:16px;
          height:50px;
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
        position: relative;
      }
      .deleteBox{
        position: absolute;
        top:0px;
        right:4px;
        height:24px;
        font-size:16px;
        text-align: center;
        line-height: 24px;
        i{
          margin-left:5px;
          cursor: pointer;
        }
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
    #roomBox div.addBtn{
      display: inline-block;
      margin-left: 28px;
      .el-button{
        background-color: #fff;
        border:1px solid #635a5a;
        display: flex;
        justify-content: center;
        align-items: center;
        width:22px;
        height:22px;
        font-weight: bolder;
        padding:6px;
        font-size:14px;
        margin-top:8px;
        color: #635a5a;
      }
    }
    ::v-deep .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before{
      content:''!important;
    }
    .disabled{
      cursor: not-allowed!important;
    }
    .el-switch.is-disabled{
      opacity: 0.3
    }
    ::v-deep  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell{
      background-color:#F5F7FA;
    }
    ::v-deep .el-table__body tr.activeRow > td.el-table__cell{
      background-color:#fed1d1;
    }
    ::v-deep .el-table tr.activeRow{
      background-color: #fed1d1;
    }
    ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
      background: #8d1323;
    }
    ::v-deep .el-checkbox__inner:hover{
      border-color: #8d1323;
    }
    ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner{
      border-color: #8d1323;
    }
    ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner{
      border-color: #8d1323;
    }
    ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
      color: #8d1323;
    }
</style>

<style>
  #elMain{
    padding:0px;
  }
</style>
