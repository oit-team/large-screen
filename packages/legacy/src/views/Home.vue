<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    message: 'Hello World!!!',
  }),
  methods: {
    test() {
      this.$message(this.message)
    },
  },
})
</script>

<template>
  <div>
    <el-button @click="$router.back()">
      返回
    </el-button>
    {{ message }}123
    <el-button @click="test()">
      测试legacy
    </el-button>
    <el-button @click="$router.push('/home')">
      home
    </el-button>
  </div>
</template>
