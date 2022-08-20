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
    appearcloseAnima:false,
    showModal:false,
    modalData:null,
    modalIndex:null,
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
  },
  // goDetail
  goDetail(e){
      console.log("e",e)
      const index  = e.currentTarget.dataset.index;
      
      this.setData({
        showModal:true,
        modalData:this.data.dataList[index],
        modalIndex:index
      })
     

  },
  // cancel
  cancel(){
    this.setData({
      appearcloseAnima:true
    })
    setTimeout(()=>{
      this.setData({
        showModal:false,
        appearcloseAnima:false
      })
    },190)
  },
  // apply
  apply(){
    let itemdata = this.data.modalData;
    const applied = itemdata.applied;
    let type = "insert";
    if(applied){
      type="delete"
      itemdata.applied = false;
      itemdata.peopleNumber = +itemdata.peopleNumber - 1
    }else{
      itemdata.applied = true
      itemdata.peopleNumber = +itemdata.peopleNumber + 1
    }
    if(type == "delete"){
      wx.showModal({
        title:"提示",
        content:"确定取消课堂报名",
        success:res=>{
          if(res.confirm){
            this.applyAndDelete(type,itemdata)
          }
          else{
            this.setData({
              appearcloseAnima:false,
              showModal:false
            })
          }
        }
      })
    }else{
      this.applyAndDelete(type,itemdata)
    }
   
  },
  // 报名和取消报名
  applyAndDelete(type,itemdata){
    myRequest(`ApplyClasses?openid=${this.data.openid}&classId=${this.data.modalData.classId}&type=${type}`).then(res=>{
      console.log("报名成功",res)
      let dataList = this.data.dataList;
      dataList[this.data.index] = itemdata;
      this.setData({
        dataList:dataList,
        appearcloseAnima:true
      })
      setTimeout(()=>{
        this.setData({
          appearcloseAnima:false,
          showModal:false
        })
      },190)
    }).catch(err=>{
      console.log("报名失败",err)
    })
  },
  // goback
  goback(){
    wx.navigateBack({
      delta: 1,
    })
  },
  // applyCourse
  applyCourse(){
    myNavigatorTo("/applyCourse/applyCourse")
  }
})