const app = getApp();

import { getIndexData, getCoupons, getTemlIds} from '../../api/api.js';
import { getUserInfo} from '../../api/user.js';
import { CACHE_SUBSCRIBE_MESSAGE } from '../../config.js';
import Util from '../../utils/util.js';
import wxh from '../../utils/wxh.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    itemNew:[],
    activityList:[],
    menus: [],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '瓦舍茶馆',
      'color': true,
      'class': '1'
    },
    window: false,
    iShidden:false,
    navH: "",
    userInfo:{},
  },
  closeTip:function(){
    wx.setStorageSync('msg_key',true);
    this.setData({
      iShidden:true
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxh.selfLocation(1);
    this.setData({
      navH: app.globalData.navHeight
    });
    if (options.spid) app.globalData.spid = options.spid;
    if (options.scene) app.globalData.code = decodeURIComponent(options.scene);
    if (wx.getStorageSync('msg_key')) this.setData({ iShidden:true});
    this.getTemlIds();
    this.getUserInfo();
  },

  chongzhi:function(){
    wx.navigateTo({
      url: '/pages/user_money/index',
    })
  },
  zhifu:function(){
    wx.navigateTo({
      url: '/pages/user_money_pay/index',
    })
  },
  getUserInfo:function(){
    var that=this;
    getUserInfo().then(res=>{
      const generalContent="generalContent.promoterNum";
      that.setData({ 
        userInfo: res.data, 
        loginType: res.data.login_type,
        orderStatusNum: res.data.orderStatusNum,
      });
    });
  },
  getTemlIds(){
    let messageTmplIds = wx.getStorageSync(CACHE_SUBSCRIBE_MESSAGE);
    if (!messageTmplIds){
      getTemlIds().then(res=>{
        if (res.data) 
          wx.setStorageSync(CACHE_SUBSCRIBE_MESSAGE, JSON.stringify(res.data));
      })
    }
  },
  catchTouchMove: function (res) {
    return false
  },
  onColse:function(){
    this.setData({ window: false});
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getIndexConfig();
    if(app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
  },
  get_issue_coupon_list:function(){
    var that = this;
    getCoupons({page:1,limit:3}).then(res=>{
      that.setData({ couponList: res.data });
      if (!res.data.length) that.setData({ window: false });
    });
  },
  getIndexConfig:function(){
    var that = this;
    getIndexData().then(res=>{
      that.setData({
        // imgUrls: res.data.banner,
        menus: res.data.menus,
        itemNew: res.data.roll,
        activityList: res.data.activity,


        likeInfo: res.data.likeInfo,
        lovelyBanner: res.data.lovely.length ? res.data.lovely[0] : {},
        benefit: res.data.benefit,
        logoUrl: res.data.logoUrl,
        couponList: res.data.couponList,
        newGoodsBananr: res.data.newGoodsBananr
      });
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            that.setData({ window: that.data.couponList.length ? true : false });
          } else {
            that.setData({ window: false, iShidden: true});
          }
        }
      });
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ window:false});
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getIndexConfig();
    if (app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})