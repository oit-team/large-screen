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
    <ElButton @click="$router.back()">
      返回
    </ElButton>
    {{ message }}123
    <ElButton @click="test()">
      测试legacy
    </ElButton>
    <ElButton @click="$router.push('/home')">
      home
    </ElButton>
  </div>
</template>
