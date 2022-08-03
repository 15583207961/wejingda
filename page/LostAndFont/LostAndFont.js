import EventType from "../../common/EventType.js";
Page({
  data:{

  },
  

  /**
   * 内部函数
   */





  /**
   * 自定义绑定函数
   */

  //  去搜索详情页面
  goSreachPage(){
    console.log("nhao")
    wx.navigateTo({
      url: '../../page/swzlSreach/swzlSreach',
    })
  },


  // 去发布失物招领页面
  goAddPage(){
    console.log("跳转到添加详情页面")
    wx.navigateTo({
      url: '../../page/swzlAdd/swzlAdd',
    })
  }
})