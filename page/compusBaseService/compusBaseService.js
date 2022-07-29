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
    }
  },
  goDetail(e){
    console.log("e.currentTarget.dataset.type",e.currentTarget.dataset.type)
    myNavigatorTo(this.data.path[e.currentTarget.dataset.type])
  }
})