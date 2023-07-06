const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoUrl: {
      type: String,
      value: ''
    }
  },
  ready() {

  },
  attached() {
    // 获取随机数字 给video标签id命名 可使用时间戳
    var random = Math.floor(Math.random() * 1000);
    // 全局获取 屏幕高度宽度
    var { screenHeight } = app.globalData
    this.setData({
      screenHeight,
      random
    })
    var that = this
    var screenHeight = screenHeight //获取屏幕高度


    let topBottomPadding = screenHeight /2
    console.log('topBottomPadding1',topBottomPadding)
    // 获取试图目标元素  
    const videoObserve = wx.createIntersectionObserver(this)
    // 设置试图可见区域
    let p = { top: -topBottomPadding + 60, bottom: -topBottomPadding-10 }
    console.log('top-bottom',p)
    this.observe = videoObserve.relativeToViewport(p)


    // // 暂存随机
    var random = that.data.random
    this.observe.observe(`#vids${that.data.random}`, (res) => {
      let { intersectionRatio } = res
      // var videoNow = wx.createVideoContext(res.id,that)
      if (intersectionRatio > 0) {
        //离开视界，因为视窗占比>0，开始播放

        // that.setData({

        //   playstart: true

        // })
        //进入视界，开始播放
        console.log('start',res);
        wx.createVideoContext(res.id,that).play()
        wx.createVideoContext('vids',that).play()
        // that.observe.disconnect()


      } else {
        // 离开试图 暂停播放
        console.log('stop',res);
        wx.createVideoContext('vids',that).pause()

        wx.createVideoContext(res.id,that).pause()
        // that.observe.disconnect()
        // that.setData({

        //   playstart: false

        // })
      }
    })

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    playstart: false,
    screenHeight: "",
    screenWidth: "",
    random: '',
  },

  /**
   * 组件的方法列表
   */

  onShow() {
    
  },
  methods: {

  
  }
})