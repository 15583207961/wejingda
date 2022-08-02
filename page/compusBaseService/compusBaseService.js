import { getResourceUrl } from "../../utils/useHandle.js";
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
      rili:"/calendar/calendar",
      ditu:"/map/map",
      xk:"/photoframe/photoframe"
    },
    imageUrls:{
      xkUrl:getResourceUrl("resource/img/icon_xqxk.png"),
      riliUrl:getResourceUrl("resource/img/icon_xl.png"),
      dituUrl:getResourceUrl("resource/img/icon_dt.png"),
      phoneUrl:getResourceUrl("resource/img/icon_xydh.png"),
    }
  },
  goDetail(e){
    console.log("e.currentTarget.dataset.type",e.currentTarget.dataset.type)
    myNavigatorTo(this.data.path[e.currentTarget.dataset.type])
  }
})