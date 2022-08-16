
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myPreviewInfos,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
Page({
  data:{
    whenValue:"",
    inputValueWhere:"",
    inputValueDesc:"",
    page:"0",
    list:[],//失物招领信息
  },
  bindDateChange(e) {
    console.log(e)
    this.setData({
      whenValue: e.detail.value
    })
  },
  // cancle
  cancle(){
    wx.navigateBack({
      delta: 1,
    })
  },
  // search
  search(){
    if(this.data.inputValueDesc||this.data.inputValueWhere||this.data.whenValue){
      const data = {
        time: this.data.whenValue,
        location: this.data.inputValueWhere,
        desc: this.data.inputValueDesc,
        page: this.data.page
      }
      myRequest("lfsearch",data,"POST").then(res=>{
        console.log("搜索成功",res)
        this.setData({
          list:res.data.foundInfoArrayList.concat(res.data.lostInfoArrayList)
        })
      }).catch(err=>{
        console.log("搜索失败",err)
      })
      return;
    }

  },
  // inputValueDesc
  inputValueDesc(e){
    console.log("inputValueDesc",e)
    const value = e.detail.value
    this.setData({
      inputValueDesc:value.trim()
    })
  },
  // inputValueWhen
  inputValueWhere(e){
    console.log("inputValueWhen",e)
    const value = e.detail.value.trim()
    this.setData({
      inputValueWhere:value
    })
  }
})