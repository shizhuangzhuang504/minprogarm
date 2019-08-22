const api = require('./utils/api');
const request = require('./utils/request');

App({
  globalData: {
    userInfo: {},
    shopInfo: {},
    goodsPrice: ''
  },
  onLaunch: function () {
    this.getShopList();
  },
  getShopList: function () {
    api.getLocation()
    .then(res => {
      let {latitude, longitude} = res;
      return request.getShopList({
        latitude,
        longitude
      });
    })
    .then(res => {
      if (res.length) {
       this.globalData.shopInfo = res[0];
      }
    });
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