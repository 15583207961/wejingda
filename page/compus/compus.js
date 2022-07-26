import {
  swiperList,
  navBars
} from "./dataconfig.js";
import {
  encodeURIComponentUrl,
  getNowTime, getResourceUrl
} from "../../utils/useHandle.js";
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
import { getUserInfos } from "../../utils/getUserInfo.js";
const quitLoginFlag = getApp().globalData.quitLoginFlag;
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
    openid: null,
    swapperInfo:[],//轮播信息
    openCourseimg:getResourceUrl("resource/img/openCourse_index.jpg"),
    qgjxImage:getResourceUrl("resource/img/index_qgjx.jpg")
  },
  // 点击导航栏跳转到对应的详情页面
  goDetail(e) {
    this.setData({
      index: e.currentTarget.dataset.index
    })
    this.switchLink(); //选择不同的业务链路
  },

  //函数跳转到对应的业务链路
  switchLink() {
    switch (this.data.index) { //通过switch选择对应的业务链路
      case 0:
      
        console.log("quitLoginFlag.jww",quitLoginFlag.jww,quitLoginFlag)
        quitLoginFlag.jww? myNavigatorTo(`/login/login?index=${this.data.index}&title=${this.data.nav_list[this.data.index].title}登录`):this.hadOpenid("jwwInfo", this.data.nav_list[0].path);
        break;
      //检查是否登录过教务网
      case 1:
        quitLoginFlag.tsg?myNavigatorTo(`/login/login?index=${this.data.index}&title=${this.data.nav_list[this.data.index].title}登录`):this.hadOpenid("tsgInfo", this.data.nav_list[1].path);
        break; //检查是否登录过图书馆账号
      case 2:
        quitLoginFlag.ykt?myNavigatorTo(`/login/login?index=${this.data.index}&title=${this.data.nav_list[this.data.index].title}登录`):this.hadOpenid("yktInfo", this.data.nav_list[2].path)
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
        // myNavigatorTo(this.data.nav_list[7].path);
        // break;
      default:
        myToast("功能正在开发~~")
        break;
    }
  },

  // 判断是否有openid，如果没有拉起授权
  hadOpenid(key, path) {
    let openid = this.data.openid
    !openid ? getUserInfos().then(res => {
      console.log("res======>#",res)
      res.data?.openid?mySetStorage(storagename.openId, res.data?.openid).then(res => {
        console.log("res=====>&",res)
        this.getUserInfoFromOpenid().then(res => this.isHaveLoaclInfo(key, path)).catch(err=>this.isHaveLoaclInfo(key, path))
      }): this.isHaveLoaclInfo(key, path)
    }).catch(err => {
      this.isHaveLoaclInfo(key, path)
      console.log("获取失败", err)
    }) : this.isHaveLoaclInfo(key, path)
  },

  // 获取本地数据例如：fwwInfo，YKTInfo，判断是否登录过教务网、一卡通
  isHaveLoaclInfo(key, path) {

    myGetStorger(key).then(res => {
      console.log("helli========>11111",res)
      switch (this.data.index) {
        case 0:
          myNavigatorTo(path + "?index=0");
          break;
        case 1:
          myNavigatorTo(path + "?index=1");
          break;
        case 2:
          myNavigatorTo(`${path}?title=账户详情`);
          break;
        default:
          return;
      }
    }).catch(err => {
      console.log("err=====》***",err)
      myNavigatorTo(`/login/login?index=${this.data.index}&title=${this.data.nav_list[this.data.index].title}登录`);
    })
  },
  // 获取一卡通余额，我的借阅
  getFirstDate(path, data) {
    return new Promise((resolve, rej) => {
      console.log("huahuahu", path, data)
      myRequest(path, data, "POST",false).then(
        res => {
          console.log("------------------>res",res)
          resolve(res.data);
        }
      ).catch(err => {
        rej(err)
        myToast("网络异常，请稍后尝试")
      })
    })
  },
  // 第一次获取余额
  getBalance(time) {
    console.log("---------")
    myGetStorger("yktInfo").then(res => {
      let data = {
        pass: res.data.yktpwd,
        name: res.data.yktSno
      }
      this.getFirstDate("yktlogin", data)
        .then(res => {
          console.log("***&&&&---------->>>>>>>>>>", res)
          var item = {
            money: res.money,
            time: time
          }
          this.setData({
            balanceInfo: item
          })
          console.log("*****res", res,item)

          mySetStorage("balanceInfo", item)
        })

    }).catch(err => {
      console.log("err", err)
    })

  },
  // 第一次获取借阅
  getBorrow(time) {
    myGetStorger(storagename.tsgInfo).then(res => {
      let data = {
        name: res.data.tsgSno,
        pass: res.data.tsgPwd
      }
      console.log("data=>====》", data)
      this.getFirstDate("librarylogin", data, "POST").then(res => {
        console.log("res98817718171-------------------------------------------", res)
        var item = {
          borrowed: res.borrowed,
          time: time
        }
        this.setData({
          borrowInfo: item
        })
        mySetStorage(storagename.borrowInfo, item)
      })
    }).catch(err => {
      console.log("errr====>::",err)
    })
  },

