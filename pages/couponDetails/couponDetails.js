const api = require("./../../utils/api");
const request = require("./../../utils/request");
import wxbarcode from '../../utils/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coupon: {}
  },

  onLoad: function() {
    api
      .getStorage({
        key: "coupondetails"
      })
      .then(res => {
        if (res.data) {
          res.data["ruleList"] = (res.data.rule || "").split("\n");
          this.setData({
            coupon: res.data,
            barCode: "1234567890123456789"
          });
          wxbarcode.barcode('barcode', '1234567890123456789', 680, 200);
        }
      });
  },
  onShow: function() {},
  // 毫秒时间转换
  changetime: function(num) {
    function setDb(num) {
      if (num < 10) {
        return "0" + num;
      } else {
        return "" + num;
      }
    }
    var time = new Date(num * 1000);
    var year = time.getFullYear(); //年
    var mon = setDb(time.getMonth() + 1); //0
    var day = setDb(time.getDate()); //24
    var res = year + "年" + mon + "月" + day + "日";
    return res;
  }
});
