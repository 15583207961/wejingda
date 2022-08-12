import { storagename } from "../../config/storageNameconfig.js";
import mqtt from "../../utils/mqtt.min.js";

import {
  mySystemInfo
} from "../../utils/usePackegeSysFun.js"
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
    titleTop: 0,
    titleHeight: 0,
    screenHeight: 0,
    inputUp: 0,
    list: [],
    scrollHeight: 0,
    scrolltop: 0,
    inputvalue: "",
    isfous: false,
    myOpenID: "",//我的openid
    receiveID: "",//对方的id
    firstSend: true,//是否是进入界面是否是第一次发送消息。
    topicName: "",//当前聊天室的话题
    nickName:"",//对方的 昵称，现在在聊天顶部
    userImg:"",//对方的头像
    myUrl:"",//我的头像
  },
  onLoad(e) {
    console.log("房间", e)
    const { receiverID, nickName, userImg, myOpenID ,topicName=null} = JSON.parse(e.data)
    this.setData({
      myOpenID: myOpenID,
      receiveID: receiverID,
      nickName: nickName,
      userImg: userImg,
      topicName:topicName
    })
    topicName&&this.getmsgrecord(topicName);
    topicName&&this.setTopicNameStatus(topicName,"true")
    // this.connect(e.myOpenID,e.receiveID)
    this.linsenMqtt()
    mySystemInfo()
    this.getScrollInfo()
    this.getLocalDate()
  },
  onUnload(){
    this.data.topicName && this.setTopicNameStatus(this.data.topicName,"false")
  },
  // 聊天室启动，设置topic状态
  setTopicNameStatus(topicName,cating){
    let data = {
      topicname:topicName,
      cating:cating
    }
    myRequest("settopiccating",data,"POST",false,{"content-type":"application/x-www-form-urlencoded"}).then(res=>{
      console.log("聊天室状态设置成功",res)
    }).catch(err=>{
      console.log("聊天室状态设置失败",err)
    })
  },
//页面启动获取本地数据
getLocalDate(){
  // 获取自己的头像
  myGetStorger(storagename.chatInfo).then(res=>{
    console.log("bending数据获取成功chatInfo",res)
    this.setData({
      myUrl:res.data.avatarUrl
    })
  }).catch(err=>{
    console.log("本地数据获取失败",err)
  })
},
  //根据topicname获取消息记录
  getmsgrecord(topicname){
    myRequest(`getmsgrecord?topicname=${topicname}`,{},"POST").then(res=>{
      console.log("获取消息记录成功",res)
      const list = res.data.oldMsgArrayList.concat(res.data.newMsgArrList)
      this.setData({
        list:list,
        scrolltop:list.length*800
      })
    }).catch(err=>{
      console.log("获取消息记录失败",err)
    })
  },
  //获取scroll高度等操作
  getScrollInfo() {
    var custom = getApp().globalData.systemInfos
    console.log("custom------->", custom)
    this.setData({
      screenHeight: custom.screenHeight,
      scrollHeight: custom.screenHeight - custom.menuTop - 242,
      // scrollHeight: custom.screenHeight - 140,
      scrolltop: this.data.list.length * 800,
      titleTop: custom.menuTop,
      titleHeight: custom.menuHeight,
    })
  },
  //监听mqtt事件
  linsenMqtt() {
    getApp().globalData.client.on("message", (topic, payload) => {
      const curMsg = JSON.parse(`${payload}`)
      console.log(`在chatRoom页面监听到mqtt数据${topic}话题，数据`, curMsg)
      if (topic === this.data.topicName) {
        let list = this.data.list
        list.push(curMsg)
        this.setData({
          list: list,
          scrolltop:list.length * 800
        })
      }
    })
  },
  goback() {
    wx.navigateBack({
      delta: 1,
    })
  },
  inputFocus(e) {
    console.log(e, '键盘弹起')
    var inputHeight = 0
    if (e.detail.height) {
      inputHeight = e.detail.height
      console.log("this.data.inputUp----->1",this.data.inputUp)
      console.log("this.data.scrollHeight------>1",this.data.scrollHeight)
      console.log("this.data.scrolltop---->1",this.data.scrolltop)
      this.setData({
        inputUp: inputHeight * 2,
        scrollHeight: this.data.scrollHeight - inputHeight * 2,
        scrolltop: this.data.list.length * 800
      })
    console.log("this.data.inputUp----->2",this.data.inputUp)
    console.log("this.data.scrollHeight------>2",this.data.scrollHeight)
    console.log("this.data.scrolltop---->2",this.data.scrolltop)
    }
  },
  inputBlur() {
    this.setData({
      inputUp: 0,
      scrollHeight: this.data.scrollHeight + this.data.inputUp,
      scrolltop: this.data.list.length * 800
    })
  },
  inputValue(e) {
    console.log("", e)
    this.setData({
      inputvalue: e.detail.value,
      isfous: true
    })
  },

  //接口er发送消息
  sendSecond(data, topicName) {
    if (!topicName) {
      myToast("连接失败，请稍后重试~");
      return;
    }
    myRequest(`secondmsg?topicname=${topicName}`, data, "POST").then(res => {
      console.log("消息发送成功了", res)
    }).catch(err => {
      console.log("消息发送失败了", err)
    })
  },


  // 点击发送信息
  sendMsg() {
    var content = this.data.inputvalue.trim()
    if (!content) {
      return;
    }
    let data = {
      senderID: this.data.myOpenID,
      receiverID: this.data.receiveID,
      content: content,
      "read": "false",
      date: ""
    }
    // 判断是否存在topicname，如果没有先发送请求，建立topicname，在发送第二次，如果有着直接携带发送
    if (!this.data.topicName) {
      myRequest("firstmsg", data, "POST").then(res => {
        console.log("第一次成功了", res)
        this.getmsgrecord(res.data)
        this.setData({
          firstSend: false
        })
        this.setData({
          topicName: res.data
        })
        this.sendSecond(data, res.data)
      }).catch(err => {
        myToast("出问题了，请稍后重试")
        console.log("第一次失败了", err)
      })
    } else {
      this.sendSecond(data, this.data.topicName)
    }
    this.setData({
      inputvalue: ""
    })
  },
 



})