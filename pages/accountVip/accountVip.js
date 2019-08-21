const api = require('./../../utils/api');
const request = require('./../../utils/request');

Page({
  data: {
    avatarUrl: '',
    nickName: '',
    mobile: '',
    consume: 0
  },
  onLoad: function () {
    this.getUser();
    this.getUserInfo();
  },
  getUser: function () {
    request.getUserInfo()
    .then(res => {
      console.log(res);
      this.setData({
        mobile: res.mobile,
        consume: res.consume
      });
    });
  },
  getUserInfo: function () {
    api.getUserInfo()
    .then(res => {
      let {avatarUrl, nickName} = res.userInfo;
      this.setData({
        avatarUrl,
        nickName
      });
    });
  },
  getphonenumber: function (e) {
    let {iv, encryptedData} = e.detail;
    console.log({ iv, encryptedData });
    wx.checkSession({
      success() {
        console.log("session_key 未过期，并且在本生命周期一直有效");
      },
      fail() {
        console.log("session_key 已经失效，需要重新执行登录流程");
      }
    })
    request.getMobile({
      iv,
      encryptData: encryptedData,
      session_key: wx.getStorageSync('session_key'),
      type: 0
    })
    .then(res => {
      console.log(res);
      if (res) {
        this.setData({
          mobile: res.mobile
        });
        console.log(11);
      }
    });
  }
})