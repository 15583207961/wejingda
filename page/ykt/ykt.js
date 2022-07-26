


import { getResourceUrl ,encodeURIComponentUrl} from "../../utils/useHandle.js";
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js"

Page({
  data: {
    nav_list: [{
      imgUrl: getResourceUrl("resource/img/icon_xfjl.png"),
      title: "消费记录"
    }, {
      imgUrl: getResourceUrl("resource/img/icon_drxe.png"),
      title: "单日限额"
    }, {
      imgUrl: getResourceUrl("resource/img/icon_zhgs.png"),
      title: "账户挂失"
    }, {
      imgUrl: getResourceUrl("resource/img/icon_wxcz.png"),
      title: "微信充值"
    },],
    userName: "",
    state: "",
    limitMoney: "",
    money: "",
    Sno: "",
    pwd: "",
    ishowpupor: false,//显示弹窗
    index: 2,
    islose: false,//是否挂失

  },

  onLoad(e) {
    
    myGetStorger("balanceInfo").then(res => {
      const { name, state, userClass, money, limitMoney } = res.data;
      this.setData({
        userName: name,
        state: state,
        limitMoney: limitMoney,
        money: money,
      })
    }).catch(err=>{
      const { userName, state, userClass, money, limitMoney } =e;
      console.log()
      this.setData({
        userName: userName,
        state: state,
        limitMoney: limitMoney,
        money: money,
      })
      console.log("获取失败了========>4",err)
    })
    myGetStorger("yktInfo").then(res => {
      const { yktpwd, yktSno, state } = res.data;
      this.setData({
        Sno: yktSno,
        pwd: yktpwd,
        islose:state == 0
      })
      this.yktlogin(yktpwd, yktSno);
    }).catch(err=>{
      console.log("err",err);
      const { yktpwd, yktSno, state } =  getApp().globalData.UserInfo.yktInfo;
      
      this.setData({
        Sno: yktSno,
        pwd: yktpwd,
        islose:state == 0
      })
    })
    wx.setNavigationBarTitle({
      title: "用户详情",
    })
  },
  // 登录一卡通，函数将被第二次登录时调用
  yktlogin(pwd, Sno) {
    myRequest("yktlogin", {
      "name": Sno,
      "pass": pwd
    }, "POST").then(
      res => {
        mySetStorage("balanceInfo", res.data)
        const { limitMoney, state, name, money, pwd, Sno } = res.data;
        this.setData({
          userName: name,
          state: state,
          limitMoney: limitMoney,
          money: money,
          islose: state == 0
        })
        console.log("state",this.data.state)
        console.log("islose",this.data.islose)
      }
    ).catch(err => {
      console.log("失败了");
      myToast("网络异常，登录失败")
    })
  },

  //  点击导航栏
  handle_item(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
    switch (index) {
      case 0:
        myNavigatorTo(`/Consdetail/Consdetail?pwd=${this.data.pwd}&Sno=${this.data.Sno}&balance=${this.data.money}`);
        break;
      case 1:
      case 2:
        this.setData({
          ishowpupor: true
        });
        break;
      case 3:
        const src =getApp().globalData.baseArticles?.filter(item=>item.name=="WeChatPay")[0]?.articles
        src?myNavigatorTo("/webview/webview?src="+encodeURIComponentUrl(src)):myToast("网络异常，请稍后尝试");
        break;
    }
  },

  // 获取用户输入信息
  handle_input(e) {
    var value = e.detail.value.trim();
    this.setData({
      value_1: value
    })
  },

  // 点击取消，退出弹窗
  cancel_handle() {
    this.setData({
      ishowpupor: false
    })
  },

  // 点击确定获取用户输入
  comfirm_handle() {
    console.log(typeof this.data.index)
    var value = this.data.value_1;
    if (value != "" && value != undefined) {
      switch (this.data.index) {
        case 1:
          this.updatelimitmoneny(value);
          break;
        case 2:
          this.SuspendAccount(value);

      }
    } else {
      wx.showToast({
        title: '输入不能为空~~',
        icon: 'none'
      })
    }
  },

  //发送请求，修改限额
  updatelimitmoneny(value) {
    if (parseInt(value) > 200) {
      wx.showToast({
        title: '最高上限200元',
        icon: "error"
      })
      return;
    }
    myRequest("yktlimit",{
      name:this.data.Sno,
      pass:this.data.pwd,
      money:value
    },"POST").then(res=>{
      console.log("res",res);
      myToast(res)
      if (res.data == "设置成功") {
        this.setData({
          limitMoney: value,
          ishowpupor: false
        })
      }
      else {
        this.setData({
          ishowpupor: false
        })
      }
    }).catch(err=>{
      myToast("网络异常")
      this.setData({
        ishowpupor: false
      })
    })
  
  },

  // 发送请求，挂失
  SuspendAccount(value) {
    var state = String(this.data.state);
    console.log("state",state)
    if (value != this.data.pwd) {
      myToast("密码错误","error");
      return;
    }
    myRequest("yktgs",{
      pass:this.data.pwd,
      name:this.data.Sno,
      state:state==0?1:0
    },"POST").then(res=>{
      console.log("res",res)
      const {message} = res
      message&&myToast(message);
      if(!message){
        let islose = this.data.islose;
        this.setData({
                  islose: !islose,
                  state: this.data.state==0?1:0,
                  ishowpupor: false
                })
      }
    }).catch(err=>{
      console.log("失败了",err)
    })
  }
})