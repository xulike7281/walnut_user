// index.js
// const app = getApp()
const { envList } = require('../../envList.js');
import {runCloud} from '../../utils/cloud'
import {
  WalnutCategoryOptinos
} from "../../config/config"
Page({
  data: {
    pageLoading:true,
    showUploadTip: false,
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    pageSize:10,
    pageNum:0,
    dataList:[],
    hasMore:true,
    showPicker:false,
    categoryName:'',
    categoryId:'',
    WalnutCategoryOptinos:WalnutCategoryOptinos
  },
   onLoad() {
   
    this.getData()
  },
  async getData(){
    this.setData({
      pageLoading:true
    })
    wx.showLoading({
      title: '加载中',
    })
    const res =   await runCloud('walnutFunctions',{
      type:'getList',
      page:this.data.pageSize, //pageSize
      num:this.data.pageNum, //
      categoryId:this.data.categoryId,
      timeStart:'all',
      timeEnd:'all',
      status:'0',
  })
  wx.hideLoading()
  console.log('re',res)
    if(res.errMsg == 'cloud.callFunction:ok'){
      if(res.result.data){
        this.setData({
          dataList:this.data.dataList.concat(res.result.data),
          hasMore:res.result.hasMore,
          pageLoading:false
        })
      }
    }
    console.log('dataList',this.data.dataList)    
  },

  getMoreData() {
    if (this.data.pagenum * this.data.pagesize >= this.data.total) {
      wx.showLoading({
          title: '数据加载完毕！',
        })
        wx.hideLoading() // 关闭loading
        return 
       }
    if(this.data.isLoading) return  //判断是否为true 
    this.setData({
      pageNum:this.data.pageNum += 1// 让页码值自增 +1
    })
    this.getData()// 重新获取列表数据
  },

  selectCategory(){
    this.setData({
      showPicker:true
    })
  },
  onPickerChange(e){
    const { key } = e.currentTarget.dataset;
    console.log('key',key)
    const { value,label } = e.detail;
    console.log('value',value[0])
    console.log('label',label[0])
    this.setData({
      categoryId:value[0],
      categoryName:label[0]=='全部'?'':label[0]
    })
    console.log('picker change:', e.detail);
    this.getData()

  },
  onColumnChange(e){
    console.log('picker pick:', e);
  },
  onPickerCancel(e){
    console.log(e, '取消');
    console.log('picker1 cancel:');
  },
  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail (res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  }
});
