<template>
  <div class="avatar" :style="{'background-color': background}">
    {{shortName}}
  </div>
</template>

<script>

  import Avatar from './Avatar.js';

  export default Avatar;

</script>

<style lang="less" scoped>
  @import './Avatar.less';
</style>
