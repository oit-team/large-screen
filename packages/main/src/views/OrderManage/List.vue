<script>
export default {
  name: 'OrderManageList',
  data: () => ({
    data: {}, // 列表数据
  }),
  computed: {
    tablePageOption() {
      return {
        promise: this.loadDate,
        // action: [],
      }
    },
  },
}
</script>

<template>
  <div class="h-full p-2">
    <!-- order : 1685523826849 -->
    <!-- <TablePage v-bind="tablePageOption" ref="table" field-key="1669627381942" auto /> -->
  </div>
</template>

<style lang='scss' scoped>

</style>
