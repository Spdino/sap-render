<template>
  <div class="app-wrapper" :class="{hideSidebar:opened}">
    <header class="header">
      <router-link class="logo" to="/" tag="h3">Regentsoft</router-link>
      <!-- 主菜单模块 -->

      <div class="main-menu" @click="toggleClick">
        <i class="el-icon-render-shouqi"></i>
      </div>

      <div class="application-wrap">
        <!-- 全屏 -->
        <el-tooltip effect="dark" content="全屏" placement="bottom">
          <screenfull class="screenfull right-menu-item"></screenfull>
        </el-tooltip>

        <!-- 个人 -->
        <el-dropdown trigger="click">
          <div class="avatar-wrapper">
            <div class="avatar">
              <img :src="avatar" alt="" style="width:100%;height:100%">
            </div>
            <p>{{name}}</p>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <router-link class="inlineBlock" to="/">
              <el-dropdown-item>
                回到首页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'

export default {
  name: 'home',
  data(){
    return {
      activeIndex:'0',
      opened: true
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },
   methods: {
    toggleClick(){
      this.opened = !this.opened
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  },
  components:{
    Screenfull
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
.header {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 52px;
  z-index: 10;
  background: #1f467f;

  .el-menu--horizontal {
    border-bottom: 0;

    .el-menu-item {
      height: 46px;
      line-height: 48px;
    }
  }
}

.main-menu {
  margin-left: 40px;
  flex: 1 0 auto;
  display: inline-block;
  cursor: pointer;
  color: #fff;
  fill: #fff;
  font-size: 24px;
  vertical-align: 10px;
}

.application-wrap {
  margin-right: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #fff;
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    margin-right: 10px;
    background: rgba(216, 216, 216, 1);
    overflow: hidden;
  }
}

.right-menu-item {
  margin-right: 20px;
  color: #fff;
}

.logo {
  margin: 0;
  text-align: center;
  line-height: 52px;
  width: 165px;
  height: 100%;
  background: rgba(2, 49, 97, 1);
  color: #fff;
}
</style>
<style>
.header .el-color-picker__trigger {
  border: none;
}
</style>

