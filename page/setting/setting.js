import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage,
  myModal
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
            myRemoveStorage(storagename.localNo)
            var quitLoginFlag = getApp().globalData.quitLoginFlag;
            quitLoginFlag.jww=false;
            quitLoginFlag.ykt=false;
            quitLoginFlag.tsg=false;
            getApp().globalData.quitLoginFlag = quitLoginFlag;

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


  
  goAbout(){
    myNavigatorTo(`/about/about`)
  },

  // 退出登录
  quitLogin(e){
   var quitLoginFlag =  getApp().globalData.quitLoginFlag;
    let typeName = {
      jww:"教务网",
      tsg:"图书馆",
      ykt:"一卡通",
      xsbd:"分班查询"
    }
    let type = e.currentTarget.dataset.type
    myModal("警告",`确认退出${typeName[type]}账号登录`).then(res=>{
      if(res.confirm){
        switch(type){
          case "jww":
            quitLoginFlag.jww =true;
            myRemoveStorage(storagename.jwwInfo)
            break;
          case "ykt":
            quitLoginFlag.ykt= true;
            myRemoveStorage(storagename.yktInfo)
            break;
          case "tsg":
            quitLoginFlag.tsg = true;
            myRemoveStorage(storagename.tsgInfo);
            break;
          case "xsbd":
            myRemoveStorage(storagename.xsbdInfo);
            break;
        }
        myToast("退出登录成功")
      }
    })
  }
})
