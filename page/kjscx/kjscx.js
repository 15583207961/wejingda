import {
  InfoGetStroage
} from "../../utils/OInfoStroage.js"
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
} from "../../utils/usePackegeSysFun.js"
const BaseUrl = getApp().globalData.BaseURL;
Page({
  data: {
    isshowtime: false, //是否显示选择时间弹框
    isshowperiod: false, //是否显示选择课时弹框
    isshowwhere: false, //是否显示选择地点弹框
    date: '',
    show: false,
    columnsperiod: ["早上一、二节", "早上三、四节", "下午一、二节", "下午三、四节", "晚上一、二节", "晚上", "白天", "整天"],
    columnwhere: ["A教", "B教", "C教", "全部", "所有类型空教室"],
    classTime: "",
    classTitle: "",
    whereTitle: "",
    sessionId: "",
    jwwSno: "",
    studentName: "",
    where:"",
    roomsInfoArrayList:[],
    index1:0,
    when:'',
    index2:0,
    currentTime:"",

  },
  onLoad(e) {
    const curdate = new Date()
    const curDateStr = curdate.getFullYear()+'-'+((curdate.getMonth() + 1)>9?(curdate.getMonth() + 1):"0"+(curdate.getMonth() + 1))+'-'+(curdate.getDate()>9?curdate.getDate():"0"+curdate.getDate())
    this.setData({
      currentTime:curDateStr
    })

    wx.setNavigationBarTitle({
      title: `${e.name}`,
    })
    myGetStorger("jwwInfo").then(res=>{
      console.log("");
      this.setData({
        jwwSno: res.data.jwwSno,
        studentName: res.data.studentName
      })
    }).catch(err=>{
      console.log("err",err);
      var jwwInfo = getApp().globalData.UserInfo;
      this.setData({
        studentName: jwwInfo.studentName,
        jwwPwd: jwwInfo.jwwPwd,
        jwwSno: jwwInfo.jwwSno
      })
    })
   
    myGetStorger("sessionId").then(res=>{
      this.setData({
        sessionId: res.data
      })
    }).catch(err=>{
      console.log("meiyoushuju ")
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  // 发送请求并获取空课数据

  getKJSList(startTime,classTime,searchType) {
    
   myRequest("getroomhtml",{
    "sessionId": this.data.sessionId,
    "studentName": this.data.studentName,
    "username": this.data.jwwSno,
    "startTime": startTime,
    "endTime": this.data.currentTime,
    "classTime": classTime,
    "searchType": searchType
  },"POST").then(res=>{
    console.log("res",res);
    if(res.roomsInfoArrayList?.length){
      this.setData({
        roomsInfoArrayList:res.roomsInfoArrayList
      })
      return;
    }
    myToast("暂没查询到空教室")
  }).catch(err=>{
    console.log(err)
    myToast("网络错误，请稍后尝试")
  })
  
  },

  bindPickerChange1(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value,
      when:this.data.columnsperiod[e.detail.value]
    })
  },
  bindPickerChange2(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value,
      where:this.data.columnwhere[e.detail.value]
    })
    if(this.data.date==''||this.data.index1==""||this.data.index2==""){
      wx.showToast({
        title: '参数未选完全',
        icon:"error"
      })
      this.setData({
        where:""
      })
      return
    }
    this.getKJSList(this.data.date,this.data.index1,this.data.index2);
  },

  // 显示时间弹框
  onDisplayTime() {
    this.setData({
      show: true
    });
  },
  // 取消选着时间
  onCloseTime() {
    this.setData({
      show: false
    });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  // 确定选择好时间
  onConfirmTime(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
    console.log("event", this.data.date)
  },
})