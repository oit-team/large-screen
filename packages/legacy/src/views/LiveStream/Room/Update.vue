<script>
import { addOrUpLiveBroadcastRoom, getBrandAreaShopTree, getLiveBroadcastType, pptToPicture } from '@/api/liveStream'

// 能力
const ABILITY = {
  SPEAKER: 1,
  PARTICIPANTS: 2,
}

export default {
  name: 'RoomUpdate',

  data() {
    this.ABILITY = ABILITY
    return {
      formData: {
        roomName: undefined,
        time: null,
        speaker: undefined,
        liveBroadcastType: undefined,
        participants: [],
        resources: [],
      },
      rules: {
        roomName: [{
          required: true,
          message: '请输入房间名称',
          trigger: 'blur',
        }],
        time: [{
          required: true,
          message: '日期不能为空',
          trigger: 'blur',
        }],
        speaker: [{
          required: true,
          message: '请至少选择一个主讲人',
          trigger: 'change',
        }],
        liveBroadcastType: [{
          required: true,
          message: '请选择直播方式',
          trigger: 'change',
        }],
        participants: [{
          validator: (rule, value, callback) => (value.length > 4 ? callback('参与者最多选择4个') : callback()),
          trigger: 'change',
        }],
      },
      areaShopOptions: {},
      liveBroadcastTypeOptions: [],
      speakerProps: {
        multiple: false,
        checkStrictly: true,
        emitPath: false,
        label: 'osName',
        value: 'id',
        children: 'childrenList',
      },
      participantsProps: {
        multiple: true,
        checkStrictly: true,
        emitPath: false,
        label: 'osName',
        value: 'id',
        children: 'childrenList',
      },
      participantsTreeProps: {
        label: 'osName',
        children: 'childrenList',
      },
      filterText: '',
      participantsSelected: [],
    }
  },

  computed: {
    uploadOption() {
      return {
        autoUpload: false,
        data: {
          fileType: '3',
        },
        fileList: this.formData.resources,
        check: true,
        limit: 1,
        accept: '.ppt,.pptx',
        // 20mb
        maxSize: 1024 * 20,
        // 2mb
        chunkSize: 1024 * 2,
        onError: (e, file) => {
          this.$message.error(`${file.name} 上传失败，请重试！`)
        },
        onSuccess: this.pptToPicture,
      }
    },
    hasLiveBroadcastType() {
      return !!this.formData.liveBroadcastType
    },
    participantsOption() {
      const {
        areaShopOptions,
        formData,
      } = this
      return (areaShopOptions[formData.liveBroadcastType] || [])[ABILITY.PARTICIPANTS] || []
    },
    participantsTotal() {
      const calcTotal = (data, count = 0) => {
        return data.reduce((prev, item) => {
          if (!item.disabled) prev++
          if (item.childrenList) prev = calcTotal(item.childrenList, prev)
          return prev
        }, count)
      }

      return calcTotal(this.participantsOption)
    },
    isCheckAll() {
      return this.participantsTotal !== 0 && this.participantsSelected.length === this.participantsTotal
    },
  },

  watch: {
    'formData.liveBroadcastType': async function (value, oldValue) {
      // FIXME 当选择了级联的子集，清空它的options，会抛出错误，初步判断是element ui的bug
      // FIXME 当多个直播方式选项时，从编辑进入，切换一次直播方式，然后点重置，会导致级联选中被清空
      if (oldValue) {
        this.formData.speaker = []
        this.formData.participants = []
      }

      await this.getBrandAreaShopTree()
    },
    filterText(value) {
      this.$refs.tree.filter(value)
    },
  },

  created() {
    const params = this.$route.params
    this.item = params.item

    this.isEdit = this.item !== undefined
    this.isEdit && this.setFormData(this.item)

    this.getLiveBroadcastType()
  },

  methods: {
    submitForm() {
      this.$refs.elForm.validate(async (valid) => {
        if (!valid) return

        const upload = this.$refs.upload
        if (upload.uploadFiles.some(item => item.status === 'ready')) {
          return upload.submit()
        }
        else if (!upload.checkUploadDone()) {
          return this.$message.warning('请等待全部文件上传成功后继续！')
        }

        await addOrUpLiveBroadcastRoom(this.getFormData())
        this.$message.success('保存成功!')
        this.$router.back()
      })
    },
    getFormData() {
      const formData = Object.assign({}, this.formData)

      // 时间
      const time = formData.time || []
      delete formData.time
      formData.startTime = time[0]
      formData.endTime = time[1]

      // 主讲人
      const speaker = this.$refs.speaker.getCheckedNodes()
      if (speaker[0]) {
        formData.speakerType = speaker[0].data.isShop
      }

      // 参与人
      const participants = this.$refs.tree.getCheckedNodes()
      formData.participants = participants.map(data => ({
        participantId: data.id,
        participantType: data.isShop,
      }))

      // 资源附件
      // formData['resources'] = this.$refs.upload.uploadFiles.map(item => {
      //   return {
      //     fileName: item.name,
      //     url: item.response ? item.response.data.fileUrl : item.url,
      //     imageList: item.imageList,
      //   }
      // })
      console.log(this.$refs.upload.getUploadResults())
      formData.resources = this.$refs.upload.getUploadResults()

      return formData
    },
    setFormData(data) {
      const getFieldValue = (key) => {
        switch (key) {
          case 'time':
            return [data.startTime, data.endTime]
          case 'participants': {
            const participantIds = data[key].map((item) => {
              this.participantsSelected.push(item)
              return item.participantId
            })
            this.$nextTick(() => this.$refs.tree.setCheckedKeys(participantIds))
            return participantIds
          }
          case 'liveBroadcastType':
            return data[key] = String(data.liveBroadcastType)
          default:
            return data[key]
        }
      }

      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = getFieldValue(key)
      })

      this.formData.roomId = String(data.roomId)
    },
    resetForm() {
      this.$refs.elForm.resetFields()
      this.$refs.tree.setCheckedKeys(this.formData.participants)
    },
    async getBrandAreaShopTree() {
      const { liveBroadcastType } = this.formData

      // 数据已存在或未选择则返回
      if (!liveBroadcastType || this.areaShopOptions[liveBroadcastType]) return

      const res = await getBrandAreaShopTree(liveBroadcastType)

      this.$set(
        this.areaShopOptions,
        liveBroadcastType,
        {
          // 深拷贝避免对象被覆盖
          [ABILITY.SPEAKER]:
            JSON.parse(JSON.stringify(res.body.orgList))
              .filter(item => this.filterAreaOrShopData(item, ABILITY.SPEAKER)),
          [ABILITY.PARTICIPANTS]:
            JSON.parse(JSON.stringify(res.body.orgList))
              .filter(item => this.filterAreaOrShopData(item, ABILITY.PARTICIPANTS)),
        },
      )
    },
    /**
     * 过滤区域/店铺数据
     * @param item
     * @param ability 能力 1:主讲 2:参与者
     * @return {boolean}
     */
    filterAreaOrShopData(item, ability) {
      let hasChild = !!item.childrenList

      if (hasChild) {
        item.childrenList = item.childrenList.filter(item => this.filterAreaOrShopData(item, ability))
        hasChild = item.childrenList.length > 0
      }

      const hasAbility = item.abilityIndexs ? item.abilityIndexs.includes(ability) : false

      return hasChild || (hasAbility && !item.disabled)
    },
    async getLiveBroadcastType() {
      const res = await getLiveBroadcastType()
      this.liveBroadcastTypeOptions = res.body.resultList
      if (!this.isEdit) this.formData.liveBroadcastType = this.liveBroadcastTypeOptions[0].typeValue
    },
    pptToPicture({ data }, file, fileList) {
      const upload = this.$refs.upload

      // 获取到当前文件的element
      const uploadListEl = upload.$el.querySelector('.el-upload-list').__vue__.children
      const itemEl = uploadListEl.find(item => file.uid === item.key)

      // 转换成图片提示
      file.status = 'transform'
      const label = document.createElement('label')
      label.classList.add('label--transform')
      label.innerHTML = '正在转换到图片...<i class="el-icon-loading"></i>'
      itemEl.elm.appendChild(label)

      pptToPicture({
        userId: sessionStorage.userId,
        orgId: sessionStorage.brandId,
        pptFilePath: data.fileUrl,
      })
        .then((res) => {
          // 为空则表示转换失败
          // eslint-disable-next-line prefer-promise-reject-errors
          if (res.body.imageList.length === 0) return Promise.reject()

          file.status = 'success'
          file._data = {
            imageList: res.body.imageList,
          }
          if (upload.checkUploadDone()) {
            this.submitForm()
          }
        })
        .catch(() => {
          const index = fileList.indexOf(file)
          fileList.splice(index, 1)
          this.$message.error(`${file.name} 转换到图片失败！`)
        })
        .finally(() => label.remove())
    },
    switchCheckAll() {
      if (this.isCheckAll) {
        this.$refs.tree.setCheckedKeys([])
      }
      else {
        const selectItem = (data, array = []) => {
          return data.reduce((prev, item) => {
            !item.disabled && prev.push(item.id)
            if (item.childrenList) {
              selectItem(item.childrenList, prev)
            }
            return prev
          }, array)
        }
        this.$refs.tree.setCheckedKeys(selectItem(this.participantsOption))
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.osName.includes(value)
    },
    checkChange(item) {
      if (this.participantsSelected.includes(item)) {
        this.participantsSelected.splice(this.participantsSelected.indexOf(item), 1)
      }
      else {
        this.participantsSelected.push(item)
      }
    },
  },
}
</script>

