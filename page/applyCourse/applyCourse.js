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
import { checkText } from "../../utils/useHandle.js";
Page({
  data:{
    temporaryLink:null,
    descriptionValue:"",
    date:null,
    time:null,
    durationValue:null,
    classWhere:null,
    ClassNameValue:null
  },
  onLoad(){
    wx.setNavigationBarTitle({
      title: '创办课程',
    })
  },
  onShow(){
    console.log("------------11111>")
    this.setData({
      temporaryLink:getApp().globalData.imgSrc
    })
  },
  // 获取本地数据
  getLocalData(){
    myGetStorger(storagename.openId).then(res=>{
      console.log("res",res);
      this.setData({
        openid:res.data
      })
    })
    myGetStorger(storagename.chatInfo).then(res=>{
      console.log("res",res);
      this.setData({
        userName:res.data.name
      })
    })
  },
  // 长按删除图片
  bindtouchstart(e){
    this.startTime = e.timeStamp;
    console.log(this.startTime)  
  },
  bindtouchend(e){
    this.endtime = e.timeStamp;
     console.log(this.startTime)  
     if(this.endtime - this.startTime > 500){
       this.takePhoto()
     }else{
         //预览图片
        myPreviewInfos([{url:this.data.temporaryLink}])

     }
  },
  // takephoto
  takePhoto() {
    myNavigatorTo("/cropper/cropper?type=applyCourse").then(res=>{
      console.log("tiaozhangchengg ",res)
    }).catch(err=>{
      console.log("是啊比了",err)
    })
  },
  getDescription(e) {
    console.log(e.detail.value.trim())
    let value = e.detail.value.trim()
    this.setData({
      descriptionValue: value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value+":00"
    })
  },
  // inputClassName
  inputClassName(e){
    let value = e.detail.value.trim()
    this.setData({
      ClassNameValue:value
    })
  },
  // inputClassDuration
  inputClassDuration(e){
    let value = e.detail.value.trim()
    this.setData({
        durationValue : value
    })
  },
  // inputClassWhere
  inputClassWhere(e){
    let value = e.detail.value.trim()
    this.setData({
      classWhere:value
    })
  },
  // submit
  submit(){
    if(!this.data.temporaryLink){
      myToast("需要上传课程插图")
      return;
    }
    if(!this.data.ClassNameValue){
      myToast("课名不能为空")
      return ;
    }
    if(!this.data.classWhere){
      myToast("地点不能为空");
      return;
    }
    if(!this.data.date){
      myToast("日期不能为空")
      return;
    }
    if(!this.data.time){
      myToast("时间不能为空")
      return;
    }
    if(!this.data.descriptionValue){
      myToast("课程介绍不能为空")
      return ;
    }
    checkText(this.data.descriptionValue+this.data.date+this.data.time+this.data.durationValue+this.data.classWhere+this.data.ClassNameValue).then(res=>{
      if(res.data){
        this.updateImageToDB();
       
        return ;
      }
      myToast(res.message,"error")
    }).catch(err=>{
      console.log("失败了")
    })
  },
  // 上传图片
  updateImageToDB(){
    wx.uploadFile({
      url: 'https://singlestep.cn/wejinda/uploadimg?type=lost',
      filePath: this.data.temporaryLink,
      name: 'file',
      success:res1=> {
        console.log("ressss----->0",res1)
        const res = JSON.parse(res1.data)
        console.log("ressss----->1",res.data)
       this.updateInfos(res.data)
      }
    })
  },
  // updateInfos
  updateInfos(filePath){
    let data = {
    className:this.data.ClassNameValue,
     lectureTime:this.data.date+" "+this.data.time,
     duration:this.data.durationValue,
     lectureVenue:this.data.classWhere,
     "classImage":filePath,
     "speaker":this.data.userName,
     "courseIntroduction":this.data.descriptionValue,
     "openid":this.data.openid
    }
    myRequest("ApplyCourse",data,"POST").then(res=>{
      console.log("申请成功",res);
      myToast("审核中")
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },2000)
    }).catch(err=>{
      console.log("err",err)
      myToast("出错了~")
    })
  }
})