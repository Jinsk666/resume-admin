<template>
  <div class="app-wrapper" :class="classObj">
    <div id="header">
        <div class="header-left left">
            <img src="@/assets/images/header-left.png" alt="">
        </div>
        <div class="header-right right">
            <el-dropdown class="main-dropdown" trigger="click">
                <span class="el-dropdown-link">
                    {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <router-link :to="{name: 'factory'}">
                        <span style="display:block;">企业信息</span>
                      </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <span @click="logout" style="display:block;">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span class="icon-admin">
                <img src="~@/assets/images/login/icon-user.png" alt="user">
            </span>
        </div>
    </div>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main>
      </app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    username() {
      return this.$store.state.user.username
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    token() {
      return this.$store.state.user.token
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  #header {
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 60px;
    background: $color;
    overflow: hidden;
    z-index: 1002;
    .header-left {
        line-height: 60px;
        padding-left: 20px;
    }
    .header-right {
        margin: 12px 20px 0 0;
    }
    .main-dropdown {
        position: relative;
        top: 2px;
        cursor: pointer;
    }
    .icon-admin {
      display: inline-block;
      width: 32px;
    }
}
</style>
