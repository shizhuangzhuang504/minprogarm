const api = require("./utils/api");
const request = require("./utils/request");

App({
  globalData: {
    userInfo: {},
    shopInfo: {},
    goodsPrice: ""
  },
  onLaunch: function() {
    this.globalData["userInfo"] =  wx.getStorageSync("userInfo");
    this.getShopList();
    this.getAuthorize();
  },
  getShopList: function() {
    api
      .getLocation()
      .then(res => {
        let { latitude, longitude } = res;
        return request.getShopList({
          latitude,
          longitude
        });
      })
      .then(res => {
        if (res.length) {
          this.globalData.shopInfo = res[0];
        }
      });
  },
  getAuthorize: function() {
    //  地理位置授权申请
    // api.authorize({
    //   scope: 'scope.userLocation'
    // });
  },
  userLogin: function(getUserInfo, page) {
    let { userInfo, rawData, signature } = getUserInfo.detail;
    let userInfos = JSON.stringify(userInfo);
    if (!userInfos) {
      return Promise.reject();
    } else {
      return api
        .login()
        .then(res => {
          let { code } = res;
          if (code) {
            return request.userLogin({
              code,
              userInfos,
              rawData,
              signature
            });
          }
        })
        .then(res => {
          if (res) {
            let Authorization =  res.access_token ?  `${res.token_type} ${res.access_token}`: '';
            let newUserInfo = {
              Authorization,
              loginStatus: true,
              ...userInfo
            };
            page &&
              page.setData({
                userInfo: newUserInfo
              });
            this.globalData["userInfo"] = newUserInfo;
            wx.setStorageSync("userInfo", newUserInfo);
            wx.setStorageSync("session_key", res.session_key);
            return true;
          } else {
            return Promise.reject();
          }
        });
    }
  }
});
