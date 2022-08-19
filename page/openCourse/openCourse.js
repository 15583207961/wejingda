import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage,
  myRedirectTo,
  myNavBarHieght
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
Page({
  data:{
     titleTop:0,
    titleHeight:0,
    topHeight:0,
    page:"0",
    openid:"",
    dataList:null,
  },
  onLoad(e){
    this.setData({
      openid:e.openid
    })
      this.getLocalDate()
      this.getReqdata(this.data.page,e.openid,"index")
  },
  // 获取本地数据
  getLocalDate(){
    // 获取手机系统信息
    myGetStorger(storagename.systemInfo).then(res=>{
      console.log("获取到的数据",res.data)
      this.setData({
        titleTop:res.data.menuTop,
        titleHeight:res.data.menuHeight,
        topHeight:res.data.menuBottom+32
      })
    })
  
  },
  // 获取浏览数据
  getReqdata(page,openid,type){
    myRequest(`GetOpenCourseInformation?page=${page}&openid=${openid}&type=${type}`).then(res=>{
      console.log("RES-->",res)
    
        this.setData({
          dataList:res.data
        })

    }).catch(err=>{
      console.log("err",err)
    })
  }
})