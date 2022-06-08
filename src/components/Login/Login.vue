<template>
  <div class="login-container">
    <div class="main">
      <header class="header">登录</header>
      <div class="login-form">
        <group label-width="4.5em" label-margin-right="2em" label-align="left">
          <x-input v-model="username" title="用户名" placeholder="请输入用户名"></x-input>
          <x-input v-model="appID" title="房间号" placeholder="请输入房间号"></x-input>
          <x-button type="default" text="登录" @click.native="login"></x-button>
        </group>
      </div>
    </div>
  </div>
</template>

<script>

import Login from './Login.js';

export default Login;

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import './Login.less';
</style>
