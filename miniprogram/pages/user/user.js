// pages/user/user.js

import {runCloud} from '../../utils/cloud'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo : {},
    nickName: '',
    avatarUrl: '../../static/imgs/132.jpg',
    mobile:'',
    orderList:[]
  },
  getPhoneNumber(e){
    console.log('手机号码',e)
    var that = this;
    wx.cloud.CloudID
    runCloud('getMobile',{
            weRunData: wx.cloud.CloudID(e.detail.cloudID),
        }).then(res => {
          console.log('res2222',res)
            that.setData({
                mobile: res.result.phoneNumber,
            })
            console.log('that.data.userInfo',that.data.userInfo)
         
            runCloud('userFunctions',{
              type:'createUser',
              mobile:res.result.phoneNumber
            }).then(res => {
              console.log('用户信息', res)
              if (res.result.code == 0) {
                wx.setStorageSync('userInfo', JSON.stringify(res.result.data) )
                this.setData({
                  userInfo:res.result.data,
                })
                this.getOrderData()
              }
            })
        }).catch(err => {
            console.error(err);
        });
  },
  getUserProfile(e) {
    console.log('e', e)
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('res', JSON.parse(res.rawData))
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      runCloud('userFunctions',{
          type:'createUser',
            ...JSON.parse(res.rawData),
        }).then(res => {
          console.log('用户信息', res)
          if (res.result.code == 0) {
            wx.setStorageSync('userInfo', JSON.stringify(res.result.data) )
            this.setData({
              userInfo:res.result.data,
            })
            if(this.data.userInfo.mobile){
              this.getOrderData()
            }
          }
        })
      }
    })
  },
  getUserData(e) {
   
    return
    wx.cloud.callFunction({
      name: 'userFunctions',
      data: {
        type: 'getUserData',
      },
    }).then(res => {
      console.log('获取 用户信息', res)
      if (res.result.data) {
        this.setData({
          avatarUrl: res.result.data.avatarUrl,
          nickName: res.result.data.nickName
        })
      }

    })

  },
  handleItem(e) {
    console.log('-----', e.currentTarget)
    const {
      page,
      type,
      title
    } = e.currentTarget.dataset
    console.log('page,type', page, type)
    wx.navigateTo({
      url: page + '?type=' + type + '&title=' + title,
    })
  },
  toMoreData(){
    wx.navigateTo({
      url: '/pages/moreData/moreData',
    })
  },
  getOrderData(){
    wx.showLoading({ 
      title: '加载中...', 
    }) 
    runCloud('orderFunctions',{ 
        type:'getBy', 
        key:'consigneePhone', 
        value:this.data.userInfo.mobile,
        orderStatus:"1"
    }).then(res=>{ 
      console.log('getlist',res.result.data) 
      this.setData({
        orderList:res.result.data
      })
      console.log('orderList',this.data.orderList)
      wx.hideLoading()  
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      // this.getUserData()
      this.setData({
        userInfo:wx.getStorageSync('userInfo') && JSON.parse(wx.getStorageSync('userInfo'))
      })
    console.log('this.data.userInfo',this.data.userInfo)
      this.getOrderData(this.data.userInfo.mobile)
      
      console.log('---')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('this.data.userInfo',this.data.userInfo)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})