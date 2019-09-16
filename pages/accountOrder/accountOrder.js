const cfg = require('./../../config/index');
const request = require('./../../utils/request');

Page({
  data: {
    baseURL: cfg.baseURL,
    orderType: 'all',
    allList: [
      {
        "cname":"大骨面",
        "img1":"/storage/20190805043702-骨汤肉面 套（小）.jpg",
        "money":89.2,
        "discount":8,
        "pstatus":1,
        "psend":1,
        "orid":"DCewe"
      },
      {
        "cname":"大骨面",
        "img1":"/storage/20190805043702-骨汤肉面 套（小）.jpg",
        "money":89.2,
        "discount":8,
        "pstatus":1,
        "psend":0,
        "orid":"DCewe"
      }
    ],
    incompleteList: [],
    completedList: []
  },
  onLoad: function () {
    this.getOrderList();
  },
  chooseOrderType: function (e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      orderType: type
    });
  },
  getOrderList: function () {
    request.getOrderList()
    .then(res => {
      if (res.data.length) {
        this.setData({
          allList: res.data
        });
      }
      let incompleteListTemp = [];
      let completedListTemp = [];
      this.data.allList.forEach(item => {
        if (item.psend === 0) {
          incompleteListTemp.push(item);
        }
        if (item.psend === 1) {
          completedListTemp.push(item);
        }
      });
      this.setData({
        incompleteList: incompleteListTemp,
        completedList: completedListTemp
      });
    });
  }
})