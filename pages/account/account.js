const api = require('./../../utils/api');
// const request = require('./../../utils/request');
const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loginStatus: false,
    avatarUrl: '',
    nickName: ''
  },
  onLoad: function() {
    
  },
  onShow: function() {
    this.checkLogin();
  },
  checkLogin: function() {
    let Authorization = wx.getStorageSync('Authorization');
    this.setData({
      loginStatus: Authorization ? true : false
    });
    if (Authorization) {
      this.getUserInfo();
    }
  },
  userLogin: function(e) {
    app.userLogin(e)
      .then(res => {
        if (res) {
          this.onShow();
        }
      });
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  getUserInfo: function() {
    api.getUserInfo()
      .then(res => {
        console.log(res)
        let {
          avatarUrl,
          nickName
        } = res.userInfo;
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
  tocoupon:function(){
    wx.setStorageSync("gocard", "card");
    wx.switchTab({
      url:"../coupon/coupon"
    })
  }
})