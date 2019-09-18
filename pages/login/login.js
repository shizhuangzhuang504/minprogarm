const api = require("./../../utils/api");
const request = require('./../../utils/request');
const app = getApp();

Page({
  data: {
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
  // 放弃注册
  giveResiter:function() {
    wx.navigateBack();
  },
  // 拒绝获取手机号
  refuseGetPhone:function() {
   this.toGetCoupon();
  },
  toGetCoupon: function() {
    api.switchTab({
      url: "/pages/coupon/coupon"
    });
  },
  userLogin: function(e) {
    app.userLogin(e, this).then(res => {
      if (res) {
        this.onShow();
      }
    });
  },
  //领取优惠券
  getCoupon() {
    request.receiveCouponList().then(res => {
      if (res.code === 0 || res.code === 1) {
        wx.switchTab({
          url: "/pages/coupon/coupon"
        });
      }
    });
  },
  // 获取手机号
  getphonenumber: function(e) {
    let { iv, encryptedData } = e.detail;
    if (encryptedData) {
      request
      .getMobile({
        iv,
        encryptData: encryptedData,
        session_key: wx.getStorageSync("session_key"),
        type: 0 
      })
      .then(res => {
        if (res) {
          wx.setStorageSync("userPhone", res.mobile);
          this.getCoupon();
        }
      });
    } else {
      this.getCoupon();
    }
  }
});
