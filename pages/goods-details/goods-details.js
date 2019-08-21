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
//  点击图片，显示预览图
  bindImgPreView(e) {
    let preImageUrl = this.data.baseURL+'/'+this.data.imgsrc
    console.log(preImageUrl)
    wx.previewImage({
      current: preImageUrl, // 当前显示图片的http链接
      urls: [] // 需要预览的图片http链接列表
    })
  },
  onShow: function () {

  },
  onHide: function () {

  },

})