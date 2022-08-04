
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
import {getUserInfos} from "../../utils/getUserInfo"
const dataInfo = getApp().globalData.swzlDataInfo||[]
const pages = getApp().globalData.page||0
Page({
  data:{
    swzlDataList:[],//失物招领的渲染信息
    netWorkErr:false,//网络出错了
    pagelast:pages,
  },
  

  /**
   * 内部函数
   */
  onLoad(){
    
    !dataInfo.length?this.getLostInfo(0):this.setData({
      swzlDataList:dataInfo
    })
  },
  onReachBottom(){
    console.log("触底了")
    this.getLostInfo(this.data.pagelast)
  },
  onPullDownRefresh(){
    console.log("下拉刷新")
    this.getLostInfo(this.data.pagelast)
  },
  //获取失物招领数据
  getLostInfo(pages){
    myRequest(`lostfound?type=all&userID=null&page=${pages}`).then(res=>{
      console.log("获取到了数据~",res);
      let reqData = res.data.foundInfoArrayList
      if(!reqData.length){
        myToast("没有更多数据了~")
        return;
      }
      let  dataInfocurr = [...this.data.swzlDataList,...reqData];
      console.log("dataInfocurr==>",dataInfocurr)
      
      this.setData({
        swzlDataList:dataInfocurr,
        pagelast:this.data.pagelast+1
      }),
      getApp().globalData.page=this.data.pagelast+1;
      getApp().globalData.swzlDataInfo=dataInfocurr;
    }).catch(err=>{
      console.log("获取失败了",err)
      myToast("出错了,请稍后重试")
      this.setData({
        netWorkErr:true
      })
    })
  },





  /**
   * 自定义绑定函数
   */

  //  去搜索详情页面
  goSreachPage(){
    console.log("nhao")
    wx.navigateTo({
      url: '../../page/swzlSreach/swzlSreach',
    })
  },


  // 去发布失物招领页面
  goAddPage(){
    console.log("跳转到添加详情页面")
    myGetStorger(storagename.openId).then(res=>{
      console.log("获取到了",res);
      this.myNavGoto(res.data)
    }).catch(err=>{
      getUserInfos().then(res=>{
        console.log("获取到的数据",res)
        this.myNavGoto(res.data.openid)
        mySetStorage(storagename.openId,res.data.openid)
      }).catch(err=>{
        myToast("授权失败","error")
        console.log(err)
      })
    })
    
  },
  myNavGoto(openid){
    wx.navigateTo({
      url: '../../page/swzlAdd/swzlAdd?openid='+openid,
    })
  }
})