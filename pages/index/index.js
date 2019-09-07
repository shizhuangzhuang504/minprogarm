const cfg = require("./../../config/index");
const api = require("./../../utils/api");
const request = require("./../../utils/request");
const app = getApp();

Page({
  data: {
    baseURL: cfg.baseURL,
    showFreeCoupon: false,
    swiperImgs: [],
    indicatorDots: true,
    shopName: "",
    shopDistance: "",
    isOutRange: 1,
    hotList: [],
    freeConponList: [
      {
        end_time: "2019-09-07",
        start_time: "2019-09-02",
        variety_image: "storage/20190829051038-1000-1000模板饿了么-.jpg",
        variety_name: "冷面"
      }
    ],
    address: {},
    iscoupon: true,
    isSelect: false,
    localSendprice: 0, // 配送费
    orderGoodsList: [],
    remark: ""
  },
  onLoad: function(option) {
    this.getSwiper();
    this.getHotList();
    this.getShopList();
    if (Object.keys(option).length !== 0) {
      this.setData({
        iscoupon: !this.data.iscoupon
      });
    }
  },
  onMyevent: function(e) {
    this.setData({
      isSelect: e.detail
    });
  },
  onShow: function() {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({
      userInfo
    });
    this.getLoacalAddress();
    if (userInfo.Authorization) {
      request.getFreeCoupon().then(res => {
        console.log(res);
        if (res.data.variety_name) {
          this.setData({
            freeConponList: [res.data],
            showFreeCoupon: true
          });
        }
      });
    }
  },
  cancel: function() {
    this.setData({
      iscoupon: !this.data.iscoupon
    });
  },
  getLoacalAddress: function() {
    api
      .getStorage({
        key: "address"
      })
      .then(res => {
        console.log(res);
        if (res.data) {
          this.setData({
            address: res.data
          });
        }
      })
      .catch(err => {
        this.getAddress();
      });
  },
  getAddress: function() {
    request.getAddress().then(res => {
      if (res.length) {
        let arr = res.find(element => element.com == "1");
        this.setData({
          address: arr
        });
      }
    });
  },
  userLogin: function(e) {
    app.userLogin(e, this).then(res => {
      if (res) {
        request.getFreeCoupon().then(res => {
          console.log(res);
          if (res.data.variety_name) {
            this.setData({
              freeConponList: [res.data],
              showFreeCoupon: true
            });
          }
        });
      }
    });
  },
  getSwiper: function() {
    request.getSwiper().then(res => {
      if (res.length) {
        this.setData({
          swiperImgs: res
        });
      }
    });
  },
  // 获取店铺列表
  getShopList: function() {
    api
      .getLocation()
      .then(res => {
        let { latitude, longitude } = res;
        return request.getShopList({
          latitude,
          longitude
        });
      })
      .then(res => {
        if (res.length) {
          this.setData({
            localSendprice: res[0].sendprice,
            shopName: res[0].rname,
            shopDistance: res[0].distance,
            shopDistance: Math.floor(res[0].distance / 1000)
            // isOutRange: res[0].service
          });
          wx.setStorageSync("isOutRange", res[0].service);
          wx.setStorageSync("shop", res[0]);
        }
      });
  },
  // getShop: function () {
  //   console.log(111);
  //   api.getStorage({
  //     key: 'shop'
  //   })
  //   .then(res => {
  //     if (res.data) {
  //       console.log(res);
  //       this.setData({
  //         shopName: res.data.rname,
  //         shopDistance: res.data.distance,
  //         isOutRange: res.data.service
  //       });
  //     }
  //   });
  // },
  order: function() {
    if (wx.getStorageSync("isOutRange")) {
      api.switchTab({
        url: "/pages/order/order"
      });
    } else {
      this.setData({
        isOutRange: 0
      });
      wx.showToast({
        icon: "none",
        title: "超出服务范围"
      });
    }
  },
  couponCard: function() {
    app.globalData.couponCard = true;
    api.switchTab({
      url: "/pages/coupon/coupon"
    });
  },
  //获取爆款商品
  getHotList: function() {
    request.getHotList().then(res => {
      if (res.length) {
        console.log(res);
        this.setData({
          hotList: res
        });
      }
    });
  },
  onShareAppMessage: function(opt) {
    if (opt.from === "button") {
      return {
        title: "匠丰大骨面",
        path: "pages/index/index?type=share"
      };
    } else {
      return {
        title: "匠丰大骨面",
        path: "pages/index/index"
      };
    }
  },
  // reduce: function() {
  //   this.setData({
  //     number: this.data.number - 1
  //   });
  // },
  // add: function() {
  //   if (wx.getStorageSync('isOutRange')) {
  //     this.setData({
  //       number: this.data.number + 1
  //     });
  //   } else {
  //     wx.showToast({
  //       icon: "none",
  //       title: "超出服务范围"
  //     })
  //   }
  // },
  receivecoupon: function() {
    api
      .showToast({
        title: "已领取可在优惠券内查看",
        icon: "none",
        duration: 200
      })
      .then(() => {
        this.setData({
          iscoupon: !this.data.iscoupon
        });
      });
  },
  //生成订单函数
  goodsCalc: function(e) {
    let list = this.data.orderGoodsList;
    let flag = false;
    let filterIndex = -1;
    list.forEach((item, index) => {
      if (item.id === e.detail.id) {
        filterIndex = index;
        flag = true;
      }
    });
    if (flag && filterIndex > -1) {
      list[filterIndex] = e.detail;
    } else {
      list.push(e.detail);
    }
    this.setData({
      orderGoodsList: list
    });
    this.priceCalc();
  },
  priceCalc: function() {
    let { starprice, orderGoodsList } = this.data;
    let goodsPrice = 0;
    let goodsbprice = 0;
    let diffPrice = 0;
    let discount = 8;
    orderGoodsList.forEach(item => {
      goodsPrice += item.price * item.number;
      goodsbprice += item.bprice;
    });
    if (goodsPrice >= starprice) {
      diffPrice = 0;
    } else {
      diffPrice = starprice - goodsPrice;
    }
    let orderTotalPrice = goodsPrice + goodsbprice + sendprice - discount;
    let sendprice = 0;
    if (+goodsPrice > 30 || +goodsPrice === 0) {
      sendprice = 0;
    } else {
      sendprice = this.data.localSendprice;
    }
    app.globalData.goodsPrice = goodsPrice;
    this.setData({
      goodsPrice,
      goodsbprice,
      diffPrice,
      sendprice,
      discount,
      orderTotalPrice
    });
  },
  closeCoupon() {
    this.setData({
      showFreeCoupon: false
    });
  },
  getCoupon() {
    request.receiveCouponList().then(res => {
      console.log(res);
      if (res.code === 1) {
        api
          .showToast({
            title: "领取成功",
            icon: "none",
            duration: 2000
          })
          .then(() => {
            this.setData({
              showFreeCoupon: false
            });
            wx.switchTab({
              url: "/pages/coupon/coupon"
            });
          });
      }
    });
  },
  //页面隐藏后存储订单信息
  onHide: function() {
    wx.setStorageSync("orderGoodsList", this.data.orderGoodsList);
  },
  stopScroll(e) {
    console.log(e);
  }
});
