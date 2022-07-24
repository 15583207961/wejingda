import {
  swiperList,
  navBars
} from "./dataconfig.js";
import {
  getNowTime
} from "../../utils/useHandle.js";
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
    headThemebgc: "background-image: linear-gradient(#edf1f7,#edf1f7,#edf1f7,#edf1f7,#fafafa);", //头部背景颜色
    swiper_list: swiperList, //轮播图数据
    nav_list: navBars,
    sessionId: '', //会话ID
    __VIEWSTATE: '', //回话__VIEWSTATE
    index: 0, //传递过来的值
    balanceInfo: {
      money: "",
      time: "",
    },
    borrowInfo: {
      borrowed: "",
      time: ''
    },

  },
  // 点击导航栏跳转到对应的详情页面
  goDetail(e) {
    this.setData({
      index: e.currentTarget.dataset.index
    })
    this.switchLink(); //选择不同的业务链路
  },
  // switch 选择跳转
  switchNarBar(url) {
    
  },
  //函数跳转到对应的业务链路
  switchLink() {
    switch (this.data.index) { //通过switch选择对应的业务链路
      case 0:
        this.isHaveLoaclInfo("jwwInfo", this.data.nav_list[0].path);
        break;
      //检查是否登录过教务网
      case 1:
        this.isHaveLoaclInfo("tsgInfo", this.data.nav_list[1].path);
        break; //检查是否登录过图书馆账号
      case 2:
        this.isHaveLoaclInfo("yktInfo", this.data.nav_list[2].path);
        break; //检查是否登录过一卡通账号
      case 4:
        myNavigatorTo(this.data.nav_list[4].path);
        break;
      case 3:
        myNavigatorTo(this.data.nav_list[3].path);
        break;
      case 5:
        myNavigatorTo(this.data.nav_list[5].path);
        break;
      case 6:
        myNavigatorTo(this.data.nav_list[6].path);
        break;
      case 7:
        myNavigatorTo(this.data.nav_list[7].path);
        break;
      default:
        break;
    }
  },



  // 获取本地数据例如：fwwInfo，YKTInfo，判断是否登录过教务网、一卡通
  isHaveLoaclInfo(key, path) {
    myGetStorger(key).then(res => {
      switch (this.data.index) {
        case 0:
          myNavigatorTo(path+"?index=0");
          break;
        case 1:
          myNavigatorTo(path + "?index=1" );
          break;
        case 2:
          myNavigatorTo(`${path}?title=账户详情`);
          break;
        default:
          return;
      }
    }).catch(err => {
      myNavigatorTo(`/login/login?index=${this.data.index}&title=${this.data.nav_list[this.data.index].title}登录`);
    })
  },
  // 获取一卡通余额，我的借阅
  getFirstDate(path, data) {
    new Promise((resolve, rej) => {
      myRequest(path, data, "POST").then(
        res => {
          if (res.loginStatus !== "登录正常") {
            myToast(res.loginStatus)
            return;
          }
          resolve(res);
        }
      ).catch(err => {
        rej(err)
        myToast("网络异常，请稍后尝试")
      })
    })
  },
  // 第一次获取余额
  getBalance(time) {
    myGetStorger("yktInfo").then(res => {
      console.log("myGetStorgeasasr", res)
      let data = {
        password: res.data.yktpwd,
        username: res.data.yktSno
      }
      this.getFirstDate("yktlogin", data)
        .then(res => {
          var item = {
            money: res.money,
            time: time
          }
          this.setData({
            balanceInfo: item
          })
          console.log("------>----->")
          mySetStorage("balanceInfo", item)
        }).catch(err => {
          console.log("失败了")
        })

    }).catch(err=>{
      console.log("err",err)
    })

  },
  // 第一次获取借阅
  getBorrow(time) {
    myGetStorger("tsgInfo").then(res => {
      let data = {
        name: res.data.tsgSno,
        password: res.data.tsgPwd
      }
      this.getFirstDate("librarylogin", data).then(res => {
        var item = {
          borrowed: res.borrowed,
          time: time
        }
        this.setData({
          borrowInfo: item
        })
        mySetStorage("borrowInfo", item)
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  onShow() {
    var time = getNowTime()
    myGetStorger("balanceInfo").then(res => {
      console.log("balanceInfo", res)
    }).catch(err => {
      console.log(err)
      this.getBalance(time);
    })
    myGetStorger("borrowInfo").then(res => {
      console.log("borrowInfo", res)
    }).catch(err => {
      this.getBorrow(time)
    })

  },
  // 获取手机型号
  onLoad(ee) {
    myGetStorger("balanceInfo").then(res => {
      this.setData({
        balanceInfo: res
      })
    }).catch(err=>{
      console.log("err",err)
    })
    myGetStorger("borrowInfo").then(res => {
      this.setData({
        borrowInfo: res
      })
    }).catch(err=>{
      console.log("err",err)
    })
  },
  // 点击轮播图跳转详情
  swiperTap(e) {
    console.log("e", e)
    wx.navigateTo({
      url: '../../page/swiperdetail/swiperdetail?index=' + e.currentTarget.dataset.index,
    })
  }
})