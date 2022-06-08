const request = require('./src/api/request');
const protoRoot = require('./src/proto/proto.js');
const crypto = require('crypto');
const { resolve } = require('path');

const ChatPerson = protoRoot.lookup('chatroom.ChatPerson');
const ChatMessage = protoRoot.lookup('chatroom.ChatMessage');
const Chatroom = protoRoot.lookup('chatroom.ChatroomStatus');
const NotificationMessage = protoRoot.lookup('notification.NotificationMessage');

function toBase64(num) {
  return Buffer.from(num.toString()).toString('base64');
}

function Main() {
  let appID = '';

  let uuid = crypto.randomBytes(16).toString('hex');

  const personTestID = 13
  let personMsgCount = 0;

  let date = Math.floor(Date.now() / 1000);

  let message = ChatMessage.create({ uuid: uuid + '0', userID: personTestID.toString(), content: 'I can eat glass.', date: toBase64(date) });
  date++;
  let message2 = ChatMessage.create({ uuid: uuid + '1', userID: personTestID.toString(), content: 'Not hurt myself.', date: toBase64(date) });

  let person = ChatPerson.create({ userID: personTestID.toString(), userName: 'abc', avatar: String(555), preUUID: uuid, msgNum: '0' });
  let roomStatus = Chatroom.create({ roomID: String(0), peopleNum: String(255) });

  console.log(message);

  request.registerApp('test')
    .then((res) => {
      console.log(res);
      appID = res.appID;
      console.log(appID);

      let protoVersion = 1;

      request.uploadSchema(appID, protoVersion)
        .then((res) => {
          console.log(res);

          request.updateSchema(appID, protoVersion)
            .then((res) => {
              console.log(res);

              request.createTransaction()
                .then((res) => {
                  console.log(res);
                  let transactionID = res.transactionID;
                  console.log(transactionID);
                  request.updateChatroomStatusInTransaction(appID, roomStatus, transactionID)
                    .then((res) => {
                      console.log(res);

                      request.queryChatroom(appID, String(0))
                        .then((res) => {
                          console.log('outside of tran: ', res);
                        })

                      request.queryChatroomStatusInTransaction(appID, String(0), transactionID)
                        .then((res) => {
                          console.log('inside of tran: ', res);

                          request.commitTransaction(transactionID)
                            .then((res) => {
                              console.log(res);

                              request.queryChatroom(appID, String(0))
                                .then((res) => {
                                  console.log('after tran: ', res);
                                })
                            })

                        })

                    })
                })


              Promise.all([request.updateChatroomMessage(appID, message), request.updateChatroomMessage(appID, message2)])
                .then((res) => {
                  console.log(res);

                  request.updatePerson(appID, person)
                    .then((res) => {
                      console.log(res);

                      request.registerNotification(appID, 'chatroom.ChatPerson', [personTestID.toString()])
                        .then((res) => {
                          console.log(res);
                          let socket = request.setupNotification(appID, res.notificationID);

                          socket.onopen = () => {
                            console.log('connect success !!!!');

                            let newperson = ChatPerson.create({ userID: personTestID.toString(), userName: 'abc', avatar: String(555), preUUID: uuid, msgNum: '2' });

                            request.updatePerson(appID, newperson)
                              .then((res) => {
                                console.log(res);
                              });
                          };

                          socket.onerror = (err) => {
                            console.log('error: ', err);
                          };

                          socket.onmessage = (msg) => {
                            console.log('msg: ', msg);

                            let uint8array = new TextEncoder().encode(msg.data);
                            let decodedData = NotificationMessage.decode(uint8array);

                            console.log(decodedData);

                            request.queryPerson(appID, decodedData.recordKeys[0])
                              .then((res) => {
                                console.log(res);

                                let msgPreUUIDArray = [];
                                for (let i = personMsgCount; i < parseInt(res.data.msgNum); i++) {
                                  msgPreUUIDArray.push(res.data.preUUID + i.toString());
                                }

                                console.log(msgPreUUIDArray);

                                Promise.all(msgPreUUIDArray.map((uuid) => {
                                  return request.queryMessage(appID, uuid);
                                }))
                                  .then((...a) => {

                                    a[0].forEach((item) => {
                                      console.log(item.data.content);
                                    })

                                    request.deleteApp('test', appID)
                                      .then((res) => {
                                        console.log(res);
                                        socket.close();
                                      })
                                  })
                                  .catch(err => {
                                    console.log(err.response)
                                  });

                              });
                          };
                        });
                    });
                });
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

Main();
