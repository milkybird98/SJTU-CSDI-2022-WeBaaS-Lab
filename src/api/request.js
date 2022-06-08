/* eslint-disable semi */
const axios = require('axios').default;
const protoRoot = require('../proto/proto.js');

const WS = WebSocket;

const ChatMessage = protoRoot.lookup('chatroom.ChatMessage');
const ChatPerson = protoRoot.lookup('chatroom.ChatPerson');
const ChatroomStatus = protoRoot.lookup('chatroom.ChatroomStatus');
const NotificationMessage = protoRoot.lookup('notification.NotificationMessage');

exports.ChatMessage = ChatMessage;
exports.ChatPerson = ChatPerson;
exports.ChatroomStatus = ChatroomStatus;
exports.NotificationMessage = NotificationMessage;

const BaaSBaseAddress = '/webaas';


const protoSchema = `
syntax = "proto3";

package chatroom;
import 'record_metadata_options.proto';

message ChatMessage {
    string uuid = 1 [ (webaas.db.record.field).primary_key = true ];
    string userID = 2;
    string content = 3;
    string privateID = 4;
    string date = 5;
}

message ChatPerson {
    string userID = 1 [(webaas.db.record.field).primary_key = true];
    string userName = 2 ;
    string avatar = 3;
    string preUUID = 4;
    string msgNum = 5;
}

message ChatroomStatus {
    string roomID = 1 [ (webaas.db.record.field).primary_key = true ];
    string peopleNum = 2;
}

`;

// Encode into protobuf

function encodeChatroomMessage(rawData) {
  return ChatMessage.encode(rawData).finish();
}

function encodePerson(rawData) {
  return ChatPerson.encode(rawData).finish();
}

function encodeChatroom(rawData) {
  return ChatroomStatus.encode(rawData).finish();
}

function decodeMessage(encoedeData) {
  const uint8array = new TextEncoder().encode(encoedeData);
  return ChatMessage.decode(uint8array);
}

// Decode from protobuf

function decodePerson(encoedeData) {
  const uint8array = new TextEncoder().encode(encoedeData);
  return ChatPerson.decode(uint8array);
}

function decodeChatroom(encoedeData) {
  const uint8array = new TextEncoder().encode(encoedeData);
  return ChatroomStatus.decode(uint8array);
}


// axios request instance template
function axiosRequest(method, url, data, params, headers) {
  return axios({
    method,
    url,
    data,
    params,
    headers,
  })
    .then((_data) => {
      if (_data.status !== 200) {
        const err = new Error('服务器异常');
        throw err;
      }
      return _data;
    })
    .catch((err) => {
      if (err.response.status === 400) {
        return { status: err.response.data.code, msg: err.response.data.message };
      }
      throw err;
    })
}


// Register and delete app
// appName could be any and duplicated
exports.registerApp = function registerApp(appName) {
  return axiosRequest('POST', `${BaaSBaseAddress}/app`, '', { appName }, {})
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, data: data.data, appID: data.data.appID };
    })
}

// Anyone can delete an app using appName and appID
exports.deleteApp = function deleteApp(appName, appID) {
  return axiosRequest('DELETE', `${BaaSBaseAddress}/app`, '', { appName, appID }, {})
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, data: data.data, appID: data.data.appID };
    })
}


/**
 * Upload 'Schema' proto file; the uploaded file is hard-coded in the header of this file;
 * if upload multiple files are uploaded, you need to keep the version parameters consistent.
 * @param {string} appID application ID
 * @param {string} version Version of proto file
 * @returns http response status and data
 */
exports.uploadSchema = function uploadSchema(appID, version) {
  let uint8array = new TextEncoder().encode(protoSchema);
  return axiosRequest('PUT', `${BaaSBaseAddress}/schema`, uint8array,
    {
      appID,
      fileName: 'chatroom.proto',
      version,
    }, {
      'Content-Type': 'application/octet-stream',
    })
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, data: data.data };
    })
}

/**
 * Update schema of application by uploaded proto file
 * @param {string} appID application ID
 * @param {string} version Version of proto file
 * @returns http response status and data
 */
exports.updateSchema = function updateSchema(appID, version) {
  return axiosRequest('POST', `${BaaSBaseAddress}/schema`, '', { appID, version }, {})
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, data: data.data };
    })
}


/**
 * update object in database
 * @param {*} req protobuf serialized data
 * @param {string} shceme shceme name defined in protobuf
 * @param {string} appID application ID
 * @returns promise of axios instance
 */
function updateRequest(req, schemaName, appID) {
  return axiosRequest('POST', `${BaaSBaseAddress}/record`, new Uint8Array(req), { appID, schemaName }, {
    'Content-Type': 'application/octet-stream',
  })
}

