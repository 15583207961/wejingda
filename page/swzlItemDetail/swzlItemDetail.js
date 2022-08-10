// page/swzlItemDetail/swzlItemDetail.js
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myPreviewInfos,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import EventType from "../../common/EventType.js";
import { storagename } from "../../config/storageNameconfig.js";
import { getUserInfos } from "../../utils/getUserInfo.js";
Page({
  data: {
      itemData:{}
  },

  /**
   * 
   * 生命周期函数
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on(EventType.SWZLgoItemDetail,(e)=>{
      console.log("页面传递过来的数据",e)
      this.setData({
        itemData:e.data
      })
    })
    
  },


//预览图片

preview() {
  myPreviewInfos([{url:this.data.itemData.fileUrl}])
},


  /**
   * 自定义函数
   */
  connect(){
    console.log("点击了联系他")
    let data = {
      receiverID:this.data.itemData.userID,
    
      nickName:this.data.itemData.userNickName,
      userImg:this.data.itemData.userImage,
      topicName:null
    }
    myGetStorger(storagename.openId).then(res=>{
      console.log("本地有openid",res)
      data.myOpenID = res.data;
      myRequest(`checktopic?senderid=${res.data}&receiverid=${this.data.itemData.userID}`,{},"POST").then(res=>{
        console.log("获取到的topicNAme",res)
        data.topicName = res.data;
        myNavigatorTo(`/chatRoom/chatRoom?data=${JSON.stringify(data)}`)
      }).catch(err=>{
        console.log("获取失败",err)
        myNavigatorTo(`/chatRoom/chatRoom?data=${JSON.stringify(data)}`)
      })
       
    }).catch(err=>{
      console.log("本地没有openid");
      getUserInfos().then(res=>{
        console.log("授权成功",res.data.openid)
        data.myOpenID = res.data.openid
        mySetStorage(storagename.openId,res.data.openid)
        myNavigatorTo(`/chatRoom/chatRoom?data=${JSON.stringify(data)}`)
      }).catch(err=>{
        console.log("授权失败",err)
      })
    })
    
   
  }

  
})