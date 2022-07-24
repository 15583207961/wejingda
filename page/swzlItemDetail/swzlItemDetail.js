// page/swzlItemDetail/swzlItemDetail.js
import EventType from "../../common/EventType.js";
Page({
  data: {
      itemData:{}
  },

  /**
   * 
   * 生命周期函数
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on(EventType.SWZLgoItemDetail,(e)=>{
      console.log("页面传递过来的数据",e)
      this.setData({
        itemData:e.data
      })
    })
  },





  /**
   * 自定义函数
   */
  connect(){
    console.log("点击了联系他")
  }

  
})