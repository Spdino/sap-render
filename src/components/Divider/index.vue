<template>
  <div class="divider" @click="change">
    <i :class="[dividerType ? 'el-icon-caret-top' : 'el-icon-caret-bottom']"></i>
    <span class="text">{{dividerType ? dividerText[0] : dividerText[1]}}</span>
  </div>
</template>

<script>
export default {
  name: 'svg-icon',
  props: {
    dividerType: {
      type: Boolean,
      default: false
    },
    dividerText: {
      type: Array,
      default: () => ['收起', '展开']
    }
  },
  methods: {
    change() {
      this.$emit('dividerChange', this.dividerType)
    }
  }
}
</script>

<style scoped  lang="scss">
@import 'src/styles/variables.scss';
.divider {
  box-sizing: border-box;
  text-align: center;
  color: #d3dce6;
  cursor: pointer;
  background: rgba(238, 241, 246, 1);
  height: 26px;
  position: relative;
  margin: 0 -22px;

  i {
    padding-top: 4px;
    font-size: 16px;
    transition: 0.3s;
    transform: translateX(0px);
    background: rgba(238, 241, 246, 1);
  }

  &:hover {
    color: $basic;

    i {
      transform: translateX(-40px);
    }
    .text {
      opacity: 1;
      transform: translateX(-30px);
    }
  }
  .text {
    position: absolute;
    top: 4px;
    opacity: 0;
    transform: translateX(0);
    font-size: 14px;
    transition: 0.3s;
    background: rgba(238, 241, 246, 1);
  }
}
</style>
