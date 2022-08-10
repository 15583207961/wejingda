import { storagename } from "../../config/storageNameconfig.js";
import { getResourceUrl,encodeURIComponentUrl } from "../../utils/useHandle.js";
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";

Page({
  data:{
    path:{
      phone:"/compusSservicecall/compusSservicecall",
      rili:"/webview/webview",
      ditu:"/map/map",
      xk:"/photoframe/photoframe",
      chatGroup:"/chatGroup/chatGroup",
      fbcx:"/fbcx/fbcx"
    },
    imageUrls:{
      xkUrl:getResourceUrl("resource/img/icon_xqxk.png"),
      riliUrl:getResourceUrl("resource/img/icon_xl.png"),
      dituUrl:getResourceUrl("resource/img/icon_dt.png"),
      phoneUrl:getResourceUrl("resource/img/icon_xydh.png"),
      fbcx:getResourceUrl("resource/img/icon_xsbd.png"),
      chatGroup:getResourceUrl("resource/img/icon_xqsq.png"),
      
    }
  },
  goDetail(e){
    console.log("e.currentTarget.dataset.type",e.currentTarget.dataset.type)
    const type = e.currentTarget.dataset.type;
    if(type === "rili"){
    myNavigatorTo(`/webview/webview?src=${encodeURIComponentUrl("https://singlestep.cn/wejinda/resource/h5/schoolcalendar/calendar.html")}`)
    }
    else if(type==="xk"){
      myToast("该服务正在维护中")
      return ;
    }
    else if(type === "fbcx"){
      myGetStorger(storagename.xsbdInfo).then(res=>{
        console.log("获取本地数据成功",res)
        const data = {
          name:res.data.sno,
          id:res.data.pws
        }
        myNavigatorTo(this.data.path[e.currentTarget.dataset.type]+"?data="+JSON.stringify(data))
      }).catch(err=>{
        console.log("获取本地数据失败")
        myNavigatorTo(this.data.path[e.currentTarget.dataset.type])
      })
    }
    else{
      myNavigatorTo(this.data.path[e.currentTarget.dataset.type])
    }
  }
})