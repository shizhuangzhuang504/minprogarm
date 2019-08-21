const cfg = require('./../../config/index');
const api = require('./../../utils/api');
const request = require('./../../utils/request');
const app = getApp();

Page({
  data: {
    baseURL: cfg.baseURL,
    loginStatus: false,
    swiperImgs: [],
    indicatorDots: true,
    isOutRange: false,
    shopId: '',
    starprice: 0,
    sendprice: 0,
    goodsPrice: 0,
    goodsbprice: 0,
    diffPrice: 0,
    discount: 0,
    orderTotalPrice: 0,
    menuList: [],
    menuIndex: 0,
    goodsList: [],
    isConfirm: false,
    orderGoodsList: [],
    address: {},
    couponId: '',
    payType: 0,
    money: 0,
    listViewScrollTop: 0,
    foodAreaHeight: [0],
  },
  onLoad: function() {
    this.getSwiper();
    this.getMenuList();
  },
  onShow: function() {
    this.checkLogin();
    this.getShop();
    this.getAddress();
    this.getCoupon();
    this.getUser();
    this.priceCalc();
    //获取index页的订单
    api.getStorage({
        key: 'orderGoodsList'
      })
      .then(res => {
        console.log(res);
        this.setData({
          orderGoodsList: res.data
        })
        this.priceCalc();
      })

  },
  onReady:function(){
    
  },
  checkLogin: function() {
    let Authorization = wx.getStorageSync('Authorization');
    this.setData({
      loginStatus: Authorization ? true : false
    });
  },
  userLogin: function(e) {
    app.userLogin(e)
      .then(res => {
        if (res) {
          this.onShow();
        }
      });
  },
  getSwiper: function() {
    request.getSwiper()
      .then(res => {
        if (res.length) {
          this.setData({
            swiperImgs: res
          });
        }
      });
  },
  getShop: function() {
    api.getStorage({
        key: 'shop'
      })
      .then(res => {
        if (res.data) {
          let {
            id,
            starprice,
            sendprice
          } = res.data;
          this.setData({
            shopId: id,
            starprice,
            sendprice,
            diffPrice: starprice
          });
        }
      });
  },
  getMenuList: function() {
    request.getMenuList()
      .then(res => {
        if (res.length) {
          this.setData({
            menuList: res,
            mid: res[0].mid
          });
          this.getGoodsList();
        }
      });
  },
  setFoodListAreaHeight() {
    let query = wx.createSelectorQuery().in(this);
    let that = this;
    //分类栏的高度
    query.select('.head').boundingClientRect(function(rect) {
      // console.log(rect.height);
      that.setData({
        eleCateTitleHeight: 38
      })
    }).exec();
    //商品item的高度
    query.select('.list').boundingClientRect(function(rect) {
      console.log(rect.height);
      that.setData({
        eleFoodHeight: 90
      })
    }).exec();
    //把商品列表每个分类的区间高度计算，并放进数组
    //上面获取元素的高度可能不是同步的，所以把下面的放在setTimeout里面
    let foodAreaHeight = [0]
    let heightCount = 0
    setTimeout(() => {
      this.data.goodsList.forEach((item, index) => {
        heightCount += item.data.length * this.data.eleFoodHeight + this.data.eleCateTitleHeight
        foodAreaHeight.push(heightCount)
      })
      this.setData({
        foodAreaHeight
      })
    }, 100)

  },
  // 菜单栏点击事件滚动到右边的高度
  chooseMenu: function(e) {
    let {
      index
    } = e.currentTarget.dataset;
    this.setData({
      menuIndex: index,
    });
    let idx = e.currentTarget.dataset.index
    let foodcount = e.currentTarget.dataset.foodcount
    this.setData({
      listViewScrollTop: this.data.foodAreaHeight[idx]
    })
  },
  //滚动商品时事件
  foodListScrolling(event) {
    let scrollTop = event.detail.scrollTop
    let foodAreaHeight = this.data.foodAreaHeight
    foodAreaHeight.forEach((item, index) => {
      if (scrollTop >= foodAreaHeight[index] && scrollTop < foodAreaHeight[index + 1]) {
        this.setData({
          menuIndex: index
        })
      }
    })
  },
  // 获取外卖商品
  getGoodsList: function() {
    request.getMenuGoods({
        mid: this.data.mid
      })
      .then(res => {
        console.log(res);
        if (res.length) {
          this.setData({
            goodsList: res
          }, () => {
            this.setFoodListAreaHeight()
          });
        } else {
          this.setData({
            goodsList: []
          }, () => {
            this.setFoodListAreaHeight()
          });
        }
      });
  },
  getAddress: function() {
    if (this.data.isConfirm) {
      api.getStorage({
          key: 'address'
        })
        .then(res => {
          if (res.data) {
            this.setData({
              address: res.data
            });
          }
        });
    }
  },
  getCoupon: function() {
    if (this.data.isConfirm) {
      api.getStorage({
          key: 'coupon'
        })
        .then(res => {
          if (res.data) {
            let {
              id,
              discount,
              type
            } = res.data;
            if (type === 1) {
              this.setData({
                couponId: id,
                discount: this.data.goodsPrice * (10 - discount) / 10,
                orderTotalPrice: this.data.orderTotalPrice - this.data.goodsPrice * (10 - discount) / 10
              });
            } else {
              this.setData({
                couponId: id,
                discount: discount,
                orderTotalPrice: this.data.orderTotalPrice - discount
              });
            }
            this.totalPriceCalc();
          }
        });
    }
  },
  getUser: function() {
    request.getUserInfo()
      .then(res => {
        console.log(res);
        this.setData({
          money: res.money
        });
      });
  },
  goodsCalc: function(e) {
    let list = this.data.orderGoodsList;
    // let flag = false;
    // let filterIndex = -1;
    // list.forEach((item, index) => {
    //   if (item.id === e.detail.id) {
    //     filterIndex = index;
    //     flag = true;
    //   }
    // });
    // if (flag && filterIndex > -1) {
    //   console.log(list);
    //   console.log(e.detail);
    //   list[filterIndex] = e.detail;
    // } else {
    list.push(e.detail);
    // }
    this.setData({
      orderGoodsList: list
    });
    this.priceCalc();
  },
  priceCalc: function() {
    let {
      starprice,
      orderGoodsList
    } = this.data;
    let goodsPrice = 0;
    let goodsbprice = 0;
    let diffPrice = 0;
    orderGoodsList.forEach(item => {
      goodsPrice += item.price * item.number;
      goodsbprice += item.bprice;
    });
    if (goodsPrice >= starprice) {
      diffPrice = 0;
    } else {
      diffPrice = starprice - goodsPrice;
    }
    this.setData({
      goodsPrice,
      goodsbprice,
      diffPrice
    });
  },
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
})