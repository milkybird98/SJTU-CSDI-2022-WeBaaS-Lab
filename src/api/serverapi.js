import crypto from 'crypto';
import moment from 'moment';
import * as DBrequest from './request';

const protoRoot = require('../../src/proto/proto');

const ChatPerson = protoRoot.lookup('chatroom.ChatPerson');
// const ChatMessage = protoRoot.lookup('chatroom.ChatMessage');
const Chatroom = protoRoot.lookup('chatroom.ChatroomStatus');
const ChatMessage = protoRoot.lookup('chatroom.ChatMessage');

function toBase64(num) {
  return Buffer.from(num.toString()).toString('base64');
}

function createRoom(username, cb) {
  console.log('Creating chatroom');
  const ctx = window.ctx;
  let appName = `test${String(Math.floor(Math.random() * 10000))}`;
  DBrequest.registerApp(appName)
    .then((res0) => {
      console.log('createRoom registerApp: ', res0);
      ctx.appID = res0.appID;
      ctx.peopleNum = 0;
      ctx.myselfID = 0;
      ctx.chatPeopleList = [];
      ctx.othersDataCache = [];
      ctx.peopleSocket = undefined;
      ctx.peopleNotifyID = undefined;

      let protoVersion = 1;
      let personID = 0;
      let fakeRoomStatus = Chatroom.create({ roomID: '1', peopleNum: String(1) });
      let roomStatus = Chatroom.create({ roomID: '0', peopleNum: String(1) });
      let uuid = crypto.randomBytes(16).toString('hex');
      let person = ChatPerson.create({
        userID: personID.toString(),
        userName: username,
        avatar: String(555),
        preUUID: uuid,
        msgNum: '0',
      });

      DBrequest.uploadSchema(ctx.appID, protoVersion)
        .then(() => {
          DBrequest.updateSchema(ctx.appID, protoVersion)
            .then(() => {
              DBrequest.updateChatroom(ctx.appID, fakeRoomStatus)
                .then((_res) => { console.log('createChatroom: updateChatroom:', _res); });
              DBrequest.createTransaction()
                .then((res) => {
                  console.log('createChatroom createTransaction', res);
                  let transactionID = res.transactionID;

                  Promise.all([
                    DBrequest.updateChatroomStatusInTransaction(
                      ctx.appID,
                      roomStatus,
                      transactionID),
                    DBrequest.updateChatPersonInTransaction(
                      ctx.appID,
                      person,
                      transactionID)])
                    .then((...a) => {
                      console.log('createChatroom updateChatPerson', a);
                      DBrequest.commitTransaction(transactionID)
                        .then(() => {
                          ctx.peopleNum = 1;
                          ctx.chatPeopleList[ctx.myselfID] = person;
                          cb();
                        });
                    });
                });
            });
        });
    });
  return ctx.appID;
}

function enterRoom(username, appID, cb) {
  console.log('enterRoom', username, appID);
  const ctx = window.ctx;

  DBrequest.createTransaction()
    .then((res) => {
      ctx.appID = appID;
      ctx.peopleNum = 0;
      ctx.myselfID = 0;
      ctx.chatPeopleList = [];
      ctx.othersDataCache = [];
      ctx.peopleSocket = undefined;
      ctx.peopleNotifyID = undefined;
      console.log('enterRoom', res);
      let transactionID = res.transactionID;

      DBrequest.queryChatroomStatusInTransaction(appID, '0', transactionID)
        .then((res1) => {
          console.log('enterRoom: queryChatroomStatusInTransaction:', res1);
          let roomStatusOld = res1.data;

          let uuid = crypto.randomBytes(16).toString('hex');
          let personID = parseInt(roomStatusOld.peopleNum, 10);
          let person = ChatPerson.create({
            userID: personID.toString(),
            userName: username,
            avatar: String(555),
            preUUID: uuid,
            msgNum: '0',
          });

          let newpeopleNum = parseInt(roomStatusOld.peopleNum, 10) + 1;

          let roomStatus = Chatroom.create({
            roomID: roomStatusOld.roomID,
            peopleNum: newpeopleNum.toString(),
          });

          Promise.all([
            DBrequest.updateChatroomStatusInTransaction(
              appID,
              roomStatus,
              transactionID),
            DBrequest.updateChatPersonInTransaction(
              appID,
              person,
              transactionID)])
            .then((...a) => {
              console.log(
                'enterRoom: updateChatroomStatusInTransaction&updateChatPersonInTransaction: ', a);

              DBrequest.commitTransaction(transactionID)
                .then(() => {
                  ctx.appID = appID;
                  ctx.peopleNum = newpeopleNum;
                  ctx.myselfID = personID;
                  ctx.chatPeopleList[ctx.myselfID] = person;
                  cb();
                });
            });
        });
    });
}

