const cfg = require('./../../config/index');
const api = require('./../../utils/api');
const request = require('./../../utils/request');
const app = getApp();
Page({
  data: {
    baseURL: cfg.baseURL,
    detailData: {
      cname: '',
      price: '',
      info: '',
      imgsrc: '',
      goods: {},
      remark: '',
      number: 0,
    },
    localSendprice: 0, // 配送费
    orderGoodsList: [],
    detailArr: [],
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let res = JSON.parse(options.data);
    this.setData({
      goods: res,
      cname: res.cname,
      price: res.price,
      info: res.pinfo,
      imgsrc: res.img1
    })
    
    this.data.detailArr.push(res)
    this.setData({
      goods: this.data.detailArr
    })
    this.getShopList();
    //获取缓存内的订单信息
    // api.getStorage({
    //     key: 'orderGoodsList'
    //   })
    //   .then(res => {
    //     this.setData({
    //       orderGoodsList: res.data
    //     })
    //     this.priceCalc();
    //   })
  },
  onShow: function() {
    this.getLoacalAddress();
  },
  getLoacalAddress: function () {
    api.getStorage({
      key: 'address'
    })
      .then(res => {
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
  getAddress: function () {
    request.getAddress()
    .then(res => {
      if (res.length) {
        let arr = res.find((element =>element.com == '1'));
        this.setData({
          address: arr,
        });
      }
    });
  },
  // 获取店铺列表
  getShopList: function() {
    api.getLocation()
      .then(res => {
        let {
          latitude,
          longitude
        } = res;
        return request.getShopList({
          latitude,
          longitude
        });
      })
      .then(res => {
        if (res.length) {
          this.setData({
            localSendprice: res,
          });
        }
      });
  },
   //生成订单函数
   goodsCalc: function (e) {
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
  priceCalc: function () {
    let {
      starprice,
      orderGoodsList
    } = this.data;
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
    if (+goodsPrice> 30 || +goodsPrice === 0) {
      sendprice =  0;
    } else {
      sendprice =  this.data.localSendprice;
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
  //  点击图片，显示预览图
  bindImgPreView(e) {
    let preImageUrl = this.data.baseURL + '/' + this.data.imgsrc
    wx.previewImage({
      current: preImageUrl, // 当前显示图片的http链接
      urls: [preImageUrl] // 需要预览的图片http链接列表
    })
  },
  //获取备注的内容
  bindblur: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  //页面隐藏后存储订单信息
  onHide:function(){
    wx.setStorageSync("orderGoodsList", this.data.orderGoodsList);
  }
})