/**
 * update message in database by msgID
 * @param {string} appID application ID
 * @param {*} rawData unserialized ChatMessage object
 * @returns http response status and data
 */
exports.updateChatroomMessage = function updateChatroomMessage(appID, rawData) {
  const req = encodeChatroomMessage(rawData);

  return updateRequest(req, 'chatroom.ChatMessage', appID)
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, data: data.data };
    })
}

/**
 * update message in database by userID
 * @param {string} appID application ID
 * @param {*} rawData unserialized ChatPerson object
 * @returns http response status and data
 */
exports.updatePerson = function updatePerson(appID, rawData) {
  const req = encodePerson(rawData);

  return updateRequest(req, 'chatroom.ChatPerson', appID)
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, data: data.data };
    })
}

/**
 * update message in database by appID and fixed roomID
 * @param {string} appID application ID
 * @param {*} rawData unserialized ChatroomStatus object
 * @returns http response status and data
 */
exports.updateChatroom = function updateChatroom(appID, rawData) {
  const req = encodeChatroom(rawData);

  return updateRequest(req, 'chatroom.ChatroomStatus', appID)
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, data: data.data };
    })
}


/**
 * Delete Message in database by msgID
 * @param {string} appID application ID
 * @param {string} recordKey ID of the message that needs to be deleted
 * @returns http response status and data
 */
exports.deleteChatroomMessage = function deleteChatroomMessage(appID, recordKey) {
  return axiosRequest('DELETE', `${BaaSBaseAddress}/record`, '',
    {
      appID,
      schemaName: 'chatroom.ChatMessage',
      recordKey,
    }, {})
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, data: data.data };
    })
}


/**
 * Query data in database by record key
 * @param {string} appID application ID
 * @param {string} recordKey The ID of the object to be queried
 * @param {*} schemaName The schema to which the query object belongs
 * @returns promise of axios instance
 */
function queryRequest(appID, recordKey, schemaName) {
  return axiosRequest('GET', `${BaaSBaseAddress}/query`, '',
    {
      appID,
      schemaName,
      recordKey,
    }, {})
}

/**
 * Query message by msgID
 * @param {string} appID application ID
 * @param {string} recordKey UUID of message
 * @returns http response status, body and decoded data
 */
exports.queryMessage = function queryMessage(appID, recordKey) {
  return queryRequest(appID, recordKey, 'chatroom.ChatMessage')
    .then((data) => {
      if (data.status !== 200) { return data; }

      let decodedData = decodeMessage(data.data)
      return {
        status: data.status,
        raw: data.data,
        data: decodedData,
        date: parseInt(Buffer.from(decodedData.date, 'base64').toString('ascii'), 10),
      };
    })
}

/**
 * Query person by userID
 * @param {string} appID application ID
 * @param {number} recordKey ID of user
 * @returns http response status, body and decoded data
 */
exports.queryPerson = function queryPerson(appID, recordKey) {
  return queryRequest(appID, recordKey, 'chatroom.ChatPerson')
    .then((data) => {
      if (data.status !== 200) { return data; }
      return { status: data.status, raw: data.data, data: decodePerson(data.data) };
    })
}

/**
 * Query chatroom status by appID and fixed roomID
 * @param {string} appID application ID
 * @param {number} recordKey fixed roomID, pre-defined
 * @returns http response status, body and decoded data
 */
exports.queryChatroom = function queryChatroom(appID, recordKey) {
  return queryRequest(appID, recordKey, 'chatroom.ChatroomStatus')
    .then((data) => {
      if (data.status !== 200) { return data; }
      return {
        status: data.status,
        raw: data.data,
        data: decodeChatroom(data.data),
      };
    })
}


/* useless for current implementations
function queryRequestByRange(appID, beginKey, endKey, iteration, schemaName) {
  return axios({
    method: 'GET',
    url: `${BaaSBaseAddress}/query`,
    params: {
      appID,
      schemaName,
      beginKey,
      endKey,
      iteration,
    },
  });
}

exports.queryChatroomMessageByRange = function (appID, beginKey, endKey, iteration) {
  return queryRequestByRange(appID, beginKey, endKey, iteration, 'chatroom.ChatMessage')
    .then((data) => {
      if (data.status !== 200) {
        const err = new Error('服务器异常');
        throw err;
      }
      console.log(data);
    })
    .catch((err) => {
      throw err;
    })
}

exports.queryPersonByRange = function (appID, beginKey, endKey, iteration) {
  return queryRequestByRange(appID, beginKey, endKey, iteration, 'chatroom.ChatPerson')
    .then((data) => {
      if (data.status !== 200) {
        const err = new Error('服务器异常');
        throw err;
      }
      console.log(data);
    })
    .catch((err) => {
      throw err;
    })
}
*/

