<script>
import { addIndustryInfo, getIndustryDetails } from '@/api/systemConfig'

export default {
  data() {
    return {
      type: '',
      content: '新增行业',
      active: 0,
      radio1: '行业信息',
      maxlength: 20,
      loading: false,
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
      drawer: false,
      direction: 'rtl',
      attributeList: [], // 行业属性列表
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
      listDisplayConfig: [],
      tabDrawer: false,
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
    }
  },
  computed: {
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
        this.attributeList = [...this.attributeInfo.attribInfo]
      }
    },
  },
  created() {
    this.type = this.$route.params?.type || ''
    if (this.$route.params.industryId) this.loadData()
  },
  methods: {
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
    // 新增行业属性
    addAttribute(formName) {
      const obj = JSON.parse(JSON.stringify(this.attributeForm))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确定要新增该属性吗？')
            .then(() => {
              this.attributeList.push(obj)
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
    addTab(formName) {
      const obj = JSON.parse(JSON.stringify(this.tabForm))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          obj.noSearchShow = this.tabForm.noSearchShow ? 0 : 1
          obj.noTableShow = this.tabForm.noTableShow ? 0 : 1
          // console.log(this.tabForm)
          this.listDisplayConfig.push(obj)
          // console.log(this.listDisplayConfig)
          this.$refs[formName].resetFields()
          this.tabDrawer = false
        }
      })
    },
    // 新增时 删除 行业属性
    deleteTag(index) {
      this.attributeList.splice(index, 1)
    },
    async loadData() {
      this.loading = true
      const res = await getIndustryDetails({
        industryId: this.$route.params.industryId,
      })
      this.attributeInfo = res.body
      if (this.type === 'see') {
        // this.attributeInfo.industryConfig.detailsConfig.forEach((item) => {
        //   item.disabled = true
        // })
      }
      this.listDisplayConfig = this.attributeInfo.industryConfig.listDisplayConfig
      this.loading = false
    },
    // 编辑列表配置项
    handleEdit(index, row) {
      // console.log(index, row)
    },
    // 点击新增 列表配置
    // drawerTab() {
    //   this.
    // },
  },
}
</script>

<template>
  <div v-loading="loading" class="w-full h-full p-6 box-border">
    <!--        顶部 -->
    <div class="w-full flex justify-between items-center">
      <ElPageHeader :content="content" @back="$router.back()" />

      <ElButton v-if="type === 'add'" type="primary" size="small" @click="submit('form')">
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

    <div v-show="radio1 === '行业属性'">
      <div v-if="attributeList.length === 0 && type === 'see'" class="w-full h-full">
        <ElEmpty description="暂无数据" />
      </div>
      <div v-else class="w-full h-full">
        <div>
          <ElButton>完成</ElButton>
        </div>
        <ElTag
          v-for="(item, index) in attributeList"
          :key="index"
          :closable="type !== 'see'"
          class="mr-2"
          effect="plain"
          type="info"
          :disable-transitions="false"
          @close="deleteTag(index)"
        >
          {{ item.attribName }}:{{ item.attribIndex }}
        </ElTag>
        <ElButton icon="el-icon-plus" plain @click="drawer = true">
          新增属性
        </ElButton>
      </div>
    </div>

    <div v-show="radio1 === '行业配置'" class="w-full h-full">
      <ElTabs tab-position="left">
        <ElTabPane label="列表显示配置" class="pl-6">
          <div class="h-full">
            <div v-if="type !== 'see'" class="mb-2">
              <ElButton type="primary" icon="el-icon-plus" size="small" @click="tabDrawer = true">
                新增
              </ElButton>
            </div>
            <ElTable
              border
              empty-text="暂无"
              :data="listDisplayConfig"
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
                label="是否作为列表项"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.noTableShow === 0 ? '是' : '否' }}
                </template>
              </ElTableColumn>
              <ElTableColumn
                label="是否作为搜索项"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.noSearchShow === 0 ? '是' : '否' }}
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
          <ElTransfer
            v-model="detailsConfig"
            :data="attributeInfo.attribInfo"
            :props="{
              key: 'id',
              label: 'attribName',
            }"
          />
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
            <ElInput v-model="attributeForm.attribName" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="对应属性值" prop="attribIndex">
            <ElInput v-model="attributeForm.attribIndex" :maxlength="maxlength" />
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

    <!--    配置弹框 -->
    <ElDrawer
      title="配置"
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
            <ElInput v-model="tabForm.fieldName" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="属性key" prop="fieldKey">
            <ElInput v-model="tabForm.fieldKey" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="列表昵称" prop="indexNickname">
            <ElInput v-model="tabForm.indexNickname" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="数据库映射字段" prop="dbField">
            <ElSelect v-model="tabForm.dbField" placeholder="请选择数据库映射字段">
              <ElOption
                v-for="item in 15"
                :key="item"
                :label="`key${item}`"
                :value="`key${item}`"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="排序" prop="sort">
            <ElInput v-model.number="tabForm.sort" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="格式" prop="fieldType">
            <ElInput v-model="tabForm.fieldType" :maxlength="maxlength" />
          </ElFormItem>
          <ElFormItem label="扩展信息" prop="fieldAttr">
            <ElInput v-model="tabForm.fieldAttr" />
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
  </div>
</template>

<style lang="scss" scoped>
:deep{
    .el-tabs--left .el-tabs__item.is-left{
        text-align: left;
    }
}
</style>
