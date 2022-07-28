import {BaseRequestUrl} from "../../config/baseConfig.js"
Page({
  data:{
    src:"",
  },
onLoad(e){
  console.log(e)
 if(e.type=="clause"){
   this.setData({
    src:BaseRequestUrl+"resource/privacy/service.html"
   })
 } else if(e.type =="policy"){
    this.setData({
      src:BaseRequestUrl+"resource/privacy/private.html"
    })
 }
 wx.setNavigationBarTitle({
   title: e.type=="clause"?"《We锦大服务条款》":"《We锦大隐私政策》",
 })
},
  hanlde(e) {
    this.setData({
      id: e.currentTarget.dataset.id
    })
   
  },
})