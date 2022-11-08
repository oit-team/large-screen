<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data: () => ({
    message: 'Hello World!',
  }),
  methods: {
    test() {
      this.$message(this.message)
      this.$router.push('/test')
    },
  },
})
</script>

<template>
  <div>
    {{ message }}
    <ElButton @click="test()">
      测试
    </ElButton>
  </div>
</template>
