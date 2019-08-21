const api = require('./../../utils/api');
const request = require('./../../utils/request');
const app = getApp();

Page({
  data: {
    addressList: [],
    curIndex: 0,
    curAddress: null
  },
  onShow: function () {
    this.getAddress();
  },
  getAddress: function () {
    request.getAddress()
    .then(res => {
      if (res.length) {
        this.setData({
          addressList: res,
          curAddress: res[0]
        });
      }
    });
  },
  choose: function (e) {
    let { index } = e.currentTarget.dataset;
    let address = app.globalData.address;
    this.setData({
      curIndex: index,
      curAddress: this.data.addressList[index]
    });
    if (address) {
      api.setStorage({
        key: 'address',
        data: {
          ...this.data.addressList[index]
        }
      })
      .then(res => {
        app.globalData.address = false;
        api.navigateBack({
          delta: 1
        });
      });
    }
  },
  editAddress: function (e) {
    let { index } = e.currentTarget.dataset;
    let addressObj = this.data.addressList[index];
    let { realname, sex, mobile, address, door, biao, com, id, uid  } = addressObj;
    api.navigateTo({
      url: `/pages/accountEditAddress/accountEditAddress?realname=${realname}&sex=${sex}&mobile=${mobile}&address=${address}&door=${door}&biao=${biao}&com=${com}&id=${id}&uid=${uid}`
    });
  }
})