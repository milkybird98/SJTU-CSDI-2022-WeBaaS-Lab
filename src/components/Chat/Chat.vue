<template>
  <div class="container">

    <div class="header">
      {{ /* 头部内容 */ }}
      <x-header :left-options="{ showBack: true, preventGoBack: true, backText: '退出登录' }"
        :right-options="{ showMore: true }" @on-click-back="logout" @on-click-more="showMenus = true">
        {{ talkingTo === -1 ? '群聊' : people[talkingTo].label }}
      </x-header>

      {{ /* 聊天标签页切换 */ }}
      <tab :line-width="0">
        <tab-item active-class="active-1" @on-item-click="talkToThis(-1)" selected>
          {{ user.roomID }}
        </tab-item>
        <template v-for="(personIndex, index) in talkToPeople">
          <tab-item active-class="active-1" @on-item-click="talkToThis(personIndex)"
            :selected="talkingTo === personIndex ? true : false">
            {{ people[personIndex].label }}
          </tab-item>
        </template>
      </tab>
    </div>

    {{ /* 聊天标签页聊天记录(私聊) */ }}
    <template v-for="(personIndex, index) in talkToPeople">
      <div class="chat-container" v-if="talkingTo === personIndex">
        <private-chat :user="user" :records="people[personIndex].msgs"></private-chat>
      </div>
    </template>

    {{ /* 聊天标签页聊天记录(群聊) */ }}
    <div class="chat-container" v-if="talkingTo === -1">
      <group-chat :user="user" :records="records"></group-chat>
    </div>

    {{ /* 选择聊天室里的人 */ }}
    <div v-transfer-dom>
      <popup v-model="showMenus">
        <div class="popup0">
          <actionsheet @on-click-menu="choosePerson" v-model="showMenus" :menus="people" show-cancel></actionsheet>
        </div>
      </popup>
    </div>

    {{ /* 聊天记录底部 */ }}
    <divider>我是有底线的</divider>

    {{ /* 替代置底输入框的block */ }}
    <div class="replace-block"></div>
    {{ /* 置底输入框 */ }}
    <div class="bottom-input">
      <div class="input-1">
        <input class="input" v-model="message" placeholder="输入..." style="color: #fff"/>
      </div>
      <div class="button-1">
        <x-button mini class="button" type="default" @click.native="sendMsg">
          <link rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
          <span class="material-symbols-outlined">
            send
          </span>
        </x-button>
      </div>
    </div>
  </div>
</template>

<script>

import Chat from './Chat.js';

export default Chat;

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import './Chat.less';
</style>
