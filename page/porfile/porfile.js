
const baseUrl = getApp().globalData.BaseURL
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
Page({
    data:{
        userInfo:'',
        openid:null,
        appId: "wx8abaf00ee8c3202e",
        extraData : {
            id : "419686",
            customData : {
                clientInfo: `iPhone OS 10.3.1 / 3.2.0.43 / 0`,
            }
        },
        chatInfo:{}
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
          console.log("res",res)
          this.setData({
            openId:res.openid
          })
          mySetStorage(storagename.openId,res.openid)
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
    // 
    
})