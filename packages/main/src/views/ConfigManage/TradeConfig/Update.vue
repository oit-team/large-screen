<script>
import {
  addIndustryInfo,
  getIndustryDetails,
  updateIndustryAttrib,
  updateIndustryIndexConfig,
  updateProductDisplayConfig,
} from '@/api/systemConfig'

export default {
  data() {
    return {
      type: '',
      content: '新增行业',
      active: 0,
      radio1: '行业信息',
      maxlength: 20,
      loading: false,
      tabDrawerType: 0, // 0 新增 1 编辑
      attributeDrawerType: 0, // 0 新增 1 编辑
      editTabIndex: 0,
      editAttributeIndex: 0,
      autosize: {
        minRows: 3,
        maxRows: 12,
      },
      form: { // 行业form
        industryName: '',
        attrConf: '',
      },
      attributeForm: { // 属性form
        attribName: '',
        attribIndex: '',
      },
      tabForm: {
        fieldName: '',
        fieldKey: '',
        indexNickname: '',
        dbField: '',
        sort: '',
        fieldType: '',
        fieldAttr: '',
        noSearchShow: false,
        noTableShow: false,
      },
      drawer: false,
      tabDrawer: false,
      detailsDrawer: false,
      direction: 'rtl',
      attributeList: [], // 行业属性 列表
      rules: {
        industryName: [
          { required: true, message: '请输入行业名称', trigger: 'blur' },
        ],
        attrConf: [
          { required: true, message: '请输入行业详情页JSON', trigger: 'blur' },
        ],
      },
      attributeRules: {
        attribName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
        ],
        attribIndex: [
          { required: true, message: '请输入对应属性值', trigger: 'blur' },
        ],
      },
      tabRules: {
        fieldName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
        ],
        fieldKey: [
          { required: true, message: '请输入属性key', trigger: 'blur' },
        ],
        indexNickname: [
          { required: true, message: '请输入列表昵称', trigger: 'blur' },
        ],
        dbField: [
          { required: true, message: '请输入数据库映射字段', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
        ],
        fieldType: [
          { required: true, message: '请输入格式', trigger: 'blur' },
        ],
        fieldAttr: [
          { required: true, message: '请输入扩展信息', trigger: 'blur' },
        ],
      },
      attributeInfo: {},
      detailsConfig: [], // 详情配置列表
      detailsConfigList: [], // 详情配置列表
      listDisplayConfig: [],
    }
  },
  computed: {
    optionalAttributeList() {
      let arr = JSON.parse(JSON.stringify(this.attributeList))

      arr = arr.map((e) => {
        e.indexName = e.attribName
        e.indexDescrip = e.attribIndex
        return e
      })
      arr.forEach((e, i) => {
        this.detailsConfig.forEach((ele) => {
          if (e.indexName === ele.indexName) arr.splice(i, 1)
        })
      })
      return arr
    },
  },
  watch: {
    drawer() {
      if (!this.drawer) {
        this.attributeForm.attribName = ''
        this.attributeForm.attribIndex = ''
      }
    },
    attributeInfo() {
      if (this.attributeInfo.industryName) {
        this.form.industryName = this.attributeInfo.industryName
        this.form.attrConf = this.attributeInfo.attrConf
      }
    },
  },
  created() {
    this.type = this.$route.params?.type || ''
    if (this.$route.params.industryId) this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      const res = await getIndustryDetails({
        industryId: this.$route.params.industryId,
      })
      this.attributeInfo = res.body
      this.listDisplayConfig = this.attributeInfo.industryConfig.listDisplayConfig
      this.detailsConfig = this.attributeInfo.industryConfig?.detailsConfig
      this.attributeList = [...this.attributeInfo.attribInfo]
      this.loading = false
    },
    // 新增点击完成
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.attributeList.length === 0) {
            this.$message.warning('请至少新增一项行业属性')
            return false
          }
          if (this.listDisplayConfig.length === 0) {
            this.$message.warning('请至少新增一项列表显示配置')
            return false
          }
          if (this.detailsConfig.length === 0) {
            this.$message.warning('请至少新增一项详情配置')
            return false
          }
          this.$confirm('确定新增该行业吗？')
            .then(async () => {
              await addIndustryInfo({
                ...this.form,
                IndustryAttrib: this.attributeList,
              })
              this.$message.success('成功')
              // this.$router.back()
            })
            .catch(() => {})
        }
        else {
          this.$message.warning('请完善行业基本信息填写')
        }
      })
    },
    addAttributeBtn() {
      this.attributeDrawerType = 0
      this.drawer = true
    },
    // 编辑修改 行业属性
    editAttribute(e, i) {
      this.attributeDrawerType = 1
      this.editAttributeIndex = i
      this.attributeForm = JSON.parse(JSON.stringify(e))
      this.drawer = true
    },
    // 新增行业属性
    addAttribute(formName) {
      const obj = JSON.parse(JSON.stringify(this.attributeForm))
      if (this.attributeDrawerType === 1) {
        this.$set(this.attributeList, this.editAttributeIndex, obj)
        this.drawer = false
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定新增该属性吗？')
            .then(() => {
              this.attributeList.push(obj)
              this.$refs[formName].resetFields()
              this.drawer = false
            })
            .catch(() => {})
        }
        else {
          this.$message.error('请填写完整')
          return false
        }
      })
    },
    // 列表配置 drawer 点击确认
    addTab(formName) {
      const obj = JSON.parse(JSON.stringify(this.tabForm))
      if (this.tabDrawerType === 1) {
        obj.noSearchShow = this.tabForm.noSearchShow ? 0 : 1
        obj.noTableShow = this.tabForm.noTableShow ? 0 : 1
        this.$set(this.listDisplayConfig, this.editTabIndex, obj)
        this.tabDrawer = false
        this.$refs[formName].resetFields()
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          obj.noSearchShow = this.tabForm.noSearchShow ? 0 : 1
          obj.noTableShow = this.tabForm.noTableShow ? 0 : 1
          this.listDisplayConfig.push(obj)
          this.$refs[formName].resetFields()
          this.tabDrawer = false
        }
      })
    },
    // 点击新增列表配置项
    addTabForm() {
      this.tabDrawerType = 0
      this.tabForm.noSearchShow = false
      this.tabForm.noTableShow = false
      this.$refs.tabForm?.resetFields()
      this.tabDrawer = true
    },
    // 点击编辑列表配置项
    handleEdit(index, row) {
      this.editTabIndex = index
      this.tabDrawerType = 1
      this.tabForm = JSON.parse(JSON.stringify(row))
      this.tabForm.noSearchShow = this.tabForm.noSearchShow === 0
      this.tabForm.noTableShow = this.tabForm.noTableShow === 0
      this.tabDrawer = true
    },
    // 编辑属性 完成按钮
    updateIndustryAttrib() {
      this.$confirm('确认修改并保存当前数据吗')
        .then(async () => {
          await updateIndustryAttrib({
            industryId: this.attributeInfo.industryId,
            industryAttrib: this.attributeList,
          })
          this.$message.success('编辑完成')
        })
        .catch(() => {})
    },
    // 点击列表配置完成
    async updateIndustryIndexConfig() {
      const obj = this.listDisplayConfig
      obj.forEach((e) => {
        e.noSearchShow = e.noSearchShow ? 0 : 1
        e.noTableShow = e.noTableShow ? 0 : 1
      })
      this.$confirm('确认修改并保存当前数据吗')
        .then(async () => {
          await updateIndustryIndexConfig({
            industryId: this.attributeInfo.industryId,
            listDisplayConfig: obj,
          })
          this.$message.success('编辑完成')
        })
        .catch(() => {})
    },
    // 筛选 数组
    filterDetail(item) {
      return this.detailsConfigList.find(e => e.indexName === item.indexName)
    },
    addDetailsList(item) {
      if (this.detailsConfigList.find(e => e.indexName === item.indexName)) {
        this.detailsConfigList.forEach((e, i) => {
          if (e.indexName === item.indexName) this.detailsConfigList.splice(i, 1)
        })
      }
      else this.detailsConfigList.push(item)
    },
    addDetailsConfig() {
      this.detailsDrawer = false
      this.detailsConfig.push(...this.detailsConfigList)

      this.optionalAttributeList.forEach((e, i) => {
        this.detailsConfig.forEach((ele) => {
          if (e.indexName === ele.indexName) this.optionalAttributeList.splice(i, 1)
        })
      })
    },
    // 修改产品详情页配置
    async updateProductDisplayConfig() {
      this.$confirm('确认修改并保存当前数据吗')
        .then(async () => {
          await updateProductDisplayConfig({
            industryId: this.attributeInfo.industryId,
            detailsConfig: this.detailsConfig,
          })
          this.$message.success('编辑完成')
        })
        .catch(() => {})
    },
    resetForm(formName) {
      this.tabForm.noSearchShow = false
      this.tabForm.noTableShow = false
      this.$refs[formName]?.resetFields()
    },
  },
}
</script>

