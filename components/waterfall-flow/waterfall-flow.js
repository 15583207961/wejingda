// components/waterfall-flow/waterfall-flow.js
import EventType from "../../common/EventType.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  }, 

  /**
   * 组件的初始数据
   */
  data: {
    data:[
      "hhahahhahaaaaaaaaaahhahahahhahahahaha",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsayhuahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsayhuahuhauahguaguauaguaguagugafyafsayhuahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsayhuahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
      "huahuhauahguaguauaguaguagugafyafsay",
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {


// 去失物招领详情页面
goItemDetail(e){
  console.log("e",e)
  const {id} = e.currentTarget
  wx.navigateTo({
    url: '../../page/swzlItemDetail/swzlItemDetail',
    success:res=>{
      res.eventChannel.emit(EventType.SWZLgoItemDetail,{data:{
        headImg:"https://upfile2.asqql.com/upfile/hdimg/wmtp/wmtp/2016-1/27/19186sAkacEsSN2.jpg",
        useName:"用户昵称",
        sendTime:"2022-6-22",
        where:"A教202",
        getTime:"6月14日",
        descript:"这里是描述 值号各都长族科受还运子党走走,这里是描述 值号各都长族科受还运子党走走,这里是描述 值号各都长族科受还运子党走走,这里是描述 值号各都长族科受还运子党走走,这里是描述 值号各都长族科受还运子党走走,",
        thingImg:"https://upfile2.asqql.com/upfile/hdimg/wmtp/wmtp/2016-1/27/19186sAkacEsSN2.jpg"
      }})
    }
  })
}
  }
})
