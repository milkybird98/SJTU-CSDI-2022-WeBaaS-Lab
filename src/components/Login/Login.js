import {
  XInput,
  XButton,
  Cell,
  Group,
} from 'vux';

import { login } from '../../api/api';

export default {
  name: 'Login',
  components: {
    XInput,
    XButton,
    Cell,
    Group,
  },
  data() {
    return {
      username: '',
      appID: '',
    };
  },
  methods: {
    login() {
      let username = this.username;
      let appID = this.appID;
      if (this.username.trim() !== '' &&
        this.appID.trim() !== '') {
        login(this, username, appID);
      } else {
        this.$vux.alert.show({
          title: '用户名/房间号不能为空',
        });
      }
    },
  },
};
