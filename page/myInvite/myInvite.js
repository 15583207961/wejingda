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
    clsname:"option",
    curIndex:-1
  },
  onLoad(e){
this.getDataList(e.openid)
  },
  // 获取网络请求
  getDataList(openid){
    myRequest("getWorkStudyProgramInfo?role=mine&openid="+openid).then(res=>{
      console.log("获取成功",res)
      if(res.code ==200){
        this.setData({
          listData:res.data
        })
      }
    }).catch(err=>{
      console.log("获取失败了",err)
    })
  },
  // more
  more(e){
    console.log(e)
    this.setData({
      curIndex:e.currentTarget.dataset.index,
      clsname:"show option"
    })
  },
  cancle(){
    this.setData({
      clsname:"hide option"
    })
    setTimeout(()=>{
      this.setData({
        curIndex:-1,
        clsname:"option"
      })
    },200)
  },
  jump(e){
    myNavigatorTo("/webview/webview?src="+encodeURIComponentUrl(e.currentTarget.dataset.index))
  },
  connect(e){
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.index,
    })
  },
  delete(e){
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title:"提醒",
      content:`确认删除该条招聘信息`,
      success:res=>{
        if(res.confirm){
          myRequest("deleteWorkStudyProgramInfo?id="+this.data.listData[index].id).then(res=>{
            console.log("删除成功",res)
            if(res.message){
              myToast(res.message,"error")
              return;
            }
            myToast(res.data,"succress");
            let list = this.data.listData
            list.splice(index,1)
            this.setData({
              listData:list
            })
          }).catch(err=>{
            console.log("err",err)
          })
        }
      }
    })
   
  }
})