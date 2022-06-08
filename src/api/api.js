import moment from 'moment';
import * as request from './request';
import * as apiserver from './serverapi';

// const protoRoot = require('../proto/proto.js');

// const ChatMessage = protoRoot.lookup('chatroom.ChatMessage');
// const ChatPerson = protoRoot.lookup('chatroom.ChatPerson');
// const Chatroom = protoRoot.lookup('chatroom.ChatroomStatus');

/**
 * 检查登录状态
 *
 * @param {func} to
 * @param {func} from
 * @param {func} next
 * @param {string} [loginNextRoute=''] 已登录的跳转链接
 * @param {string} [logoutNextRoute=''] 未登录的跳转链接
 * @param {string} [ErrorNextRoute=''] 异步请求客户端错误跳转链接
 */
export function checkLogin(to, from, next, loginNextRoute = '', logoutNextRoute = '') {
  console.log(window.ctx.appID);
  if (window.ctx.appID !== 'deadbeaf') {
    loginNextRoute === '' ? next() : next(loginNextRoute);
  } else {
    logoutNextRoute === '' ? next() : next(logoutNextRoute);
  }
}

/**
 * 登录
 *
 * @export function
 * @param {object} vueInstance vuejs的实例
 * @param {string} username 用户名
 * @param {string} appID 房间号
 */
export function login(vueInstance, username, appID) {
  // axios.get('api/login', {
  //   params: {
  //     username,
  //     appID,
  //   },
  // })
  //   .then(({ data }) => {
  //     console.log(data);
  //     if (parseInt(data.code, 10) === 200) {
  //       vueInstance.$router.push('/chat');
  //     } else {
  //       vueInstance.$vux.alert.show({
  //         title: data.msg,
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  apiserver.login(username, appID, (data) => {
    console.log('Login Callback', data);
    data = JSON.parse(data);
    if (parseInt(data.code, 10) === 200) {
      vueInstance.$router.push('/chat');
    } else {
      vueInstance.$vux.alert.show({
        title: data.msg,
      });
    }
  });
}

/**
 * 退出登录
 *
 * @export function
 * @param {object} vueInstance vuejs的实例
 */
export function logout(vueInstance) {
  vueInstance.$router.push('/login');
  // axios.get('/api/logout')
  //   .then(({ data }) => {
  //     // console.log(data);
  //     if (parseInt(data.code, 10) === 200) {
  //       vueInstance.$router.push('/login');
  //     } else {
  //       vueInstance.$vux.alert.show({
  //         title: data.msg,
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     console.log(vueInstance);
  //     vueInstance.$vux.alert.show({
  //       title: err,
  //     });
  //   });
}

/**
 * 取得在线人的列表
 *
 * @export function
 */
export async function getOthers(cb, errorCb) {
  return apiserver.getOthers(cb, errorCb);
}

/**
 * 得到所有群聊聊天记录
 *
 * @export
 * @param {function} cb
 * @param {function} errorCb
 */
export async function getRecords(cb, errorCb) {
  console.log('getRecords');
  let ctx = window.ctx;

  let msgList = [];
  let msgUUIDList = [];
  ctx.chatPeopleList.forEach((person) => {
    let msgNum = parseInt(person.msgNum, 10);
    for (let msgIndex = 0; msgIndex < msgNum; msgIndex += 1) {
      msgUUIDList.push(person.preUUID + msgIndex.toString());
    }
  });

  return Promise.all(msgUUIDList.map(msgUUID => request.queryMessage(ctx.appID, msgUUID)
    .then((res) => {
      console.log('getRecords: queryMessage:', res);
      msgList.push({
        time: parseInt(window.atob(res.data.date), 10),
        content: res.data.content,
        userID: res.data.userID,
      });
    })))
    .then(() => {
      msgList.sort((a, b) => (a.time - b.time));
      let msgData = msgList.map(msg => ({
        username: ctx.chatPeopleList[parseInt(msg.userID, 10)].userName,
        sessionId: msg.userID,
        msg: msg.content,
        time: moment(msg.time * 1000).format('YYYY/MM/DD HH:mm:ss'),
      }));

      cb(msgData);
      console.log('getRecords fin');
    })
    .catch((err) => {
      errorCb(err);
    });

  // axios.get('/api/records')
  //   .then(({ data }) => {
  //     if (parseInt(data.code, 10) === 200) {
  //       cb(data.data);
  //     } else {
  //       console.log(data.msg);
  //     }
  //   })
  //   .catch((err) => {
  //     errorCb(err);
  //   });
}

export function getUser(cb, errorCb) {
  let ctx = window.ctx;
  console.log('getUser: ', ctx);

  request.queryPerson(ctx.appID, ctx.myselfID)
    .then((res) => {
      console.log('getUser: queryPerson:', res);
      if (parseInt(res.status, 10) === 200) {
        cb({ sessionId: ctx.myselfID, username: res.data.userName, roomID: ctx.appID });
      }
    })
    .catch((err) => {
      errorCb(err);
    });
  // axios.get('/api/user')
  //   .then(({ data }) => {
  //     if (parseInt(data.code, 10) === 200) {
  //       cb(data.data);
  //     } else {
  //       console.log(data.msg);
  //     }
  //   })
  //   .catch((err) => {
  //     errorCb(err);
  //   });
}
