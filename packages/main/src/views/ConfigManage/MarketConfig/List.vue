<script>
import { keyBy } from 'lodash-es'
import { getBrandConfigById, updateBrandConfig } from '@/api/market'

export default {
  name: 'MarketList',
  data: () => ({
    isUpdate: false,
    ruleForm: {
      configList: {},
    },
    configList: [], // 初始接口结果
    configMap: {}, // 初始数据map
  }),

  mounted() {
    this.getBrandConfigById()
  },

  methods: {
    // 查询配置详情
    async getBrandConfigById() {
      const res = await getBrandConfigById({
        brandId: sessionStorage.getItem('brandId'), // 235
      })
      this.configList = res.body.resultList
      this.configMap = keyBy(this.configList, 'code')
    },

    // 修改配置详情
    async updateBrandConfig() {
      const res = await updateBrandConfig({
        brandId: sessionStorage.getItem('brandId'),
        userId: sessionStorage.getItem('userId'),
        configList: this.ruleForm.configList,
      })
      this.$message({
        type: 'success',
        message: '修改成功!',
      })
      this.isUpdate = false
      this.getBrandConfigById()
    },

    async submitUpdate() {
      this.$confirm('确定保存此配置的修改吗？', '提示', { type: 'warning' }).then(async () => {
        this.ruleForm.configList = Object.values(this.configMap)
        await this.updateBrandConfig()
      }).catch(err => this.$message({ message: err.message || '取消修改！', type: 'warning' }))
    },

    cancelUpdate() {
      this.isUpdate = false
      this.$message({ message: '取消编辑！', type: 'warning' })
    },

  },
}
</script>

<template>
  <div class="h-full">
    <div class="p-4 h-full relative">
      <div class="text-lg">
        {{ isUpdate ? '编辑配置' : '查看配置' }}
      </div>
      <ElDivider />
      <div v-if="Object.keys(configMap).length">
        <ElForm v-if="Object.keys(configMap).length" ref="form" :model="ruleForm" label-width="150px">
          <ElFormItem :label="configMap.BRAND_START_TIME.configName">
            <p v-if="!isUpdate" class="ml-8">
              {{ configMap.BRAND_START_TIME.value }}
            </p>
            <ElTimeSelect
              v-else
              v-model="configMap.BRAND_START_TIME.value"
              :picker-options="{
                start: '01:00',
                step: '00:30',
                end: '24:00',
              }"
              placeholder="请选择"
              clearable
            />
          </ElFormItem>
          <ElFormItem :label="configMap.BRAND_END_TIME.configName">
            <p v-if="!isUpdate" class="ml-8">
              {{ configMap.BRAND_END_TIME.value }}
            </p>
            <ElTimeSelect
              v-else
              v-model="configMap.BRAND_END_TIME.value"
              :picker-options="{
                start: '01:00',
                step: '00:30',
                end: '24:00',
              }"
              placeholder="请选择"
              clearable
            />
          </ElFormItem>
          <ElFormItem :label="configMap.INTERVAL_MINUTE.configName">
            <p v-if="!isUpdate" class="ml-8">
              {{ configMap.INTERVAL_MINUTE.value }}
            </p>
            <ElSelect v-else v-model="configMap.INTERVAL_MINUTE.value" style="width:220px" placeholder="请输入名称">
              <ElOption label="10" value="10" />
              <ElOption label="20" value="20" />
              <ElOption label="30" value="30" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="configMap.BRAND_INTERVAL_PRICE.configName">
            <p v-if="!isUpdate" class="ml-8">
              {{ configMap.BRAND_INTERVAL_PRICE.value }}
            </p>
            <ElInput v-else v-model="configMap.BRAND_INTERVAL_PRICE.value" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" placeholder="请选择" autocomplete="off" style="width:60%;" />
          </ElFormItem>
          <ElFormItem :label="configMap.INTERVAL_DAY.configName">
            <p v-if="!isUpdate" class="ml-8">
              {{ configMap.INTERVAL_DAY.value }}
            </p>
            <ElInput v-else v-model="configMap.INTERVAL_DAY.value" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入" autocomplete="off" style="width:60%;" />
          </ElFormItem>
        </ElForm>
        <div class="absolute bottom-0 left-0 ml-12 p-10">
          <ElButton v-if="!isUpdate" type="primary" size="medium" @click="isUpdate = true">
            编辑
          </ElButton>
          <ElButton v-if="isUpdate" type="primary" size="medium" @click="submitUpdate">
            保存
          </ElButton>
          <ElButton v-if="isUpdate" size="medium" @click="cancelUpdate">
            取消
          </ElButton>
        </div>
      </div>
      <ElEmpty v-else description="暂无配置信息" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