/**
 * registe a Notification of specified shcema and record key
 * @param {string} appID application ID
 * @param {string} schemaName The schema name in proto file
 * @param {string[]} recordKeys The record key of the monitored object
 * @returns http response data and registered notificationID
 */
exports.registerNotification = function registerNotification(appID, schemaName, recordKeys) {
  let body = { appID, schemaName, recordKeys };

  return axiosRequest('POST', `${BaaSBaseAddress}/notification`, body, {},
    { 'Content-Type': 'application/json' })
    .then(data => ({
      status: data.status,
      data: data.data,
      notificationID: data.data.notificationID,
    }))
}

exports.deleteNotification = function registerNotification(appID, notificationID) {
  return axiosRequest('DELETE', `${BaaSBaseAddress}/notification`, '', { appID, notificationID },
    '')
    .then(data => ({
      status: data.status,
      data: data.data,
      notificationID: data.data.notificationID,
    }))
}

/**
 * setup websocket of notification
 * @param {string} appID application ID
 * @param {string} notificationID notification ID
 * @returns ws socket instance
 */
exports.setupNotification = function setupNotification(appID, notificationID) {
  let socket = new WS(`ws://202.120.40.82:11232/notification?appID=${appID}&notificationID=${notificationID}`);

  return socket;
}

/**
 * Actual operations on transaction state
 * @param {string} action action of Transaction (begin/commit/abort)
 * @param {...string} transactionID transaction ID in commit and abort
 * @returns promise of axios instance
 */
function doTransactionAction(action, transactionID) {
  let params = { action };
  if (transactionID !== '') {
    params.transactionID = transactionID;
  }

  return axiosRequest('POST', `${BaaSBaseAddress}/transaction`, '', params, {})
    .then(data => ({
      status: data.status,
      data: data.data,
      transactionID: data.data.transactionID,
    }))
}

exports.createTransaction = function setupNotification() {
  let req = doTransactionAction('begin', '');

  return req;
}

exports.commitTransaction = function commitTransaction(transactionID) {
  let req = doTransactionAction('commit', transactionID);

  return req;
}

exports.abortTransaction = function abortTransaction(transactionID) {
  let req = doTransactionAction('abort', transactionID);

  return req;
}


function queryRequestInTransaction(appID, recordKey, schemaName, transactionID) {
  let params = {
    appID,
    schemaName,
    recordKey,
    transactionID,
  };

  return axiosRequest('GET', `${BaaSBaseAddress}/query/transactional`, '', params, {});
}

exports.queryChatroomStatusInTransaction =
  function queryChatroomStatusInTransaction(appID, recordKey, transactionID) {
    return queryRequestInTransaction(appID, recordKey, 'chatroom.ChatroomStatus', transactionID)
      .then((data) => {
        if (data.status !== 200) { return data; }
        return { status: data.status, raw: data.data, data: decodeChatroom(data.data) };
      });
  }

exports.queryChatPersonInTransaction =
  function queryChatPersonInTransaction(appID, recordKey, transactionID) {
    return queryRequestInTransaction(appID, recordKey, 'chatroom.ChatPerson', transactionID)
      .then((data) => {
        if (data.status !== 200) { return data; }
        return { status: data.status, raw: data.data, data: decodePerson(data.data) };
      })
  }


function updateRequestInTransaction(encodedData, appID, schemaName, transactionID) {
  let params = {
    appID,
    schemaName,
    transactionID,
  };

  return axiosRequest('POST', `${BaaSBaseAddress}/record/transactional`, new Uint8Array(encodedData), params, {});
}

exports.updateChatroomStatusInTransaction =
  function updateChatroomStatusInTransaction(appID, rawData, transactionID) {
    let encodedData = ChatroomStatus.encode(rawData).finish();

    return updateRequestInTransaction(encodedData, appID, 'chatroom.ChatroomStatus', transactionID)
      .then((data) => {
        if (data.status !== 200) { return data; }
        return { status: data.status, data: data.data };
      })
  }

exports.updateChatPersonInTransaction =
  function updateChatPersonInTransaction(appID, rawData, transactionID) {
    let encodedData = ChatPerson.encode(rawData).finish();

    return updateRequestInTransaction(encodedData, appID, 'chatroom.ChatPerson', transactionID)
      .then((data) => {
        if (data.status !== 200) { return data; }
        return { status: data.status, data: data.data };
      })
  }

