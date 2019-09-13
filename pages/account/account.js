const api = require("./../../utils/api");
// const request = require('./../../utils/request');
const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    avatarUrl: "",
    nickName: ""
  },
  onLoad: function() {},
  onShow: function() {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo
    });
  },
  checkLogin: function() {},
  userLogin: function(e) {
    app.userLogin(e, this).then(res => {
      if (res) {
        this.onShow();
      }
    });
  },
  bindGetUserInfo(e) {
    app.userLogin(e, this).then(res => {
      if (res) {
      }
    });
  },
  getUserInfo: function() {
    api.getUserInfo().then(res => {
      let { avatarUrl, nickName } = res.userInfo;
      this.setData({
        avatarUrl,
        nickName
      });
      // request.getMobile({
      //   ...res
      // }).then(res => {

      // })
    });
  },
  tocoupon: function() {
    wx.setStorageSync("gocard", "card");
    wx.switchTab({
      url: "../coupon/coupon"
    });
  }
});
