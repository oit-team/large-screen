<template>
  <div id="legacy">
    <!-- <Transition name="el-fade-in" mode="out-in"> -->
    <KeepAlive>
      <RouterView />
    </KeepAlive>
    <!-- </Transition> -->
  </div>
</template>

<style>
#legacy {
  height: 100%;
}
</style>
