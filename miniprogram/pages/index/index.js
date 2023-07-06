// index.js
// const app = getApp()
const { envList } = require('../../envList.js');
import {runCloud} from '../../utils/cloud'
import {
  WalnutCategoryOptinos
} from "../../config/config"
Page({
  data: {
    checkLevelList:[],
    checkCategoryList:[],
    visible:false,
    pageLoading:true,
    showUploadTip: false,
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    pageSize:100,
    pageNum:0,
    dataList:[],
    hasMore:true,
    showPicker:false,
    categoryName:'',
    categoryId:'',
    WalnutCategoryOptinos:WalnutCategoryOptinos.splice(1),
    levelOptions:[
      {
        value:'S',
        label:'1',
        desc:'（当年占比3%以内的好对子）',
        checked:false
      },
      {
        value:'A',
        label:'2',
        desc:'（当年占比10%以内的好对子）',
        checked:false
      },
      {
        value:'B',
        label:'3',
        desc:'（当年占比35%的中等偏上对子）',
        checked:false
      },
      {
        value:'C',
        label:'4',
        desc:'（当年占比50%的中等偏下对子） ',
        checked:false
        
      },
      {
        value:'D',
        label:'5',
        desc:'（一些很差的对子，主要体验皮质）'
      },
    ],
  },
   onLoad() {
   
    this.getData()
    this.initCategoryData()
  },
  async getData(isSelect){
    this.setData({
      pageLoading:true
    })
    wx.showLoading({
      title: '加载中',
    })
    console.log('this.data.checkCategoryList',this.data.checkCategoryList)
    console.log('this.data.checkLevelList',this.data.checkLevelList)
    const res =   await runCloud('walnutFunctions',{
        type:'userGetList',
        page:this.data.pageSize, //pageSize
        num:this.data.pageNum, //
        categoryList:this.data.checkCategoryList,
        levelList:this.data.checkLevelList,
    })
  wx.hideLoading()
  console.log('re',res)
    if(res.errMsg == 'cloud.callFunction:ok'){
      if(res.result.data){
        console.log(this.data.pageNum)
        console.log('isSelect',isSelect)
        if (this.data.pageNum ==0 &&isSelect) {
          this.setData({
            dataList:[]
          })
        }
        this.setData({
          dataList:this.data.dataList.concat(res.result.data),
          hasMore:res.result.hasMore,
          pageLoading:false
        })
      }
    }
    console.log('dataList',this.data.dataList)    
  },
  initCategoryData(){
    const res = this.data.WalnutCategoryOptinos
    res.map(item=>item.checked=false)
    this.setData({
      WalnutCategoryOptinos:res
    })
  },
  overlayClick(e) {
    console.log(e.detail);
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
  confirmQuery(){
    this.setData({
      pageSize:100,
      pageNum:0,
      visible:false
    })
    this.getData(true)
  },
  resetQuery(){
    // this.data.levelOptions
    // checkCategoryList
    // checkCategoryList
    let categoryres = this.data.WalnutCategoryOptinos
    let levelres = this.data.levelOptions
    categoryres.map(item=>item.checked=false)
    levelres.map(item=>item.checked=false)
    this.setData({
      WalnutCategoryOptinos:categoryres,
      levelOptions:levelres,
      checkCategoryList:[],
      checkCategoryList:[]
    })
  },
  selectCategory(){
    this.setData({
      visible:true
    })
  },
  handelLevelItem(e){
    const {id,value} = e.currentTarget.dataset
    console.log('id,value',id,value)
    const key = `levelOptions[${id-1}].checked`
    console.log('this.data.levelOptions[id-1]',this.data.levelOptions[id-1])
    this.setData({
      [key]: !this.data.levelOptions[id-1].checked
    })
    console.log('this.data.levelOptions',this.data.levelOptions)
    const checkedList = this.data.levelOptions.filter(item=>item.checked)
    console.log('checkedList',checkedList)
    let res = []
    checkedList.map(item=>res.push(item.value))
    this.setData({
      checkLevelList:res
    })
  },
  handelCategoryItem(e){
    const {id,value} = e.currentTarget.dataset
    console.log('id,value',id,value)
  
    const key = `WalnutCategoryOptinos[${id-1}].checked`
    this.setData({
      [key]: !this.data.WalnutCategoryOptinos[id-1].checked
    })
    console.log('this.data.WalnutCategoryOptinos',this.data.WalnutCategoryOptinos)
    const checkedList = this.data.WalnutCategoryOptinos.filter(item=>item.checked)
    console.log('checkedList',checkedList)
    let res = []
    checkedList.map(item=>res.push(item.value))
    this.setData({
      checkCategoryList:res
    })
  },
  handlePopup(e) {
    const { item } = e.currentTarget.dataset;

    this.setData(
      {
        cur: item,
      },
      () => {
        this.setData({ visible: true });
      },
    );
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
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
 
  onShareAppMessage(e){
    console.log('e',e)
    return {
      title:'分享给皮特吴,编号('+e.target.id+') ',
      // path:'',
      // imageUrl:'../../imgs/share.jpg'
      imageUrl:'https://7761-walnut-3g6jsxbi0e8ca417-1319138968.tcb.qcloud.la/walnut/gmkarmaq7a.jpg'
    }
  },
  // onShareTimeline(){
  //   return{
  //     title:'皮特吴精选',
  //     // imageUrl:'../../images/'
  //   }
  // }
});
