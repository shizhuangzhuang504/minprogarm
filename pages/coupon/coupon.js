const api = require("./../../utils/api");
const request = require("./../../utils/request");
const app = getApp();

Page({
  data: {
    type: "coupon",
    couponList: [],
    money: 0,
    discount: 0,
    isChargeTips: true,
    chargeNumber: 0,
    rebateList: []
  },
  onLoad: function() {
    let couponCard = app.globalData.couponCard;
    if (couponCard) {
      this.setData({
        type: "card"
      });
      app.globalData.couponCard = false;
    }
  },
  onShow: function() {
    this.checkLogin();
    api
      .getStorage({
        key: "gocard"
      })
      .then(res => {
        this.setData({
          type: res.data
        });
      });
  },
  checkLogin: function() {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo
    });
    if (userInfo.Authorization) {
      this.getCouponList();
    }
  },
  userLogin: function(e) {
    app.userLogin(e, this).then(res => {
      if (res) {
        this.onShow();
      }
    });
  },
  chooseType: function(e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      type
    });
    if (type === "coupon") {
      this.getCouponList();
    } else {
      this.getUserInfo();
      this.getRebate();
    }
  },
  getCouponList: function() {
    request.getCouponList().then(res => {
      if (res.code === 0) {
        let { list_data } = res.data;
        this.setData({
          couponList: res.data
        });
      }
    });
  },
  chooseCoupon: function(e) {
    let coupon = app.globalData.coupon;
    let { index } = e.currentTarget.dataset;
    let couponItem = this.data.couponList[index];
    if (coupon && couponItem.status === 0) {
      api
        .setStorage({
          key: "coupon",
          data: {
            ...couponItem
          }
        })
        .then(res => {
          api.switchTab({
            url: "/pages/index/index"
          });
        });
    } else {
      api
        .setStorage({
          key: "coupondetails",
          data: {
            ...couponItem
          }
        })
        .then(res => {
          api.navigateTo({
            url: "/pages/couponDetails/couponDetails"
          });
        });
    }
    app.globalData.coupon = false;
  },
  getUserInfo: function() {
    request.getUserInfo().then(res => {
      this.setData({
        money: res.money,
        discount: res.discount
      });
    });
  },
  getRebate: function() {
    request.getRebate().then(res => {
      if (res.length) {
        this.setData({
          rebateList: res
        });
      }
    });
  },
  chargeInput: function(e) {
    let value = e.detail.value;
    if (value) {
      this.setData({
        isChargeTips: false,
        chargeNumber: value
      });
    } else {
      this.setData({
        isChargeTips: true,
        chargeNumber: value
      });
    }
  },
  recharge: function() {
    let number = this.data.chargeNumber;
    let reg = /^([1-9][0-9]*(\.\d{1,2})?)|(0\.\d{1,2})/;
    if (number === "") {
      api.showToast({
        title: "请输入金额",
        icon: "none"
      });
      return;
    } else if (!reg.test(number)) {
      api.showToast({
        title: "请正确输入金额",
        icon: "none"
      });
      return;
    } else {
      request
        .recharge({
          money: number
        })
        .then(res => {
          if (res.status_code) {
            return api.requestPayment({
              timeStamp: res.data.timestamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign
            });
          } else {
            return Promise.reject();
          }
        })
        .then(res => {
          if (res.errMsg === "requestPayment:ok") {
            api
              .showToast({
                title: "充值成功",
                icon: "none",
                duration: 2000
              })
              .then(res => {
                this.getUserInfo();
              });
          } else {
            api.showToast({
              title: "充值失败",
              icon: "none"
            });
          }
        });
    }
  },
  // 毫秒时间转换
  transformDate: function(num) {
    function setDb(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return "" + num;
      }
    }
    var time = new Date(num * 1000);
    var year = time.getFullYear(); //年
    var mon = setDb(time.getMonth() + 1); //0
    var day = setDb(time.getDate()); //24
    var res = year + "年" + mon + "月" + day + "日";
    return res;
  }
});
