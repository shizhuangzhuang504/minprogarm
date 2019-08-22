const cfg = require('./../../config/index');
const api = require('./../../utils/api');
const request = require('./../../utils/request');
Page({
  data: {
    baseURL: cfg.baseURL,
    cname: '',
    price: '',
    info: '',
    imgsrc: '',
    goods: {},
    remark: '',
    number: 0,
    orderGoodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let res = JSON.parse(options.data);
    console.log(res);
    this.setData({
      goods: res,
      cname: res.cname,
      price: res.price,
      info: res.pinfo,
      imgsrc: res.img1
    })
    //获取缓存内的订单信息
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
  reduce: function() {
    this.setData({
      number: this.data.number - 1
    });
    // let {
    //   id,
    //   cname,
    //   img1,
    //   price,
    //   bprice
    // } = this.data.goods;
    // this.goodsCalc({
    //   id,
    //   cname,
    //   img1,
    //   price,
    //   bprice,
    //   number: this.data.number
    // });
  },
  //添加按钮事件
  add: function() {
    // if (wx.getStorageSync('isOutRange')) {
    this.setData({
      number: this.data.number + 1
    });
    // } else {
    //   wx.showToast({
    //     icon: "none",
    //     title: "超出服务范围"
    //   })
    // }
    // let {
    //   id,
    //   cname,
    //   img1,
    //   price,
    //   bprice,
    //   remark
    // } = this.data.goods;
    // this.goodsCalc({
    //   id,
    //   cname,
    //   img1,
    //   price,
    //   bprice,
    //   number: this.data.number,
    //   remark: this.data.remark
    // })
    this.goodsCalc();
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
    console.log(this.data.orderGoodsList);
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
    let sendprice = 0;
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
    console.log(e.detail.value)
    this.setData({
      remark: e.detail.value
    })
  }
})