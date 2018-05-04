<template>
  <div class="screenfull">
    <i :class="iconClass" @click='click'></i>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  computed: {
    iconClass() {
      const iconClass = !this.isFullscreen ? 'el-icon-render-quanping' : 'el-icon-render-quxiaoquanping'
      return iconClass
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
      this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>

<style scoped>
.screenfull {
  display: inline-block;
  cursor: pointer;
  color: #fff;
  fill: #fff;
  font-size: 24px;
  vertical-align: 10px;
}
</style>