<template>
  <div v-loading="loading" class="w-full h-full p-6 box-border">
    <!--        顶部 -->
    <div class="w-full flex justify-between items-center">
      <ElPageHeader :content="content" @back="$router.back()" />
      <!--      新增全部完成 -->
      <ElButton v-if="type === 'add'" type="success" size="small" @click="submit('form')">
        完成
      </ElButton>
    </div>

    <div class="w-full flex justify-center mb-6">
      <ElRadioGroup v-model="radio1">
        <ElRadioButton label="行业信息" />
        <ElRadioButton label="行业属性" />
        <ElRadioButton label="行业配置" />
      </ElRadioGroup>
    </div>

    <ElForm v-show="radio1 === '行业信息'" ref="form" :model="form" label-width="150px" :rules="rules" class="w-1/2">
      <ElFormItem label="行业名称" prop="industryName">
        <ElInput v-model="form.industryName" clearable :maxlength="maxlength" :disabled="type !== 'add'" />
      </ElFormItem>
      <ElFormItem label="产品详情页JSON" prop="attrConf">
        <ElInput v-model="form.attrConf" type="textarea" clearable :autosize="autosize" :disabled="type !== 'add'" />
      </ElFormItem>
    </ElForm>

    <div v-show="radio1 === '行业属性'" class="w-full h-full">
      <div v-if="attributeList.length === 0 && type === 'see'" class="w-full h-full">
        <ElEmpty description="暂无数据" />
      </div>
      <div v-else class="w-h-full">
        <div v-if="type === 'edit'" class="mb-2 flex justify-end">
          <ElButton icon="el-icon-plus" size="small" type="primary" plain @click="addAttributeBtn">
            新增属性
          </ElButton>
          <ElButton type="success" size="small" @click="updateIndustryAttrib">
            完成
          </ElButton>
        </div>
        <div class="grid grid-cols-4 gap-4 gap-y-2 w-full">
          <div
            v-for="(item, index) in attributeList"
            :key="index"
            class="flex justify-between items-center border p-2 rounded-md text-[#888] attribute h-min"
            @click="editAttribute(item, index)"
          >
            <div class="text-sm">
              <div>属性名：<span class="text-[#333]">{{ item.attribName }}</span></div>
              <div>属性值：<span class="text-[#333]">{{ item.attribIndex }}</span></div>
            </div>
            <i
              class="el-icon-close"
              @click.stop="attributeList.splice(index, 1)"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-show="radio1 === '行业配置'" class="w-full h-full">
      <ElTabs tab-position="left">
        <ElTabPane label="列表显示配置" class="pl-6">
          <div class="h-full">
            <div v-if="type !== 'see'" class="mb-2 flex justify-end">
              <ElButton type="primary" icon="el-icon-plus" size="small" @click="addTabForm">
                新增
              </ElButton>
              <ElButton v-if="type === 'edit'" type="success" size="small" @click="updateIndustryIndexConfig">
                完成
              </ElButton>
            </div>
            <ElTable
              border
              :data="listDisplayConfig"
              empty-text="暂无"
              style="width: 100%"
            >
              <ElTableColumn
                prop="sort"
                label="排序"
                align="center"
              />
              <ElTableColumn
                prop="industryId"
                label="行业id"
                align="center"
              />
              <ElTableColumn
                prop="fieldName"
                label="属性名称"
                align="center"
              />
              <ElTableColumn
                prop="fieldKey"
                label="属性key"
                align="center"
              />
              <ElTableColumn
                prop="indexNickname"
                label="列表昵称"
                align="center"
              />
              <ElTableColumn
                prop="dbField"
                label="数据库映射字段"
                align="center"
              />
              <ElTableColumn
                prop="fieldType"
                label="格式"
                align="center"
              />
              <ElTableColumn
                label="是否作为搜索项"
                align="center"
                prop="noSearchShow"
              >
                <template slot-scope="scope">
                  {{ scope.row.noSearchShow === 0 ? '是' : '否' }}
                  <!--                  {{ scope.row.noSearchShow }} -->
                </template>
              </ElTableColumn>
              <ElTableColumn
                label="是否作为列表项"
                align="center"
                prop="noTableShow"
              >
                <template slot-scope="scope">
                  {{ scope.row.noTableShow === 0 ? '是' : '否' }}
                  <!--                  {{ scope.row.noTableShow }} -->
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="fieldAttr"
                label="扩展信息"
                align="center"
              />
              <ElTableColumn
                label="操作"
                align="center"
              >
                <template slot-scope="scope">
                  <ElButton type="primary" size="mini" :disabled="type === 'see'" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)" />
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </ElTabPane>
        <ElTabPane label="详情配置" class="pl-6">
          <div v-if="type !== 'see'" class="mb-2 flex justify-end">
            <ElButton type="primary" icon="el-icon-plus" size="small" @click="detailsDrawer = true">
              新增
            </ElButton>
            <ElButton v-if="type === 'edit'" type="success" size="small" @click="updateProductDisplayConfig">
              完成
            </ElButton>
          </div>
          <div class="grid grid-cols-4 gap-2 w-full">
            <div
              v-for="(item, index) in detailsConfig"
              :key="index"
              class="flex justify-between items-center border p-2 rounded-md text-[#888] attribute h-6em"
            >
              <div class="text-sm">
                <div>属性名：<span class="text-[#333]">{{ item.indexName }}</span></div>
                <div>属性值：<span class="text-[#333]">{{ item.indexDescrip }}</span></div>
              </div>
              <i
                class="el-icon-close"
                @click="detailsConfig.splice(index, 1)"
              />
              <!--              @click="deleteDetailsConfig(index)" -->
            </div>
          </div>
        </ElTabPane>
      </ElTabs>
    </div>

    <!--    属性 弹框 -->
    <ElDrawer
      title="属性"
      :visible.sync="drawer"
      :direction="direction"
    >
      <div class="h-full px-2 flex flex-col justify-between">
        <ElForm ref="attributeForm" :model="attributeForm" label-width="100px" :rules="attributeRules">
          <ElFormItem label="属性名" prop="attribName">
            <ElInput v-model.trim="attributeForm.attribName" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="对应属性值" prop="attribIndex">
            <ElInput v-model.trim="attributeForm.attribIndex" :maxlength="maxlength" />
          </ElFormItem>
        </ElForm>

        <div class="w-full flex justify-around">
          <ElButton block class="flex-1" @click="drawer = false">
            取消
          </ElButton>
          <ElButton block type="primary" class="flex-1" @click="addAttribute('attributeForm')">
            确认
          </ElButton>
        </div>
      </div>
    </ElDrawer>

    <!--    列表显示配置弹框 -->
    <ElDrawer
      title="列表显示配置"
      :visible.sync="tabDrawer"
      :direction="direction"
    >
      <div class="h-full px-4 flex flex-col justify-between">
        <ElForm
          ref="tabForm"
          :model="tabForm"
          label-width="130px"
          :rules="tabRules"
        >
          <ElFormItem label="属性名称" prop="fieldName">
            <ElInput v-model.trim="tabForm.fieldName" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="属性key" prop="fieldKey">
            <ElInput v-model.trim="tabForm.fieldKey" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="列表昵称" prop="indexNickname">
            <ElInput v-model.trim="tabForm.indexNickname" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="数据库映射字段" prop="dbField">
            <ElSelect v-model.trim="tabForm.dbField" placeholder="请选择数据库映射字段">
              <ElOption
                v-for="item in 15"
                :key="item"
                :label="`KEY${item}`"
                :value="`KEY${item}`"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="排序" prop="sort">
            <ElInput v-model.number="tabForm.sort" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="格式" prop="fieldType">
            <ElInput v-model.trim="tabForm.fieldType" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="扩展信息" prop="fieldAttr">
            <ElInput v-model.trim="tabForm.fieldAttr" />
          </ElFormItem>
          <ElFormItem label="是否作为搜索项">
            <ElSwitch v-model="tabForm.noSearchShow" />
          </ElFormItem>
          <ElFormItem label="是否作为列表项">
            <ElSwitch v-model="tabForm.noTableShow" />
          </ElFormItem>
        </ElForm>

        <div class="w-full flex justify-around">
          <ElButton block class="flex-1" @click="tabDrawer = false">
            取消
          </ElButton>
          <ElButton block type="primary" class="flex-1" @click="addTab('tabForm')">
            确认
          </ElButton>
        </div>
      </div>
    </ElDrawer>

    <!--    选择  详情配置 -->
    <ElDrawer
      title="详情配置"
      :visible.sync="detailsDrawer"
      :direction="direction"
    >
      <div class="h-full px-4 py-2 box-border flex flex-col justify-between">
        <div v-if="optionalAttributeList.length" class="grid grid-cols-1 gap-2 w-full px-2">
          <div
            v-for="(item, index) in optionalAttributeList"
            :key="index"
            class="flex justify-between items-center border p-2 rounded-md text-[#888] attribute h-min"
            :class="{ 'bg-[#5c96fd] text-white': filterDetail(item) }"
            @click="addDetailsList(item)"
          >
            <div class="text-sm">
              <div>属性名：<span class="text-[#333]" :class="{ 'text-white': filterDetail(item) }">{{ item.indexName }}</span></div>
              <div>属性值：<span class="text-[#333]" :class="{ 'text-white': filterDetail(item) }">{{ item.indexDescrip }}</span></div>
            </div>
          </div>
        </div>
        <div v-else class="w-h-full">
          <ElEmpty description="暂无数据" />
        </div>

        <div v-if="optionalAttributeList.length" class="w-full flex justify-around">
          <ElButton block class="flex-1" @click="drawer = false">
            取消
          </ElButton>
          <ElButton block type="primary" class="flex-1" @click="addDetailsConfig">
            确认
          </ElButton>
        </div>
        <div v-else />
      </div>
    </ElDrawer>
  </div>
</template>

<style lang="scss" scoped>
:deep{
    .el-tabs--left .el-tabs__item.is-left{
        text-align: left;
    }
}
.attribute:hover{
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.w-h-full{
  width: 100%;
  height: 100%;
}
</style>
