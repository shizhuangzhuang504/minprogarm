const cfg = require('../../config/index');

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    goods: {
      type: Object,
      value: {}
    },
    number: {
      type: Number,
      value: 0
    }
  },
  data: {
    baseURL: cfg.baseURL,
    number: 0,
    info: ''
  },
  lifetimes: {
    attached: function() {
      this.setData({
        number: this.properties.number
      });
    }
  },
  methods: {
    reduce: function() {
      this.setData({
        number: this.data.number - 1
      });
      let {
        id,
        cname,
        img1,
        price,
        bprice
      } = this.properties.goods;
      this.triggerEvent('goodscalc', {
        id,
        cname,
        img1,
        price,
        bprice,
        number: this.data.number
      });
    },
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
      let {
        id,
        cname,
        img1,
        price,
        bprice,
        remark
      } = this.properties.goods;
      this.triggerEvent('goodscalc', {
        id,
        cname,
        img1,
        price,
        bprice,
        number: this.data.number,
        remark:""
      });
    },
    //跳转商品详情
    gogoodsdetail: function() {
      console.log(this.properties.goods)
      var data = JSON.stringify(this.properties.goods);
      wx.navigateTo({
        url: '/pages/goods-details/goods-details?data='+data,
      })
    },
  },
})