//点击swaper跳转到页面
  clickSwapper(e){
    var src = e.currentTarget.dataset?.articles
    console.log("点击了轮播图",src)

    src&&myNavigatorTo(`/webview/webview?src=${encodeURIComponentUrl(src)}`)
  },

  // 网络请求后去轮播图的数据
  getSwapperInfo(){
    myRequest("swapper",{},"GET",false).then(res=>{
      console.log("获取轮播数据",res)
      this.setData({
        swapperInfo:res.data.swapperInfoArrayList
      })
    }).catch(err=>{
      console.log("失败了",err)
    })
  },
// gotoPage  跳转到开课了页面
gotoPage(){
  if(this.data.openid){
    myNavigatorTo("/openCourse/openCourse?openid="+this.data.openid)
  }else{
    getUserInfos().then(res=>{
      console.log("res=---->",res)
      mySetStorage(storagename.openId,res.data.openid)
      myNavigatorTo("/openCourse/openCourse?openid="+res.data.openid)
    }).catch(err=>{
      console.log("err--->",err)
    })
  }
},
// gotoWorkStudyProgram 跳转到勤工俭学页面
gotoWorkStudyProgram(){
  myNavigatorTo("/workStudyProgram/workStudyProgram")
},
  // 网络获取固定的文章
  getBaseArticles(){
    myRequest("articles",{},"GET",false).then(res=>{
      console.log("articles------------------------------",res)
      getApp().globalData.baseArticles=res.data.articlesArrayList;
    }).catch(err=>{
      console.log("获取失败了文章",err)
    })
  },
  onShow() {
    var time = getNowTime()
    myGetStorger(storagename.openId).then(res=>{
      this.setData({
        openid:res.data
      })
    })
    myGetStorger(storagename.balanceInfo).then(res => {
      this.setData({
        balanceInfo: {
          money:res.data.data.money,
          time:time
        }
      })
    }).catch(err => {
      console.log("**&!&!^^!&&!!", err)
      this.getBalance(time);
    })
    myGetStorger(storagename.borrowInfo).then(res => {
      console.log("borrowInfo", res)
      this.setData({
        borrowInfo: res.data
      })
    }).catch(err => {
      this.getBorrow(time)
    })
    !getApp().globalData.baseArticles && this.getBaseArticles()
  },
  //启动小程程序，获去openid，请求云端数据。
  getUserInfoFromOpenid() {
    return new Promise((resolve, rej) => {
      myGetStorger("openId").then(res => {
        console.log("获取openid成功", res);
        this.setData({
          openid: res.data
        })
        myRequest("getwechatuserinfo?openID=" + res.data, {}, "POST",false).then(res => {
          console.log("----------------------------1=>",res)
          resolve("ok");
          if(!res?.data){
            return ;
          }
           const { chatID, jwwPass, studentID, tsgPass, yktPass } = res.data;
          yktPass && mySetStorage(storagename.yktInfo, {
            yktpwd: yktPass,
            yktSno: studentID
          });
          tsgPass && mySetStorage(storagename.tsgInfo, {
            tsgSno: studentID,
            tsgPwd: tsgPass
          });
          jwwPass && mySetStorage(storagename.jwwInfo, {
            jwwSno: studentID,
            jwwPwd: jwwPass,
          })
          
        }).catch(err => {
          console.log("获取数据是失败了", err);
          rej("fail");
        })
      }).catch(err => {
        rej("fail");
        console.log("获取本地的openid失败了", err);
      })
    })
  },

  // 获取手机型号
  onLoad(ee) {
    this.getSwapperInfo();
    this.getUserInfoFromOpenid();
    myGetStorger("balanceInfo").then(res => {
      this.setData({
        balanceInfo: res
      })
    }).catch(err => {
      console.log("err", err)
    })
    myGetStorger("borrowInfo").then(res => {
      this.setData({
        borrowInfo: res
      })
    }).catch(err => {
      console.log("err", err)
    })
  },
  // 点击轮播图跳转详情
  swiperTap(e) {
    console.log("e", e)
    wx.navigateTo({
      url: '../../page/swiperdetail/swiperdetail?index=' + e.currentTarget.dataset.index,
    })
  },
  // goMicsWebview
  gotoTyphon(e){
    myNavigatorTo("/typhon/typhon")
  },
  copy(e){
    console.log("e",e)
  }
})
