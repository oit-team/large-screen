<template>
  <div id="legacy">
    <keep-alive>
      <transition v-if="$route.meta?.keepAlive" name="el-fade-in" mode="out-in">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </keep-alive>
    <transition v-if="!$route.meta?.keepAlive" name="el-fade-in" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style>
#legacy {
  height: 100%;
}
</style>
