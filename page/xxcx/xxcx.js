
import {
  myGetStorger,
  myRequest,
  myToast,
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";

Page({
  data: {
 
    isShowPicker: true,
    semester: [], //显示学期
    grade_list: [], //成绩list
    exam_list: [], //考试列表
    MakeUpExamList: [], //不考信息
    sessionId: '', //会话ID
    __VIEWSTATE: '',
    Index: '',
    jwwPwd: '',
    studentName: "",
    jwwSno: "",
    showdata:[
      "2021-2022",
      []
    ],
    multiArray:[['2021-2022','2020-2021','2019-2020','2018-2019'],["第1学期", '第2学期']]
  },
  // 点击显示
  touchhanlde(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var list = this.data.grade_list;
    list[index].isshow = !this.data.grade_list[index].isshow;
    this.setData({
      grade_list: list
    })
  },

  // 多列
   bindMultiPickerChange(e) {

    this.setData({
      multiIndex: e.detail.value
    })
    wx.showLoading({
      title: '数据加载中',
    })
    var xn = this.data.showdata[0];
    var xq = typeof this.data.showdata[1]==undefined?'1': this.data.showdata[1]=="第2学期"?"2":"1"
    switch (this.data.index) {
      case "0":
        this.getGradeInfo( xn, xq);
        break;
      case "1":
        this.getEXamInfo(xn, xq);
        break;
      case "2":
        this.getMakeUpExamInfo(xn, xq);
        break;
    }

    

    this.setData({
      isShowPicker: false
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var multiArray=this.data.multiArray
    
    var showdata = this.data.showdata;
    showdata[e.detail.column] =  multiArray[e.detail.column][e.detail.value]
    this.setData({
      showdata :showdata
    })
  },

  showPicker() {
    this.setData({
      isShowPicker: !this.data.isShowPicker
    })
  },
  // 点击取消
  onCancel() {
    this.setData({
      isShowPicker: false
    })
    console.log("hello")
  },
  // 发送请求获取学期成绩
  getGradeInfo(xn, xq) {
    let data = {
      "sessionId": this.data.sessionId,
      "__VIEWSTATE": this.data.__VIEWSTATE,
      "studentName": this.data.studentName, //用户真实姓名 
      "username": this.data.jwwSno,
      "password": this.data.jwwPwd,
      "checkCode": "",
      "xn": xn,
      "xq": xq
    }
    console.log("data===>",data)
    myRequest("getscrodinfo",{
      "sessionId": this.data.sessionId,
      "__VIEWSTATE": this.data.__VIEWSTATE,
      "studentName": this.data.studentName, //用户真实姓名 
      "username": this.data.jwwSno,
      "password": this.data.jwwPwd,
      "checkCode": "",
      "xn": xn,
      "xq": xq
    },"POSt").then(res=>{
      console.log("获取成功",res);
      if(res.scoreInfoArrayList.length==0){
        myToast("暂无成绩信息");
        return;
      }
      this.setData({
        grade_list: res.scoreInfoArrayList
      })
    }).catch(err=>{
      console.log("获取失败",err);
      myToast("网络错误")
    })
  },
  // 发送请求获取考试信息
  getEXamInfo(xn, xq) {

    myRequest("getexaminfo",{
      "sessionId": this.data.sessionId,
      "__VIEWSTATE": this.data.__VIEWSTATE,
      "studentName": this.data.studentName, //用户真实姓名 
      "username": this.data.jwwSno,
      "password": this.data.jwwPwd,
      "checkCode": "",
      "xn": xn,
      "xq": xq
    },"POST").then(res=>{
      console.log("获取成功",res)
      if(res.exameinfoArrayList.length){
        this.setData({
          exam_list: res.exameinfoArrayList
        })
        return;
      }
      myToast("暂无考试信息");
    }).catch(err=>{
      console.log("获取失败了",err)
      myToast("网络异常")
    })
  },
  // 发送请求获取补考信息
  getMakeUpExamInfo( xn, xq) {
    myRequest("getexamagaininfo",{
      "sessionId": this.data.sessionId,
      "__VIEWSTATE": this.data.__VIEWSTATE,
      "studentName": this.data.studentName,
      "username": this.data.jwwSno,
      "password": this.data.jwwPwd,
      "checkCode": "",
      "xn": xn,
      "xq": xq
    },"POST").then(res=>{
      console.log("获取到的参数为",res)
      if(res.exameinfoArrayList.length){
        this.setData({
          MakeUpExamList: res.exameinfoArrayList
        })
      }
      else{
        myToast("暂无补考信息")
      }
    }).catch(err=>{
      console.log("网络异常",err)
    })
  },
  onLoad(e) {
    this.setData({
      index: e.index,
    })
    wx.setNavigationBarTitle({
      title: e.Name
    })
  },
  onShow(){
    myGetStorger("sessionId").then(res=>{
      console.log("获取成功",res);
      this.setData({
        sessionId : res.data
      })
    })
    myGetStorger("__VIEWSTATE").then(res=>{
      console.log("后期成功",res);
     this.setData({
      __VIEWSTATE:res.data
     })
    })

    myGetStorger(storagename.jwwInfo).then(res=>{
      console.log(res)
        this.setData({
          jwwPwd: res.data.jwwPwd,
          jwwSno: res.data.jwwSno,
          studentName: res.data.studentName,
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

  }
});