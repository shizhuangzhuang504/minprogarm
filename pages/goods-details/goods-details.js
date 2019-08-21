const cfg = require('./../../config/index');
Page({
  data: {
    baseURL: cfg.baseURL,
    cname:'',
    price:'',
    info:'',
    imgsrc:'',
    goods:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let res = JSON.parse(options.data);
    console.log(res);
    this.setData({
      goods:res,
      cname:res.cname,
      price: res.price,
      info:res.pinfo,
      imgsrc:res.img1
    })
  },
  //添加按钮事件
  add: function () {
      let {
        id,
        cname,
        img1,
        price,
        bprice,
        remark
      } = this.data.goods;
      this.triggerEvent('goodscalc', {
        id,
        cname,
        img1,
        price,
        bprice,
        number: this.data.number,
        remark: this.data.remark
      });
      wx.showToast({
        icon: 'none',
        title: '已添加',
      })
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

})