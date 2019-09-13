const api = require("./../../utils/api");
const request = require("./../../utils/request");
const app = getApp();

Page({
  data: {
    addressList: [],
    curIndex: null,
    curAddress: null,
    deleteObj: {},
    isSelect: false
  },
  onShow: function() {
    this.getAddress();
  },
  getAddress: function () {
    request.getAddress()
    .then(res => {
      if (res.data.length) {
        let arr = res.data.find((element =>element.is_comment == '1'));
        this.setData({
          addressList: res.data,
          curAddress: arr
        });
      } else {
        this.setData({
          addressList: [],
        });
      }
    });
  },
  chooseItem: function(e) {
    let { index } = e.currentTarget.dataset;
    let addressObj = {
      id: this.data.addressList[index].id,
    };
    if (this.data.deleteObj.id === addressObj.id) {
      this.setData({
        curIndex: null,
        deleteObj: {},
        isSelect: false
      });
    } else {
      this.setData({
        curIndex: index,
        deleteObj: addressObj,
        isSelect: true
      });
    }
  },
  choose: function(e) {
    let { index } = e.currentTarget.dataset;
    let address = app.globalData.address;
    if (address) {
      api
        .setStorage({
          key: "address",
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
    wx.showModal({
      title: "提示",
      content: "确定要删除？",
      success(res) {
        if (res.confirm) {
          request
            .delAddress({
              ..._this.data.deleteObj
            })
            .then(res => {
              if (res.code == 0) {
                api
                  .showToast({
                    title: "删除成功",
                    icon: "none",
                    duration: 1000
                  })
                  .then(res => {
                    _this.setData({
                      isSelect: false,
                      curIndex: null
                    });
                    _this.getAddress();
                  });
              }
            });
        }
      }
    });
  },
  addbtn: function(e) {
    api.navigateTo({
      url: "/pages/accountEditAddress/accountEditAddress?controType=1"
    });
  },
  editAddress: function(e) {
    let { index } = e.currentTarget.dataset;
    let addressObj = this.data.addressList[index];
    let { realname, sex, mobile, address, door, tag, is_comment, id } = addressObj;
    api.navigateTo({
      url: `/pages/accountEditAddress/accountEditAddress?realname=${realname}&sex=${sex}&mobile=${mobile}&address=${address}&door=${door}&tag=${tag}&is_comment=${is_comment}&id=${id}&controType=2`
    });
  }
});
