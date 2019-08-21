const api = require('./utils/api');
const request = require('./utils/request');

App({
  globalData: {
    userInfo: {
    }
  },
  onLaunch: function () {
  },
  userLogin: function (getUserInfo) {
    let {userInfo, rawData, signature} = getUserInfo.detail;
    console.log(userInfo);
    console.log(rawData);
    let userInfos= JSON.stringify(userInfo);
    if (!userInfos) {
      return Promise.reject();
    } else {
      return api.login()
      .then(res => {
        let {code} = res;
        if (code) {
          return request.userLogin({
            code,
            userInfos,
            rawData,
            signature
          });
        }
      })
      .then(res => {
        if (res) {
          console.log(res);
          wx.setStorageSync('Authorization', `${res.token_type} ${res.access_token}`);
          wx.setStorageSync('session_key', res.session_key);
          return true;
        } else {
          return Promise.reject();
        }
      });
    }
  }
})