<template>
  <page-container back-top>
    <page-header :content="`${isEdit ? '编辑' : '新增'}房间`" />
    <div class="flex">
      <el-form
        ref="elForm"
        class="page-form"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <div class="pb-2">
          基本信息
        </div>
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="formData.roomName" clearable placeholder="请输入房间名称" />
        </el-form-item>
        <el-form-item label="日期" prop="time">
          <el-date-picker
            v-model="formData.time" clearable end-placeholder="结束日期" format="yyyy/MM/dd HH:mm:ss"
            range-separator="-" start-placeholder="开始日期" type="datetimerange" value-format="yyyy/MM/dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="直播方式" prop="liveBroadcastType">
          <el-select ref="liveBroadcastType" v-model="formData.liveBroadcastType" clearable placeholder="请选择直播方式">
            <el-option
              v-for="item in liveBroadcastTypeOptions"
              :key="item.typeValue"
              :label="item.typeName"
              :value="item.typeValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主讲" prop="speaker">
          <el-cascader
            ref="speaker"
            v-model="formData.speaker"
            :disabled="!hasLiveBroadcastType"
            :options="areaShopOptions[formData.liveBroadcastType] && areaShopOptions[formData.liveBroadcastType][ABILITY.SPEAKER]"
            :placeholder="hasLiveBroadcastType ? '请选择主讲店铺/部门' : '请先选择直播方式'"
            :props="speakerProps"
            clearable
          />
        </el-form-item>
        <!--        <el-form-item label="参与者" prop="participants"> -->
        <!--          <el-cascader -->
        <!--            v-model="formData.participants" -->
        <!--            ref="participants" -->
        <!--            :disabled="!hasLiveBroadcastType" -->
        <!--            :options="areaShopOptions[formData.liveBroadcastType] && areaShopOptions[formData.liveBroadcastType][ABILITY.PARTICIPANTS]" -->
        <!--            :placeholder="hasLiveBroadcastType ? '请选择参与者' : '请先选择直播方式'" -->
        <!--            :props="participantsProps" -->
        <!--            clearable -->
        <!--          ></el-cascader> -->
        <!--        </el-form-item> -->
        <el-form-item label="附件" prop="resources">
          <vc-upload v-bind="uploadOption" ref="upload">
            <el-button size="small" type="primary">
              点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传ppt/pptx文件，且不超过20MB
            </div>
          </vc-upload>
        </el-form-item>
        <el-form-item size="large">
          <el-button icon="el-icon-check" type="primary" @click="submitForm">
            保存
          </el-button>
          <el-button icon="el-icon-refresh-left" @click="resetForm">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <div class="flex-1 px-1 lg:pl-2" style="min-width: 200px;">
        <div class="pb-2">
          参与者
        </div>
        <div class="flex pb-2">
          <el-checkbox
            class="px-2"
            :value="isCheckAll"
            border
            @click.native.prevent="switchCheckAll"
          >
            全选
          </el-checkbox>
          <el-input
            v-model="filterText"
            placeholder="搜索店铺数据"
            clearable
          />
        </div>
        <el-tree
          ref="tree"
          :data="participantsOption"
          :props="participantsTreeProps"
          :filter-node-method="filterNode"
          node-key="id"
          show-checkbox
          default-expand-all
          check-strictly
          check-on-click-node
          @check-change="checkChange"
        />
      </div>
    </div>
  </page-container>
</template>

<style lang="less" scoped>
.page-container {
  /deep/ .el-upload {
    .el-upload__tip {
      line-height: 1.2;
    }
  }

  /deep/ .el-upload-list .is-transform {
    .label--transform {
      display: inline-block;
      transform: translateX(-20px);
      position: absolute;
      right: 5px;
      top: 0;
      line-height: inherit;
    }
  }
}
</style>