function addUser(username, appID, cb) {
  console.log('addUser');
  DBrequest.queryChatroom(appID, String(0))
    .then((res) => {
      if (res.status !== 200) {
        console.log('addUser: Room Not Found');
        createRoom(username, cb);
      } else enterRoom(username, appID, cb);
    });
}

/**
 * Login
 * @param {string} username Username
 * @param {string} appID application ID
 * @returns JSON {msg, code}
 */
export function login(username, appID, cb) {
  if (username && appID) {
    addUser(username, appID, () => {
      console.log('Login Success');

      cb(JSON.stringify({
        msg: 'success',
        code: '200',
      }));
    });
  } else {
    cb(JSON.stringify({
      msg: 'username/room ID is required',
      code: '201',
    }));
  }
}

export function logout() {
  console.log('logout');
}

export function getOthers(cb, errorCb) {
  let ctx = window.ctx;
  console.log('getOthers');
  let newChatPeopleList = [];

  return DBrequest.queryChatroom(ctx.appID, '0')
    .then((res) => {
      console.log('getOthers: queryChatroom: ', res);
      let peopleProHandle;
      if (parseInt(res.status, 10) === 200) {
        if (ctx.othersDataCache === undefined || ctx.othersDataCache.length === 0) {
          let peopleIDList = [];

          console.log('getOthers: peopleNum: ', parseInt(res.data.peopleNum, 10));
          while (parseInt(res.data.peopleNum, 10) > newChatPeopleList.length) {
            newChatPeopleList.push(undefined);
          }

          for (let i = 0; i < parseInt(res.data.peopleNum, 10); i += 1) {
            peopleIDList.push(i.toString());
          }

          peopleProHandle = Promise.all(
            peopleIDList.map(userID => DBrequest.queryPerson(ctx.appID, userID)
              .then((_res) => {
                console.log('getOthers: queryPerson: ', _res);
                newChatPeopleList[parseInt(_res.data.userID, 10)] = _res.data;
              })))
            .then(() => {
              ctx.chatPeopleList = newChatPeopleList;
              ctx.peopleNum = ctx.chatPeopleList.length;
              ctx.othersDataCache = ctx.chatPeopleList.reduce((arr, people) => {
                if (parseInt(people.userID, 10) !== ctx.myselfID) {
                  arr.push({
                    username: people.userName,
                    sessionId: people.userID,
                  });
                }
                return arr;
              }, []);

              console.log('othersDataCache: ', ctx.othersDataCache);

              cb(ctx.othersDataCache);
            });
        } else {
          cb(ctx.othersDataCache);
        }
      }
      return peopleProHandle;
    })
    .catch((err) => {
      errorCb(err);
    });
}

export function sendMsg(msg, cb) {
  let ctx = window.ctx;
  let date = Math.floor(Date.now() / 1000);
  let appID = ctx.appID;
  let personID = ctx.myselfID;

  console.log('sendMsg', personID, msg);
  let person = ctx.chatPeopleList[personID];
  console.log('sendMsg person', person);
  let puuid = person.preUUID;
  let msgNum = person.msgNum;
  let message = ChatMessage.create({
    uuid: puuid + msgNum,
    userID: personID.toString(),
    content: msg,
    date: toBase64(date),
  });
  DBrequest.updateChatroomMessage(appID, message)
    .then((res0) => {
      console.log('sendMsg: UpdateChatroom', res0);
      person.msgNum = (parseInt(msgNum, 10) + 1).toString();
      console.log('sendMsg: updated person ', person);
      DBrequest.updatePerson(appID, person)
        .then((res1) => {
          console.log('sendMsg: updatePerson success', res1);
          ctx.chatPeopleList[personID] = person;
          cb(person);
        });
    });
}

