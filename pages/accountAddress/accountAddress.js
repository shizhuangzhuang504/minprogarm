const api = require('./../../utils/api');
const request = require('./../../utils/request');
const app = getApp();

Page({
  data: {
    addressList: [],
    curIndex: 0,
    curAddress: null,
    deleteObj: {}
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
  chooseItem: function(e) {
    let { index } = e.currentTarget.dataset;
    let addressObj = {
      id: this.data.addressList[index].id,
      upid: this.data.addressList[index].uid
    };
    console.log(e);
    // deleteObj
    this.setData({
      curIndex: index,
      deleteObj: addressObj
    });
  },
  choose: function (e) {
    let { index } = e.currentTarget.dataset;
    let address = app.globalData.address;
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
  deleteAddress: function(e) {
    let _this = this; 
    let { id, upid } = _this.data.deleteObj;
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success(res) {
        if (res.confirm) {
          request.delAddress({
            ..._this.data.deleteObj
          }).then(res => {
            if (res.status_code) {
              api.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 1000
              }).then(res => {
                _this.getAddress();
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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