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
    temporaryLink:null,
    descriptionValue:"",
    date:null,
    time:null,
    durationValue:null,
    classWhere:null,
    ClassNameValue:null,
    modifiyData:null,
    classId:null,
  },
  onLoad(e){
    console.log("e===>",e)
    
    if(e?.data){
      let data = JSON.parse(e?.data)
      data&&this.setData({
        temporaryLink:data.classImage,
        descriptionValue:data.courseIntroduction,
  
        classWhere:data.lectureVenue,
        ClassNameValue:data.className,
        modifiyData:data,
        openid:data.openid,
        classId:data.classId
      })
 
     
    }
    this.getLocalData()
    const content = e?.data?"修改课程信息":"创办课程"
    wx.setNavigationBarTitle({
      title: content,
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
       if(this.data.modifiyData){
         myToast("不支持修改图片");
         return;
       }
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
        durationValue : value+"h"
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

    if(!this.data.temporaryLink&&!this.data.modifiyData.classImage){
      console.log("this.data.temporaryLink",this.data.temporaryLink)
      console.log("this.data.temporaryLink",this.data.temporaryLink)
      myToast("需要上传课程插图")
      return;
    }
    if(!this.data.ClassNameValue){
      myToast("课名不能为空")
      return ;
    }
    if(!this.data.durationValue){
      myToast("时长不能为空");
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
    this.checkText(this.data.descriptionValue+this.data.date+this.data.time+this.data.durationValue+this.data.classWhere+this.data.ClassNameValue,this.data.openid).then(res=>{
      console.log("res--->",res)
      wx.showModal({
        title:"提醒",
        content:"确定创建课程",
        success:res1=>{
          if(res1.confirm){
            if(this.data.modifiyData){
              // 修改信息不支持修改图片，直接跳过上传修改信息
        
              this.modifiyInfos()
              return ;
            }
        
            if(res.data){
              this.updateImageToDB();
             
              return ;
            }
          }
          
        }
      })
      
      myToast(res.message,"error")
    }).catch(err=>{
      console.log("失败了",err)
    })
  },
  // 敏感词汇过滤
  checkText (text,openid){
  return new Promise((resolve,rej)=>{
    myRequest("checkmsg",{
      "openid":openid, 
      "scene": 2, 
      "version": 2, 
      "content": text 
      },"POST").then(res=>{
        console.log("检测成功了",res)
        resolve(res)
      }).catch(err=>{
        rej(err)
        console.log("检测失败了",err)
      })
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
  // modifiyData
  modifiyInfos(){
    let data = {
    className:this.data.ClassNameValue,
     lectureTime:this.data.date+" "+this.data.time,
     duration:this.data.durationValue,
     lectureVenue:this.data.classWhere,
     classImage:this.data.classImage,
     speaker:this.data.userName,
     courseIntroduction:this.data.descriptionValue,
     openid:this.data.openid,
     classId:this.data.classId
    }
    myRequest("ModifityApplyCourseInfo",data,"POST").then(res=>{
      console.log("申请成功",res);
      myToast("审核中")
     if(res.code ==200){
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },2000)
     }else{
       myToast(res.message)

     }
    }).catch(err=>{
      console.log("err",err)
      myToast("出错了~")
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