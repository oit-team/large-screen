<script>
import { defineComponent } from 'vue'
import { getBrands } from '@/api/account'
import resetPassword from '@/components/header/resetPassword.vue'

export default defineComponent({
  components: { ResetPassword: resetPassword },

  inject: ['viewReload'],

  data: () => ({
    brandList: [],
    brandName: '切换品牌',
  }),

  computed: {
    userData() {
      return this.$store.state.userData
    },
  },

  mounted() {
    this.getBrandsList()
  },

  methods: {
    async getBrandsList() {
      const params = {}
      const res = await getBrands(params)
      this.brandList = res.body.resultMap
    },

    async changeBrand(item) {
      await this.getBrandsList()
      this.brandName = item.brandName
      sessionStorage.setItem('brandId', item.brandId)
      // 页面加载
      this.viewReload()
    },

    logOut() {
      this.$confirm('确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        localStorage.clear()
        sessionStorage.clear()
        this.$store.dispatch('logout', this.$store)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出登录',
        })
      })
    },

  },
})
</script>

<template>
  <div>
    <ElHeader class="flex items-center justify-between border-b z-10">
      <div>
        <div class="flex items-center justify-center py-2">
          <ElAvatar class="mr-2" src="https://picsum.photos/40" />
          <div class="font-bold select-none">
            享客易
          </div>
        </div>
      </div>
      <div class="userAcountInfo h-full flex justify-between items-center box-border">
        <div v-if="brandList" class="brandInfo px-6 mr-2">
          <ElPopover
            placement="top-start"
            width="200"
            trigger="hover"
          >
            <div class="operateBtnBox" style="line-height:40px;cursor:pointer;">
              <div
                v-for="(item, index) in brandList"
                :key="index"
                class="opeItem"
                style="font-size:14px;"
                @click="changeBrand(item)"
              >
                <i class="el-icon-setting" style="margin-right: 10px;" />
                {{ item.brandName }}
              </div>
            </div>
            <div slot="reference" class="info">
              <span class="el-icon-caret-bottom">{{ brandName }}</span>
            </div>
          </ElPopover>
        </div>
        <div class="userInfo px-6">
          <ElPopover
            placement="top-start"
            width="auto"
            trigger="hover"
          >
            <div class="operateBtnBox" style="line-height:40px;cursor:pointer;">
              <div class="opeItem" style="font-size:14px;" @click="logOut()">
                <i class="el-icon-switch-button mr-2" />退出登录
              </div>
              <div class="opeItem" style="font-size:14px;" @click="$refs.resetPwd.changePwd()">
                <i class="el-icon-setting mr-2" />修改密码
              </div>
            </div>
            <div slot="reference" class="flex justify-center items-center">
              <img class="px-2" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="" width="45" height="45">
              <span>{{ userData.username }}</span>
            </div>
          </ElPopover>
        </div>
      </div>
    </Elheader>
    <ResetPassword ref="resetPwd" />
  </div>
</template>

<style scoped lang="less">
.userAcountInfo{
  .brandInfo{
    border-right: 1px solid #ccc ;
  }
}
.operateBtnBox{
  .opeItem{
    font-size:20px;
    padding: 6px 20px 6px 12px ;
    border-bottom: 1px dashed #efefef;
  }
  .opeItem:hover{
    background-color: #f5f7fa;
  }
}
</style>
