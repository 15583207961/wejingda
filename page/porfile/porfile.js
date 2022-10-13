

import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
import {getUserInfos}  from "../../utils/getUserInfo.js"
import { getResourceUrl } from "../../utils/useHandle.js";
Page({
    data:{
        userInfo:'',
        openid:null,
        chatInfo:{},
        toolsUrl:getResourceUrl("resource/img/icon_xfjl.png"),
        msgUrl:getResourceUrl("resource/img/icon_msg.png"),
        mySendURl:getResourceUrl("resource/img/icon_wd_fb.png"),
        AMInfo:null
    },
    // 页面加载
   onShow(){
    this.getlocalInfo()
   },
    // 页面加载查看是否有openId,获取本地数据
    getlocalInfo(){
      myGetStorger(storagename.openId).then(res=>{
        this.setData({
          openid:res.data
        })
      })
      myGetStorger(storagename.chatInfo).then(res=>{
        console.log("数据",res);
        this.setData({
          chatInfo :res.data
        })
      }),
      myGetStorger(storagename.AMInfo).then(res=>{
        console.log("shuju ",res)
        this.setData({
          AMInfo:res.data
        })
      })
    },
    // 或本地是否授权过
    isGetOpenId(){
      if(!this.data.openid){
        this.getUserProfile()
      }
      else{
          wx.showToast({
            title: '已授权,进设置取消授权',
            icon:'none'
          })
        }
    },
    //获取用户授权
    getUserProfile(cb){
      
  },
    // 点击复制
    handle_copy(){
      wx.setClipboardData({
        //要复制的数据
         data:"95547598",
         success: function (res) {
           wx.showToast  ({
             title: 'QQ号复制成功,进群反馈',
             icon: 'none',
             duration: 2000,
           });
         }
       });
    },
    // 点击跳转到详情页面
    to_detail(){
      if(!this.data.openid){
        getUserInfos().then(res=>{
          console.log("res===>1",res)
          this.setData({
            openId:res.data.openid
          })
          mySetStorage(storagename.openId,res.data.openid)
          wx.navigateTo({
            url: '../../page/setting/setting',
          })
        })
      }
      else{
        wx.navigateTo({
          url: '../../page/setting/setting',
        })
      }

    },
    // toMsgList 去消息列表
    toMsgList(){
      myNavigatorTo("/msgList/msgList")
    },
    // toMySend去我发布页面
    toMySend(){
      myNavigatorTo("/mySendInfo/mySendInfo")
    },
    // toMyCourse
    toMyCourse(){
      myNavigatorTo("/myCourse/myCourse")
    },
    // toMyInvite
    toMyInvite(){
      if(this.data.openid){
        myNavigatorTo("/myInvite/myInvite?openid="+this.data.openid)
      }else{
        getUserInfos().then(res=>{
          console.log("授权成功",res)
          this.setData({
            openid:res.data.openid
          })
          mySetStorage(storagename.openId,res.data.openid)
          myNavigatorTo("/myInvite/myInvite?openid="+res.data.openid)
        }).catch(err=>{
          console.log("err",err)
        })
      }
     
    },
    // checkMsg
    checkMsg(){
      if(this.data.openid){
        myNavigatorTo("/checkMsg/checkMsg?openid="+this.data.openid)
      }else{
        getUserInfos().then(res=>{
          console.log("授权成功",res)
          this.setData({
            openid:res.data.openid
          })
          mySetStorage(storagename.openId,res.data.openid)
          myNavigatorTo("/checkMsg/checkMsg?openid="+this.data.openid)
        }).catch(err=>{
          console.log("err",err)
        })
      }
    }
    
})