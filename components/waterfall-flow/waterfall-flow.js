// components/waterfall-flow/waterfall-flow.js
import EventType from "../../common/EventType.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataInfoList:{
      type:Array,
      value:[]
    }
  }, 

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {


// 去失物招领详情页面
goItemDetail(e){
  console.log("e",e)
  console.log("this.data",this.data)
  console.log("this.properties",this.properties)
  const index = e.currentTarget.dataset.index
  wx.navigateTo({
    url: '../../page/swzlItemDetail/swzlItemDetail',
    success:res=>{
      res.eventChannel.emit(EventType.SWZLgoItemDetail,{data:this.data.dataInfoList[index]})
    }
  })
}
  }
})
