const api = require('./../../utils/api');
const request = require('./../../utils/request');

Page({
  data: {
    shopList: [
      {
        "id":1,
        "rname":"名字字",
        "address":"地址",
        "lat":"纬度",
        "lng":"经度",
        "fname":"122",
        "mobile":"电话",
        "ctime":23234234,
        "status":1,
        "local":null,
        "distance":111,
        "service":1,
        "starprice":20.00,
        "sendprice":2 
      },
      {
        "id":2,
        "rname":"名字字2",
        "address":"地址2",
        "lat":"纬度",
        "lng":"经度",
        "fname":"122",
        "mobile":"电话",
        "ctime":23234234,
        "status":1,
        "local":null,
        "distance":111,
        "service":0,
        "starprice":20.00,
        "sendprice":2 
      }
    ]
  },
  onLoad: function () {
    this.getShopList();
  },
  getShopList: function () {
    api.getLocation()
    .then(res => {
      let {latitude, longitude} = res;
      return request.getShopList({
        latitude,
        longitude
      });
    })
    .then(res => {
      if (res.length) {
        this.setData({
          shopList: res
        });
        api.setStorageSync({
          key: 'shop',
          data: {
            id,
            rname,
            distance,
            service,
            starprice,
            sendprice
          }
        })
      }
    });
  },
  choose: function (e) {
    let { index } = e.currentTarget.dataset;
    let { id, rname, distance, service, starprice, sendprice } = this.data.shopList[index];
    api.setStorage({
      key: 'shop',
      data: {
        id,
        rname,
        distance,
        service,
        starprice,
        sendprice
      }
    })
    .then(res => {
      api.navigateBack({
        delta: -1
      });
    });
  }
})