import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
Page({
  data:{
    listData:null,
    openid:null
  },
  onLoad(e){
    console.log(e)
    this.setData({
      openid:e.openid
    })
    this.getData(e.openid);
  },
  // 获取网络
  getData(openid){
    myRequest("getWorkStudyProgramInfo?role=admin&openid="+openid).then(res=>{
      console.log("res",res)
      if(res.code ==200){
        this.setData({
          listData:res.data
        })
      }
      else{
        myToast(res.message)
      }
    }).catch(err=>{
      myToast("出错了","error")
      console.log("err",err)
    })
  }
})