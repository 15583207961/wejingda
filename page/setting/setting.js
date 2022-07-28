import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import {storagename} from "../../config/storageNameconfig.js"

Page({
    data:{
        openId:null,
        showAboutsubItem:false,
    },

    // 清空云端数据
    clearData(){
      wx.showModal({
        title:"警告",
        content:"确认清除云端数据",
        success:res=>{
          console.log("res====>1",res)
          this.data.openId&&res.confirm&&myRequest("clearinfo?openID="+this.data.openId,{},"POST").then(res=>{
            res?.data&&myToast(res.data);
            res?.message&&myToast(res.message);
            myRemoveStorage(storagename.balanceInfo)
            myRemoveStorage(storagename.borrowInfo)
            myRemoveStorage(storagename.jwwInfo)
            myRemoveStorage(storagename.tsgInfo)
            myRemoveStorage(storagename.yktInfo)
          }).catch(err=>{
            myToast("网络异常")
          })
        }
      })
    },
  


  onShow(){
      myGetStorger(storagename.openId).then(res=>{
        console.log("获取成功",res);
        this.setData({
          openId:res.data
        })
      })
  },
  // 点击取消


  // 
  handleAbout(){
    this.setData({
      showAboutsubItem:!this.data.showAboutsubItem
    })
    // wx.navigateTo({
    //   url: "../../page/about/about",
    // })
  },
  
  goDetail(e){
    console.log("datat",e)
    myNavigatorTo(`/about/about?type=${e.currentTarget.dataset.type}`)
  }
})