let wsHeartBeatMap = [3, 3];

function handleSocket(notificationID, openCB, msgCB, closeCB, reconnectCB, hbIndex) {
  console.log('handleSocket');
  let ctx = window.ctx;
  let appID = ctx.appID;

  console.log('handleSocket: notificationID:', notificationID);
  let socket = DBrequest.setupNotification(appID, notificationID);

  function chackHeartBeat(originSocket,
    originNotificationID,
    originOpenCB,
    originMsgCB,
    originCloseCB,
    originreconnectCB,
    originHBIndex) {
    console.log('handleSocket: wsHeartBeatMap: ', wsHeartBeatMap);
    if (originreconnectCB !== undefined && reconnectCB(originNotificationID) === false) {
      console.log('handleSocket reconnect: skip');
      return;
    }

    if (wsHeartBeatMap[originHBIndex] > 0) {
      setTimeout(chackHeartBeat,
        3000, originSocket, originNotificationID,
        originOpenCB, originMsgCB, originCloseCB,
        originreconnectCB, originHBIndex);
      return;
    }

    wsHeartBeatMap[originHBIndex] = 10;

    console.log('handleSocket timeout: reconnect');

    originSocket.onclose = undefined;
    originSocket.close();

    handleSocket(
      originNotificationID,
      originOpenCB,
      originMsgCB,
      originCloseCB,
      originreconnectCB,
      originHBIndex);
  }

  setTimeout(chackHeartBeat,
    3000, socket, notificationID, openCB, msgCB, closeCB, reconnectCB, hbIndex);

  socket.onopen = () => {
    console.log('handleSocket open');
    if (openCB !== undefined) openCB(socket);

    function warp() {
      let originNotificationID = notificationID;
      let originOpenCB = openCB;
      let originMsgCB = msgCB;
      let originCloseCB = closeCB;
      let originreconnectCB = reconnectCB;

      return () => {
        if (originCloseCB !== undefined) { originCloseCB(); }
        console.log('handleSocket error');

        if (originreconnectCB !== undefined && reconnectCB(originNotificationID) === false) {
          console.log('handleSocket reconnect: skip');
          return;
        }

        console.log('handleSocket error: reconnect');
        handleSocket(
          originNotificationID,
          originOpenCB,
          originMsgCB,
          originCloseCB,
          originreconnectCB);
      };
    }

    let handleSocketClosure = warp();

    socket.onerror = handleSocketClosure;
  };

  socket.onmessage = (msg) => {
    console.log('handleSocket receive msg');
    if (msgCB !== undefined) msgCB(msg);
  };
}

export function setupChatPeopleSocket(cb) {
  console.log('setupChatPeopleSocket');
  let ctx = window.ctx;
  let appID = ctx.appID;
  let personIDList = ctx.chatPeopleList.map(person => person.userID);

  console.log('setupChatPeopleSocket personIDList:', personIDList);

  DBrequest.registerNotification(appID, 'chatroom.ChatPerson', personIDList)
    .then((res) => {
      console.log('registerNotification: registerNotification:', res);
      handleSocket(res.data.notificationID,
        (socket) => {
          let newNotifyID = res.data.notificationID;
          console.log('monitor ChatPerson success!');

          if (ctx.peopleNotifyID !== undefined && ctx.peopleNotifyID !== newNotifyID) {
            DBrequest.deleteNotification(appID, ctx.peopleNotifyID)
              .then((res1) => {
                console.log('setupChatPeopleSocket: deleteNotification: ', res1);
              });
          }

          if (ctx.peopleSocket !== undefined && ctx.peopleSocket.readyState <= WebSocket.OPEN) {
            console.log('handleSocket: close old socket');
            ctx.peopleSocket.close();
          }

          ctx.peopleSocket = socket;
          ctx.peopleNotifyID = newNotifyID;
        },
        (notifMsg) => {
          wsHeartBeatMap[0] = 10;
          let uint8array = new TextEncoder().encode(notifMsg.data);
          let decodedData = DBrequest.NotificationMessage.decode(uint8array);

          console.log('setupChatPeopleSocket: NotificationMessage:', decodedData);

          decodedData.recordKeys.forEach((userID) => {
            DBrequest.queryPerson(appID, userID)
              .then((res3) => {
                console.log('setupChatPeopleSocket: queryPerson:', res3);

                let numUserID = parseInt(userID, 10);
                if (numUserID !== ctx.myselfID) {
                  let msgPreUUIDArray = [];
                  let localMsgNum = parseInt(
                    ctx.chatPeopleList[numUserID].msgNum,
                    10);
                  for (let i = localMsgNum; i < parseInt(res3.data.msgNum, 10); i += 1) {
                    msgPreUUIDArray.push(res3.data.preUUID + i.toString());
                  }

                  Promise.all(msgPreUUIDArray.map(
                    uuid => DBrequest.queryMessage(appID, uuid)
                      .then((res4) => {
                        console.log('setupChatPeopleSocket: queryMessage:', res4);
                        let time = parseInt(window.atob(res4.data.date), 10);
                        cb({
                          username: res3.data.userName,
                          sessionId: res3.data.userID,
                          msg: res4.data.content,
                          time: moment(time * 1000).format('YYYY/MM/DD HH:mm:ss'),
                        });
                      })));
                }

                // 更新本地 person 信息
                ctx.chatPeopleList[numUserID] = res3.data;
              });
          });
        },
        () => {
          setupChatPeopleSocket(cb);
        },
        curNotifyID => curNotifyID === ctx.peopleNotifyID, 0);
    });
}

