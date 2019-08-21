const cfg = require('./../../config/index');

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
    foodinfo:{}
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
      } = this.properties.goods.food;
      this.triggerEvent('goodscalc', {
        id,
        cname,
        img1,
        price,
        bprice,
        number: this.data.number
      });
    },
    add: function(e) {
      // if (wx.getStorageSync('isOutRange')) {
      let index = e.target.dataset.idx
      console.log(e.target.dataset.idx)
      console.log(e);
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
      } =e.target.dataset.good;
      this.triggerEvent('goodscalc', {
        id,
        cname,
        img1,
        price,
        bprice,
        number: this.data.number,
        remark: ""
      });
    },
    gogoodsdetail: function(e) {
      let index = e.target.dataset.idx
      let foodinfo = this.properties.goods.data[index];
      var data = JSON.stringify(foodinfo);
      wx.navigateTo({
        url: '/pages/goods-details/goods-details?data='+data,
      })
    },
    // 获取自定义组件的dom节点
    queryMultipleNodes() {
      const query = wx.createSelectorQuery().in(this);
      query.select('.head').boundingClientRect(function(res) {
        console.log(res);
        res.top // 这个组件内 #the-id 节点的上边界坐标 }).exec() }})
      })
      query.select('.order-goods').boundingClientRect(function(res) {
        console.log(res);
        res.top // 这个组件内 #the-id 节点的上边界坐标 }).exec() }})
      })
    },
  },
})