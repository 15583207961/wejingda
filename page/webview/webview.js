import { decodeURIComponentUrl } from "../../utils/useHandle"

Page({
  data:{
    src:null
  },
  onLoad(e){
    console.log(e) 
    var src = decodeURIComponentUrl(e?.src)
    console.log("src=======>解码后",src)
    this.setData({
      src:src
    })
    wx.setNavigationBarTitle({
      title: '详情页面',
    })
  }
})