export function setupChatroomStatusSocket(that) {
  let ctx = window.ctx;
  let appID = ctx.appID;
  let time = moment().format('YYYY/MM/DD HH:mm:ss');

  DBrequest.registerNotification(appID, 'chatroom.ChatroomStatus', ['0'])
    .then((res0) => {
      console.log('setupChatroomStatusSocket: registerNotification:', res0);

      handleSocket(res0.notificationID,
        () => {
          console.log('monitor chatroot status success !');
        }, (msg) => {
          wsHeartBeatMap[1] = 10;

          let uint8array = new TextEncoder().encode(msg.data);
          let decodedData = DBrequest.NotificationMessage.decode(uint8array);

          console.log('setupChatroomStatusSocket: NotificationMessage:', decodedData);

          if (decodedData.recordKeys.includes('0') === false) return;

          DBrequest.queryChatroom(appID, '0')
            .then((res) => {
              console.log('setupChatroomStatusSocket: queryChatroom:', res);
              while (parseInt(res.data.peopleNum, 10) > ctx.chatPeopleList.length) {
                ctx.chatPeopleList.push(undefined);
              }

              let peopleIDList = [];
              for (let i = ctx.peopleNum; i < parseInt(res.data.peopleNum, 10); i += 1) {
                peopleIDList.push(i.toString());
              }

              if (peopleIDList.length === 0) {
                return;
              }

              ctx.othersDataCache.splice(0);

              Promise.all(peopleIDList.map(userID => DBrequest.queryPerson(ctx.appID, userID)
                .then((_res) => {
                  console.log('setupChatroomStatusSocket: queryPerson: ', _res);

                  ctx.chatPeopleList[parseInt(_res.data.userID, 10)] = _res.data;
                  that.addPeople({
                    label: _res.data.userName,
                    value: _res.data.userID,
                    msgs: [],
                  });
                  that.addRecord({
                    username: '',
                    sessionId: '',
                    tip: true,
                    msg: `用户 ${_res.data.userName} 已上线`,
                    time,
                  });
                })))
                .then(() => {
                  ctx.peopleNum = ctx.chatPeopleList.length;

                  setupChatPeopleSocket(that.addRecord);
                });
            });
        },
        undefined, undefined, 1);
    });
}

export function wsHeartBeat() {
  let ctx = window.ctx;
  let appID = ctx.appID;

  setInterval(() => {
    console.log('heart beat');
    DBrequest.updatePerson(appID, ctx.chatPeopleList[ctx.myselfID]);
    DBrequest.updateChatroom(appID, Chatroom.create({ roomID: '1', peopleNum: '0' }));
  }, 15000);

  setInterval(() => {
    wsHeartBeatMap[0] -= 1;
    wsHeartBeatMap[1] -= 1;
  }, 3000);
}
