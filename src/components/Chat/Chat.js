import {
  Divider,
  Actionsheet,
  XHeader,
  TransferDom,
  Popup,
  Tab,
  TabItem,
  Tabbar,
  TabbarItem,
  XButton,
  XInput,
  Grid,
  GridItem,
  Group,
} from 'vux';
import {
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';

import GroupChat from '../GroupChat';
import PrivateChat from '../PrivateChat';
import { logout } from '../../api/api';
import * as serverapi from '../../api/serverapi';

// const socket = null;

export default {
  name: 'Chat',
  directives: {
    TransferDom,
  },
  components: {
    Divider,
    Actionsheet,
    XHeader,
    Popup,
    Tab,
    TabItem,
    Tabbar,
    TabbarItem,
    XButton,
    XInput,
    Grid,
    GridItem,
    Group,
    GroupChat,
    PrivateChat,
  },
  data() {
    return {
      showMenus: false,
      message: '',
    };
  },
  mounted() {
    // const socket = window.io('/');
    const that = this;
    // 告诉socket server该用户登录的动作
    // let time = moment().format('YYYY/MM/DD HH:mm:ss');
    // let ctx = window.ctx;

    // socket.emit('login', {
    //   time,
    // });
    // 监听socket server其他用户登录的消息
    // socket.on('someOneLogin', ({ user, msg }) => {
    //   that.addPeople({
    //     label: user.username,
    //     value: user.sessionId,
    //     msgs: [],
    //   });
    //   that.addRecord({
    //     username: '',
    //     sessionId: '',
    //     tip: true,
    //     msg,
    //     time,
    //   });
    //   console.log(msg);

    // 监听socket server 其他用户退出的消息
    // socket.on('quit', (data) => {
    //   that.addRecord({
    //     username: '',
    //     sessionId: '',
    //     tip: true,
    //     msg: data.msg,
    //     time: data.time,
    //   });
    // });
    // 监听socket server 的广播

    // socket.on('broadcast', (data) => {
    //   if (data.user.sessionId !== that.user.sessionId) {
    //     that.addRecord({
    //       username: data.user.username,
    //       sessionId: data.user.sessionId,
    //       msg: data.msg,
    //       time: data.time,
    //     });
    //   }
    // });
    // 监听私聊信息
    // socket.on('private', (data) => {
    //   console.log(data);
    //   for (let i = 0; i < this.people.length; i += 1) {
    //     if (this.people[i].value === data.user.sessionId) {
    //       this.addPrivateRecord(
    //         {
    //           privateGroupIndex: i,
    //           sessionId: data.user.sessionId,
    //           username: data.user.username,
    //           msg: data.msg,
    //           time: data.time,
    //         });
    //     }
    //   }
    // });
    // 聊天室成员
    serverapi.setupChatroomStatusSocket(that);
    this.getOthers()
      .then(() => {
        console.log('getOthers fin');
        this.getRecords()
          .then(() => {
            serverapi.setupChatPeopleSocket(that.addRecord);
            serverapi.wsHeartBeat();
          });
      });
    this.getUser();
  },
  computed: {
    ...mapGetters([
      'people',
      'talkingTo',
      'talkToPeople',
      'records',
      'user',
    ]),
  },
  methods: {
    ...mapActions([
      'getOthers',
      'setTalkingTo',
      'addTalkToPeople',
      'addPeople',
      'addRecord',
      'getRecords',
      'getUser',
      'addPrivateRecord',
    ]),
    sendMsg() {
      const that = this;
      let time = moment().format('YYYY/MM/DD HH:mm:ss');
      if (this.message.trim() !== '') {
        serverapi.sendMsg(this.message, (data) => {
          that.addRecord({
            username: data.userName,
            sessionId: data.userID,
            tip: false,
            msg: this.message,
            time,
          });
        });
      }
    },
    talkToThis(index) {
      this.setTalkingTo(index);
    },
    choosePerson(value) {
      for (let i = 0; i < this.people.length; i += 1) {
        if (this.people[i].value === value) {
          if (this.talkToPeople.includes(i)) {
            this.setTalkingTo(i);
          } else {
            this.addTalkToPeople(i);
            this.setTalkingTo(i);
          }
          break;
        }
      }
    },
    logout() {
      const that = this;
      this.$vux.confirm.show({
        title: '确定要退出聊天室吗？',
        onConfirm() {
          logout(that);
        },
      });
    },
  },
};
