
// app.js
import mqtt from "./utils/mqtt.min.js";
import {  myGetStorger,mySetStorage,myRequest,myShowLoading,myToast,myPreviewInfos,myNavigatorTo,myRemoveStorage,myRedirectTo,myModal,mySystemInfo} from "./utils/usePackegeSysFun.js";
import {storagename} from "./config/storageNameconfig.js"
App({
  onLaunch() {
    this.getMyPhoneInfo()
    myGetStorger(storagename.keyboardHeigth).then(res=>{
      this.globalData.keyboardHeigth=res.data
     
    }).catch(err=>{
      console.log("还没有获取到键盘高度",err)
    })
    this.getlocalData();
   //建立mt连接
  },
  //获取本地数据
  getlocalData(){
    myGetStorger(storagename.openId).then(res=>{
      console.log("获取到本地的openid了",res.data);
      this.globalData.openid=res.data
      this.connect(res.data);
      this.getmsglistmqtt(res.data)
    }).catch(err=>{
      console.llog("还没有openid",err)
    })
  },

  // 小程启动之后建立mqtt全局监听
  connect(myOpenID) {
    /**
     * 还差一个查询是否存在一个topic
     */
    // MQTT-WebSocket 统一使用 /path 作为连接路径，连接时需指明，但在 EMQX Cloud 部署上使用的路径为 /mqtt
    // 因此不要忘了带上这个 /mqtt !!!
    // 微信小程序中需要将 wss 协议写为 wxs，且由于微信小程序出于安全限制，不支持 ws 协议
    try {
      this.globalData.client = mqtt.connect(`wxs://singlestep.cn:443/mqtt`, {
        keepalive: 60,   
        username: "test12321342134",
        password: "test312312321",
        reconnectPeriod: 1000, 
        connectTimeout: 30 * 1000, 
        clientId:myOpenID,
      });
  
      this.globalData.client.on("connect", () => {
        wx.showToast({
          title: "连接成功",
        });
        console.log("------------------------>---------------")
        this.globalData.client.on("message", (topic, payload) => {
          let curMsg = JSON.parse( `${payload}`)
          console.log(`订阅的话题${topic}:话题内容：${curMsg}`)
          // 做一些别人点击我，他送过来的话题，通过revicerId和sendId是不是自己如果是就加入订阅话题，如果有不是就不加入话题，并区分myId和resiverId是谁
          if(topic==="ClientSpring"){
            console.log("这是ClientSpring话题返回的数据",curMsg)
            if(this.globalData.openid === curMsg.senderID || this.globalData.openid ===curMsg.receiverID){ //判断是返回的senderId和receiverId是否是自己，如果是就加入订阅，如果不是就不加入
              this.globalData.client.subscribe(curMsg.topicName)
            }
          }
        });
  
        this.globalData.client.on("error", (error) => {
          // this.setValue("conenctBtnText", "连接");
          console.log("onError", error);
        });
  
        this.globalData.client.on("reconnect", () => {
          // this.setValue("conenctBtnText", "连接");
          console.log("reconnecting...");
        });
  
        this.globalData.client.on("offline", () => {
          // this.setValue("conenctBtnText", "连接");
          console.log("onOffline");
          myToast("已断开链接")
        });
   //订阅话题 全局每个都要订阅的
        this.globalData.client.subscribe("ClientSpring");
        this.globalData.client.subscribe("hello")
        this.globalData.client.subscribe("hello")
        // 更多 MQTT.js 相关 API 请参阅 https://github.com/mqttjs/MQTT.js#api
      });
    } catch (error) {
      // this.setValue("conenctBtnText", "连接");
      console.log("mqtt.connect error", error);
    }
  },
  //小程序启动获取消息列表
  getmsglistmqtt(openid){
    myRequest(`getmsglist?id=${openid}`,{},"POST").then(res=>{
      console.log("获的到了消息列表--->",res)
      const msgList = res.data.personMsgArrayList;
      this.globalData.getmsglistmqtt = msgList;
      mySetStorage(storagename.getmsglistmqtt,msgList);
      msgList.forEach(item => {
        this.globalData.client.subscribe(item.topicName)
        console.log("小程序启动订阅了主题",item.topicName)
      });
    res
    }).catch(err=>{
      console.log("消息列表获取失败了",err)
    })
  },

  // 获取到手机系统信息并将其存放到全局
  getMyPhoneInfo(){
    myGetStorger(storagename.systemInfo).then(res=>{
      console.log("获取到了本地数据",res)
      this.globalData.systemInfos = res.data
    }).catch(err=>{
      mySystemInfo(2).then(res1=>{
        console.log("系统数据",res1)
        mySetStorage(storagename.systemInfo,res1)
        this.globalData.systemInfos = res1
      }).catch(err=>{
        console.log("系统数据获取失败了",err)
      })
      console.log("本地数据不存在",err)
    })
  },
  globalData: {
    // userInfo: null,
    UserInfo:{ //临时登录的账号密码信息
      jwwInfo:{
        jwwPwd:"",
        jwwSno:"",
        studentName:""
      },
      yktInfo:{
        yktpwd:"",
        yktSno:"",
        state:""
      }
    },
    quitLoginFlag:{ //退出登录标记
      jww:false,
      ykt:false,
      tsg:false
    },
    modifityFlag:true,//标记校园电话是否发生了变化
    baseArticles:null,//基本的微信文章
    swzlDataInfo:null,//存放已经出现的失物招领信息
    swzlDataInfoLost:null,//存放已经出现的丢失信息
    swzlDataInfoPick:null,//存放已经出现的拾的信息
    pagelost:0,//丢失偏移页数
    pagepick:0,//拾的偏移页数
    systemInfos:null,//手机系统信息
    keyboardHeigth:null,//键盘高度
    openid:null,//openid,
    getmsglistmqtt:null
  }
})
