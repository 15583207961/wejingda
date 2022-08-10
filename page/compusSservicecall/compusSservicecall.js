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
    id:0,
    phoneInfos:[],//电话信息
  },
  onLoad(){
    console.log("comphuahugaugw1笑话你=----------------------------------------------------------------------")
    myGetStorger(storagename.phoneInfo).then(res=>{
      this.setData({
        phoneInfos:res.data
      })
    }).catch(err=>{
      console.log("失败了",err)
    })

   
    getApp().globalData.modifityFlag&&this.getModifityInfo().then(res=>{
        console.log("返回的数据111",res)
        let arr =res.modifyArrayList.filter(item=> item.name === "SchoolPhoneInfo")
        myGetStorger(storagename.phoneHash).then(reslocal=>{
          if(arr.length&&arr[0].modify != reslocal.data){
            mySetStorage(storagename.phoneHash,arr[0].modify);
            this.getPhoneList();
            console.log("1==>")
          }
          console.log("2==>")

        }).catch(err=>{
          mySetStorage(storagename.phoneHash,arr[0]?.modify)
          this.getPhoneList();
          console.log("本地没有数据",err)
        })
       
        getApp().globalData.modifityFlag = false;
      }).catch(err=>{
        console.log("yich",err)
        !this.data.phoneInfos.length&&myToast("网络异常，请稍后尝试")
      })
  
  },

  //发送请求获取修改裂变信息
  getModifityInfo(){
  return  new Promise((resolve,rej)=>{
    myRequest("modify").then(res=>{
      console.log("获取到baseInfo信息",res)
     resolve(res.data);
    }).catch(err=>{
      console.log("获取失败",err)
      rej(err)
    })
   }) 
  },
  //
  // 获取电话列表
  getPhoneList(){
    myRequest("schoolphone").then(res=>{
      console.log("res电话列表",res)
      mySetStorage(storagename.phoneInfo,res.data)
      this.setData({
        phoneInfos:res.data
      })
    }).catch(err=>{
      console.log("err获取失败",err)
    })
  },
  // 店电话
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  hanlde(e){
    this.setData({
      id:e.currentTarget.dataset.id
    })
  }
})