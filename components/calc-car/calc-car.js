const api = require('./../../utils/api');
const request = require('./../../utils/request');
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    goods: {
      type: Object,
      value: {}
    },
    goodsPrice: { // 物品总价
      type: Number,
      value: 0
    },
    goodsbprice: { // 包装费
      type: Number,
      value: 0
    },
    sendprice: { // 配送费
      type: Number,
      value: 0
    },
    discount: {
      type: Number,
      value: 0
    },
    diffPrice: { // 起送差價
      type: Number,
      value: 0
    },
    orderTotalPrice: { // 总价
      type: Number,
      value: 0
    },
    number: {
      type: Number,
      value: 0
    },
    address: {
      type: Object,
      value: {}
    },
    orderGoodsList: {
      type: Array,
      value: []
    }
  },
  data: {
    isshow: false,
    isSelect: false,
    isConfirm: false,
    payType: 0
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {
      this.setData({
        goodsPrice:app.globalData.goodsPrice,
        isSelect: app.globalData.isSelect
      })
    },
    hide: () => {}
  },
  methods: {
    //toggle支付页面
    toggleConfirm: function() {
      if (this.data.orderGoodsList.length > 0) {
        this.setData({
          isConfirm: !this.data.isConfirm
        });
        if (this.data.isConfirm) {
          wx.hideTabBar({})
        } else {
          wx.showTabBar({})
        }
      } else {
        api.showToast({
          title: '请先选择商品！',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    },
    // 订单结算金额计算
    totalPriceCalc: function() {
      let {
        goodsPrice,
        goodsbprice,
        sendprice,
        discount
      } = this.data;
      this.setData({
        orderTotalPrice: goodsPrice + goodsbprice + sendprice - discount
      });
    },
    //选择地址
    chooseAddress: function() {
      app.globalData.address = true;
      api.navigateTo({
        url: '/pages/accountAddress/accountAddress'
      });
    },
    getAddress: function() {
      request.getAddress()
        .then(res => {
          if (res.data.length) {
            this.setData({
              addressList: res.data,
              curAddress: res.data[0]
            });
          }
        });
    },
    //选择优惠券
    chooseCoupon: function() {
      app.globalData.coupon = true;
      api.switchTab({
        url: '/pages/coupon/coupon'
      });
    },
    //选择支付类型
    choosePayType: function(e) {
      let {
        payType
      } = e.currentTarget.dataset;
      this.setData({
        payType
      });
    },
    //调起微信支付
    pay: function() {
      let {
        payType,
        orderTotalPrice,
        couponId,
        address,
        shopId,
        money,
        orderGoodsList
      } = this.data;
      if (payType === 1 && money < orderTotalPrice) {
        api.showToast({
          title: '储值卡余额不足',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (Object.keys(address).length == 0) {
        api.showToast({
          title: '请选择配送地址',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      let ordlist = orderGoodsList.map(item => {
        return {
          gid: item.id,
          cont: item.number,
          remark: item.remark
        }
      });
      var ordlists = JSON.stringify(ordlist);
      request.submitOrder({
          ordlist: ordlists,
          paytype: payType,
          money: orderTotalPrice,
          voucid: 2,
          addid: address.id,
          dpid: app.globalData.shopInfo.id
        })
        .then(res => {
          let that = this;
          if (res.status_code) {
            wx.requestPayment({
              'timeStamp': res.data.timestamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': res.data.signType,
              'paySign': res.data.paySign,
              success() {
                api.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                });
                that.setData({
                  isConfirm: !that.data.isConfirm
                });
                wx.showTabBar({})
                wx.navigateTo({
                  url: "/pages/accountOrder/accountOrder"
                })
              },
              fail() {
                api.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            })
          } else {
            api.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            });
          }
          return;
        });
    }
  },
  attached() {
  }

})