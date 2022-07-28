const {
  BaseRequestUrl
} = require("../../config/baseConfig");
const {myToast,myGetStorger,myRequest,myShowLoading,mySetStorage} = require("../../utils/usePackegeSysFun.js")
Page({
  data: {
    id: 0,
    idValue: "", //身份证
    examValue: '', //考试号
    enrollInfo: null, //录取信息
    infoList:[{type: "艺术类本科",},{type: "普通类本科",},{type: "普通类专科",}],//省份信息
    leftHeight:0,
  },
  /**
   * 
   * 生命周期函数 
   */
  onLoad() {
    myGetStorger("enrollInfo").then(res=>{
      this.setData({
        enrollInfo:res.data
      })
    }).catch(err=>{
      console.log("err",err)
    })

    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          leftHeight:((result.screenHeight - wx.getMenuButtonBoundingClientRect().bottom )*2-196)
        })
      },
    })
  },



  /**
   * 自定义绑定函数
   */
  // 切换对应的功能页面
  hanlde(e) {
    this.setData({
      id: e.currentTarget.dataset.id
    })
    if(e.currentTarget.dataset.id == 1){
      myRequest("getenroll").then(res=>{
        console.log("res",res)
        this.setData({
          infoList:res.data.enrollInfo
        })
        console.log(this.data.enrollInfo)
      }).catch(err=>{
        myToast("网络异常，请稍后尝试~")
        console.log("err",err)
      })
    }
  },
  // 获取输入框中的数据
  hanldeInputValue(e) {
    let value = e.detail.value;
    let type = e.currentTarget.dataset.type;
    if (type === "id") {
      this.setData({
        idValue: value
      })
    } else {
      this.setData({
        examValue: value
      })
    }
  },
  // dain查询按钮
  handleQuery() {
    let idValue = this.data.idValue.trim();
    let examValue = this.data.examValue.trim();
    if (!idValue && !examValue) {
      myToast("填写数据不能为空或者空格，请按规范填写");
      return;
    }
    let data = {
      name: examValue,
      pass: idValue
    }
    myRequest("loginenroll", data,"POST").then(res => {
      console.log("promise", res)
      if (res?.message) {
       myToast(res.message, "error");
        return;
      }
      this.setData({
        enrollInfo: res.data
      })
      mySetStorage("enrollInfo",res.data)

    }).catch(err => {
      console.log("err", err)
    })
  }
})