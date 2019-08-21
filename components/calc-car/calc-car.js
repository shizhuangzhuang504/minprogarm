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
    diffPrice: { // 起送差價
      type: Number,
      value: 0
    },
    number: {
      type: Number,
      value: 0
    }
  },
  data: {
    isshow:false,
    isConfirm:false
  },
  methods: {
    //toggle支付页面
    toggleConfirm: function() {
      this.setData({
        isConfirm: !this.data.isConfirm
      });
      if (this.data.isConfirm) {
        this.totalPriceCalc();
      }
    },
    //选择地址
    chooseAddress: function() {
      app.globalData.address = true;
      api.navigateTo({
        url: '/pages/accountAddress/accountAddress'
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
      console.log(address);
      if (Object.keys(address).length == 0) {
        api.showToast({
          title: '请选择配送地址',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      console.log(orderGoodsList);
      let ordlist = orderGoodsList.map(item => {
        return {
          gid: item.id,
          cont: item.number,
          remark: item.remark
        }
      });
      var ordlists = JSON.stringify(ordlist);
      console.log(ordlists);
      request.submitOrder({
          ordlist: ordlists,
          paytype: payType,
          money: orderTotalPrice,
          voucid: couponId,
          addid: address.id,
          dpid: shopId
        })
        .then(res => {
          console.log(res);
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

})