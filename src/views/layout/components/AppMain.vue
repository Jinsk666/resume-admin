<template>
  <section class="app-main">
    <div id="container">
            <div id="selectfiles" class="btn-op borderright">
				换图
			</div>
			<div id="ossfile1"></div>
			<a style="display: none" id="postfiles1" href="javascript:void(0);" onclick="apply(18);"></a>
			<a style="display: none" id="callback" href="javascript:void(0);" onclick="callback();"></a>
			<input type="hidden" id="commentFileUrl" name="commentFileUrl" />
      </div>
    <transition name="fade" mode="out-in">
      <!-- <keep-alive> -->
        <router-view :key="key"></router-view>
      <!-- </keep-alive> -->
      <!-- <router-view></router-view> -->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 110px);
  position: relative;
  overflow: hidden;
}
#selectfiles {
  display: none;
}
</style>
