import * as api from '../../api/api';
import * as types from '../mutation-types';

const initialState = {
  records: [], // [{sessionId,username,msg,time}...]
  // sessionId是发出来的人的sessionId
};

const getters = {
  records: state => state.records,
  privateGroups: state => state.privateGroups,
};

const actions = {
  // 得到群聊聊天记录
  getRecords({ commit }) {
    commit(types.START_LOADING);
    return api.getRecords(
      (data) => {
        commit(types.GET_RECORDS_SUCCESS, data);
        // 关闭loading
        commit(types.END_LOADING);
      },
      (err) => {
        console.log(err);
        commit(types.GET_RECORDS_FAILURE);
        // 关闭loading
        commit(types.END_LOADING);
      });
  },
  // 增加一条群聊聊天记录
  addRecord({ commit }, record) {
    // console.log('test');
    commit(types.ADD_RECORD, record);
  },
};

const mutations = {
  [types.GET_RECORDS_SUCCESS](state, records) {
    if (records.length > 0) {
      state.records.splice(0);
      records.map((record) => {
        state.records.push(record);
        return true;
      });
    }
  },
  [types.GET_RECORDS_FAILURE](state) {
    state.records = [];
  },
  [types.ADD_RECORD](state, record) {
    state.records.push(record);
  },
};


export default {
  state: initialState,
  getters,
  actions,
  mutations,
};
