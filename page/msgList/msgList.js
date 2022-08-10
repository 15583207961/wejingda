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
    msglist:[],
    openid:null,
  },
  onLoad(){

    myGetStorger(storagename.openId).then(res=>{
      console.log("获取到openid",res)
      this.setData({
        openid:res.data
      })
      this.getListPerson(res.data)
    }).catch(err=>{
      console.log("本地还没有openid",err)
      myGetStorger(storagename.getmsglistmqtt).then(res=>{
        console.log("获取到了数据",res)
        this.setData({
          msglist:res.data
        })
      })
    })
    // this.getMsgList()
  },
  //获取消息列表
  getListPerson(openid){
  myRequest(`getmsglist?id=${openid}`,{},"POST").then(res=>{
    console.log("获取成功消息列表",res);
    this.setData({
      msglist:res.data.personMsgArrayList
    })
  })
  },
  // 获取消息列表
  // getMsgList(){
  //   const getmsglistmqtt = getApp().globalData.getmsglistmqtt
  //   if(!getmsglistmqtt){
      
  //   }else{
  //     this.setData({
  //       msglist:getmsglistmqtt
  //     })
  //   }
  //   console.log("this.data.msglist",this.data.msglist)
  // },
  clickItem(e){
    console.log("e",e)
    const data  = this.data.msglist[e.currentTarget.dataset.index];
    data.myOpenID = this.data.openid
    myNavigatorTo("/chatRoom/chatRoom?data="+JSON.stringify(data)
  )}
})