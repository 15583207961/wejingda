import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";

Page({
  data:{
    msglist:[],
    openid:null,
  },
  onLoad(){

    myGetStorger(storagename.openId).then(res=>{
      console.log("获取到openid",res)
      this.setData({
        openid:res.data
      })
      this.getListPerson(res.data)
    }).catch(err=>{
      console.log("本地还没有openid",err)
      myGetStorger(storagename.getmsglistmqtt).then(res=>{
        console.log("获取到了数据",res)
        this.setData({
          msglist:res.data
        })
      })
    })
    // this.getMsgList()
  },
  // onShow(){
  //  if(this.data.openid){
  //    this.getListPerson(this.data.openid)
  //  }else{
  //   myGetStorger(storagename.openId).then(res=>{
  //     console.log("获取到openid",res)
  //     this.setData({
  //       openid:res.data
  //     })
  //     this.getListPerson(res.data)
  //   }).catch(err=>{
  //     console.log("本地还没有openid",err)
  //     myGetStorger(storagename.getmsglistmqtt).then(res=>{
  //       console.log("获取到了数据",res)
  //       this.setData({
  //         msglist:res.data
  //       })
  //     })
  //   })
  //  }
   
  // },
  //获取消息列表
  getListPerson(openid){
  myRequest(`getmsglist?id=${openid}`,{},"POST",false).then(res=>{
    console.log("获取成功消息列表--->msglist",res);
    this.showTimeFormat()
    this.setData({
      msglist:res.data.personMsgArrayList.map(item=>{
        item.showTime = this.showTimeFormat(item.createDate)
        return item;
      })
    })
  })
  },
  // 获取消息列表
  // getMsgList(){
  //   const getmsglistmqtt = getApp().globalData.getmsglistmqtt
  //   if(!getmsglistmqtt){
      
  //   }else{
  //     this.setData({
  //       msglist:getmsglistmqtt
  //     })
  //   }
  //   console.log("this.data.msglist",this.data.msglist)
  // },
  clickItem(e){
    console.log("e",e)
    const data  = this.data.msglist[e.currentTarget.dataset.index];
    data.myOpenID = this.data.openid
    myNavigatorTo("/chatRoom/chatRoom?data="+JSON.stringify(data)
  )},
  // 消息记录的时间的显示
  showTimeFormat(time){
    let Otime =new Date(time);
    let OYear = Otime.getFullYear();
    let OMonth = this.fotmatTimeFull0(Otime.getMonth()+1);
    let Oday =this.fotmatTimeFull0(Otime.getDate()) ;
    let HM = this.fotmatTimeFull0(Otime.getHours())+":"+this.fotmatTimeFull0(Otime.getMinutes());
    let OTimeStamp = Otime.valueOf();
    let nowTimeStamp = new Date().valueOf();
    let gap = nowTimeStamp - OTimeStamp;
    let OneDayTimeStamp = 24 * 60 * 60 * 1000
    if(gap <= OneDayTimeStamp){
      return HM;
    }
    else if( gap<=2*OneDayTimeStamp){
      return "昨天";
    }else if(gap <= 3*OneDayTimeStamp){
      return "前天";
    }else{
      return OYear+"-"+OMonth+"-"+Oday;
    }
  },
  //时间0格式
  fotmatTimeFull0(num){
    return num>=10?num:"0"+num
  }
})