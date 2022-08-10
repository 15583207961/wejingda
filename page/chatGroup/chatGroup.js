import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myPreviewInfos,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
Page({
  data: {
    curIndex: -1,
    list: [{
      headpic: "../../static/public/bg_top.png",
      name: "单片机协会",
      describe: "单片机协会，听着名字就很牛逼，做自己想要的电路板，开发自己的硬件设备，大佬带你开发自己的小车，感兴趣的小伙伴，快来上车，向芯片进攻。",
      qqnumber: "187665360"
    }, {
      headpic: "../../static/public/bg_top.png",
      name: "锦城日语聊吧",
      describe: "简介：锦城日语聊群是提供给锦城学院所有喜欢日语的一个交流平台，群里高手如云，每天都在学习打卡，相互帮助共同进步，欢迎喜欢日语的小伙伴加入群聊",
      qqnumber: "98870091"
    }, {
      headpic: "../../static/public/bg_top.png",
      name: "考研上岸",
      describe: "简介：单片机协会，听着名字就很牛逼，做自己想要的电路板，开发自己的硬件设备，大佬带你开发自己的小车，感兴趣的小伙伴，快来上车，向芯片进攻。",
      qqnumber: "187665360"
    }, {
      headpic: "../../static/public/bg_top.png",
      name: "CTF黑客群聊",
      describe: "简介：单片机协会，听着名字就很牛逼，做自己想要的电路板，开发自己的硬件设备，大佬带你开发自己的小车，感兴趣的小伙伴，快来上车，向芯片进攻。",
      qqnumber: "187665360"
    }, {
      headpic: "../../static/public/bg_top.png",
      name: "校园英语角",
      describe: "简介：单片机协会，听着名字就很牛逼，做自己想要的电路板，开发自己的硬件设备，大佬带你开发自己的小车，感兴趣的小伙伴，快来上车，向芯片进攻。",
      qqnumber: "187665360"
    }]
  },
  showCompleteInfo(e) {
    console.log("e", e)
    let index = e.currentTarget.dataset.index
    console.log("idnex", index)
    this.setData({
      curIndex: this.data.curIndex == +index ? -1 : index
    })
  },
  // 
  copynum(e) {
    console.log("点击了", e)
    wx.setClipboardData( {
        data: e.currentTarget.dataset.num,
        success:res=>{
            myToast("QQ群号复制成功")
            console.log("成功了复制")
        },
        fail:err=>{
          console.log("失败了",err)
        }
      }
    )
  }

})