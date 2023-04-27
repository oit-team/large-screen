<script>
import { Upload } from '@oit/element-ui-extend'
import { keyBy } from 'lodash-es'
import { getBrandConfigById, updateBrandConfig } from '@/api/market'

export default {
  name: 'MarketList',
  components: { VcUpload: Upload },
  data: () => ({
    maxMB: 10,
    isUpdate: false,
    ruleForm: {
      configList: {},
    },
    configList: [], // 初始接口结果
    configMap: {}, // 初始数据map
    floorImgList: [],
    floorMapList: [],
  }),

  computed: {
    uploadOptionFloorImg() {
      return {
        drag: true,
        showFileList: false,
        multiple: true,
        maxSize: 1024 * this.maxMB,
        limit: 5,
        chunkSize: 1024 * 5,
        check: true,
        accept: 'image/*',
        onError: (e, file) => {
          this.$message.error(`${file.name} 上传失败，请重试！`)
        },
        onSuccess: ({ data }, file, fileList) => {
          this.floorImgList = fileList
        },
      }
    },
  },

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
      this.floorImgList = res.body.floorMapList.map(item => ({
        url: item.mapUrl,
        floorNum: item.floorNum,
      }))
    },

    // 修改配置详情
    async updateBrandConfig() {
      const res = await updateBrandConfig({
        brandId: sessionStorage.getItem('brandId'),
        userId: sessionStorage.getItem('userId'),
        configList: this.ruleForm.configList,
        floorMapList: this.floorMapList,
      })
      this.$message({
        type: 'success',
        message: '修改成功!',
      })
      this.isUpdate = false
      this.getBrandConfigById()
    },

    deleteSelectedImgsItem(item) {
      this.floorImgList.splice(item, 1)
    },

    async submitUpdate() {
      this.$confirm('确定保存此配置的修改吗？', '提示', { type: 'warning' }).then(async () => {
        this.ruleForm.configList = Object.values(this.configMap)
        this.floorMapList = this.floorImgList.map(item => ({
          floorNum: item.floorNum,
          mapUrl: item.response?.data?.fileUrl || item.url,
        }))
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
              :placeholder="`请选择${configMap.BRAND_START_TIME.configName}`"
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
              :placeholder="`请选择${configMap.BRAND_END_TIME.configName}`"
              clearable
            />
          </ElFormItem>
          <ElFormItem :label="configMap.INTERVAL_MINUTE.configName">
            <p v-if="!isUpdate" class="ml-8">
              {{ configMap.INTERVAL_MINUTE.value }}
            </p>
            <ElSelect v-else v-model="configMap.INTERVAL_MINUTE.value" style="width:220px" :placeholder="`请选择${configMap.INTERVAL_MINUTE.configName}`">
              <ElOption label="10" value="10" />
              <ElOption label="20" value="20" />
              <ElOption label="30" value="30" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem :label="configMap.BRAND_INTERVAL_PRICE.configName">
            <p v-if="!isUpdate" class="ml-8">
              {{ configMap.BRAND_INTERVAL_PRICE.value }}
            </p>
            <ElInput v-else v-model="configMap.BRAND_INTERVAL_PRICE.value" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" :placeholder="`请输入${configMap.BRAND_INTERVAL_PRICE.configName}`" autocomplete="off" style="width:60%;" />
          </ElFormItem>
          <ElFormItem :label="configMap.INTERVAL_DAY.configName">
            <p v-if="!isUpdate" class="ml-8">
              {{ configMap.INTERVAL_DAY.value }}
            </p>
            <ElInput v-else v-model="configMap.INTERVAL_DAY.value" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="`请输入${configMap.INTERVAL_DAY.configName}`" autocomplete="off" style="width:60%;" />
          </ElFormItem>
        </ElForm>
        <ElForm ref="selectedImgForm" class="selectedImgForm" label-width="150px">
          <ElFormItem label="楼层/引导图" class="checkedFloorImgs">
            <div v-for="item, index in floorImgList" :key="index" class="floorImages">
              <ElImage
                style="width: 146px; height: 146px"
                :src="item.url"
                fit="cover"
              />
              <div v-if="isUpdate" class="checkImgMask">
                <div class="w-full h-full flex justify-center items-center">
                  <ElButton type="info" icon="el-icon-delete" circle @click="deleteSelectedImgsItem(item)" />
                </div>
              </div>
              <ElInput v-model="item.floorNum" :disabled="!isUpdate" size="mini" placeholder="填写楼层号" />
            </div>
            <VcUpload
              v-bind="uploadOptionFloorImg"
              ref="floorUpload"
              class="floor-uploader" action="api/system/file/uploadFile"
              list-type="picture-card"
              :show-file-list="false"
              :disabled="!isUpdate"
            >
              <i class="el-icon-plus" />
            </VcUpload>
            <div class="el-upload__tip text-red-500 ml-4">
              *只能上传图片，单次提交最多{{ uploadOptionFloorImg.limit }}个，且不得超过{{ maxMB }}MB
            </div>
          </ElFormItem>
        </ElForm>
        <div class="ml-12 p-10">
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
::v-deep{
  .checkedFloorImgs .el-form-item__content{
    display: flex;
    align-items: center;
  }
  .floor-uploader .el-upload-dragger{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 147px;
    height: 147px;
  }
  .el-upload__tip{
    position: absolute;
    bottom: -30px;
    left: -12px;
  }
  .floorImages{
    position: relative;
    width: 147px;
    height: 147px;
    border-radius: 20%;
    margin-right:15px;
    .el-image{
      border-radius: 5%;
      img{
        border-radius: 5%;
      }
   }
    .checkImgMask{
      display: none;
      position: absolute;
      top:  0;
      left: 0;
      width: 99%;
      height: 99%;
      border-radius: 5%;
      background-color: black;
      opacity: .3;
    }
  }

  .floorImages:hover .checkImgMask{
    display: block;
  }
}
</style>
