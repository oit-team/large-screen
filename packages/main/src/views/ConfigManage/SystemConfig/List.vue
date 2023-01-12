<script>
import { addDictInfo, getConfigList, getDictType, updateDictInfo } from '@/api/systemConfig'

export default {
  name: 'SystemConfig',
  data: () => ({
    configLeftLoading: false,
    conformLoading: false,
    updateConfigDrawer: false,
    isEditConfigList: false,

    data: {},
    search: '',
    code: '',
    dictCode: '',
    nowIndex: 0,
    configList: [],

    form: {
      dictCode: '',
      dictName: '',
    },
    rules: {
      dictCode: [
        { required: true, message: '请输入类型标识', trigger: 'blur' },
      ],
      dictName: [
        { required: true, message: '请输入类型名称', trigger: 'blur' },
      ],
    },

  }),
  computed: {
    searchList() {
      return [...this.configList].filter(item => item.dictName.includes(this.search))
    },
    tablePageOption() {
      return {
        promise: this.loadData,
        actions: [
          {
            name: '新增',
            type: 'primary',
            icon: 'el-icon-plus',
            click: () => {
              this.$router.push(`/config/updateConfig?dictCode=${this.dictCode}`)
            },
          },
        ],
        table: {
          data: this.data?.result,
          actions: {
            width: 80,
            buttons: [{
              tip: '编辑',
              type: 'success',
              icon: 'el-icon-edit',
              click: ({ row }) => this.$router.push({
                name: 'UpdateConfig',
                query: {
                  dictCode: row.dictCode,
                  dictitemCode: row.dictitemCode,
                },
              }),
            }],
          },
        },
        pager: {
          total: this.data?.count,
        },
      }
    },
  },

  mounted() {
    this.getDictType()
  },
  methods: {
    // 左侧配置类型
    async getDictType() {
      this.configLeftLoading = true
      const res = await getDictType({
        pageNum: 1,
        pageSize: 20,
      }).finally(() => { this.configLeftLoading = false })

      this.configList = res.body.result
      this.dictCode = this.configList[0].dictCode
      await this.$refs.table.loadData()
    },

    // 右侧配置列表
    async loadData(params) {
      const res = await getConfigList({
        ...params,
        dictCode: this.dictCode,
      })
      this.data = res.body
    },

    // 点击配置类型某项
    async changeCheck(item, index) {
      this.nowIndex = index
      this.dictCode = item.dictCode
      await this.$refs.table.loadData()
    },

    // 点击新增配置按钮
    async addConfigBtn() {
      this.isEditConfigList = false
      this.updateConfigDrawer = true
    },

    // 编辑配置类型
    editConfigBtn(item, index) {
      this.updateConfigDrawer = true
      this.isEditConfigList = true
      this.form = {
        dictCode: item.dictCode,
        dictName: item.dictName,
      }
    },

    // 左侧 新增
    async addDictInfo() {
      this.conformLoading = true
      await addDictInfo({
        ...this.form,
      }).finally(() => { this.conformLoading = false })
      await this.$message({ message: '新增成功！', type: 'success' })
      await this.getDictType()
      this.form = {}
    },

    // 左侧 编辑
    async updateDictInfo() {
      this.conformLoading = true
      await updateDictInfo({
        ...this.form,
      }).finally(() => { this.conformLoading = false })
      await this.getDictType()
      await this.$message({ message: '修改成功！', type: 'success' })
    },

    // 确认新增/修改
    async confirmUpdateConfig() {
      if (!this.form) this.$message({ message: '请填写必填项！', type: 'warning' })
      await this.isEditConfigList ? this.updateDictInfo() : this.addDictInfo()

      this.updateConfigDrawer = false
    },

    // 取消
    async cancelUpdate(formName) {
      this.form = {}
      this.updateConfigDrawer = false
    },
  },
}
</script>

<template>
  <div class="flex page-container text-sm">
    <div class="w-[20%] flex flex-col mr-2 mb-2 rounded-lg border overflow-hidden">
      <!-- <div class="p-2">
        <ElTooltip content="新增" placement="top">
          <ElButton type="success" size="mini" circle class="px-3" icon="el-icon-plus"/>
        </ElTooltip>
      </div> -->
      <div class="flex p-1">
        <ElInput v-model="search" clearable placeholder="关键字搜索" />
        <ElTooltip content="刷新" placement="top">
          <ElButton class="px-3 ml-1" icon="el-icon-refresh" @click="getDictType" />
        </ElTooltip>
        <ElTooltip content="新增" placement="top">
          <ElButton class="px-3" icon="el-icon-plus" @click="addConfigBtn" />
        </ElTooltip>
      </div>

      <div class="w-full h-full flex-1 overflow-y-auto">
        <div v-if="searchList.length > 0" v-loading="configLeftLoading" class="w-full h-full">
          <div
            v-for="(item, index) in searchList"
            :key="index"
            class="configList flex justify-between w-full cursor-pointer box-border px-4 py-2 box-border rounded bindHover text-[#606266] text-sm"
            :class="nowIndex === index ? 'bg-[#F0F7FF]' : ''"
            @click="changeCheck(item, index)"
          >
            <span>{{ item.dictName }}</span>
            <i class="el-icon-edit" @click="editConfigBtn(item, index)" />
          </div>
        </div>
        <ElEmpty v-else description="暂无数据" :image-size="150" class="w-full h-full flex justify-center items-center" />
      </div>
    </div>

    <div class="w-[80%]">
      <TablePage v-bind="tablePageOption" ref="table" field-key="1673417416576" />
    </div>

    <ElDrawer :title="isEditConfigList ? '编辑' : '新增'" :visible.sync="updateConfigDrawer" size="35%">
      <div class="flex flex-col p-4">
        <ElForm ref="form" :model="form" :rules="rules" label-width="80px">
          <ElFormItem label="类型标识" prop="dictCode">
            <ElInput v-model="form.dictCode" :disabled="isEditConfigList" />
          </ElFormItem>
          <ElFormItem label="类型名称" prop="dictName">
            <ElInput v-model="form.dictName" />
          </ElFormItem>
        </ElForm>
        <div class="mx-24 my-4 flex justify-between">
          <ElButton size="small" @click="cancelUpdate('formName')">
            取消
          </ElButton>
          <ElButton v-loading="conformLoading" type="primary" size="small" @click="confirmUpdateConfig('formName')">
            确认
          </ElButton>
        </div>
      </div>
    </ElDrawer>
  </div>
</template>

<style lang='scss' scoped>
.bindHover:hover{
  background-color: #F3F4F6;
}
.configList i{
  display: none;
}

.configList:hover i{
  display: block;
}
</style>
