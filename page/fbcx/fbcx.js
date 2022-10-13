import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage,
  myRedirectTo,
  myNavBarHieght
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
import { encodeURIComponentUrl,getResourceUrl } from "../../utils/useHandle.js";
import { BaseRequestUrl } from "../../config/baseConfig.js";
Page({
  data:{
    titleTop:0,
    titleHeight:0,
    icon:"../../static/public/login_uncheck.png",
    selectedIcon:"../../static/public/login_check.png",
    pwsValue:"",
    snoValue:"",
    argeeProtol:false,
    isSave:false,
    xsdataInfo:null,
    cookie:null,
    openid:"",
    reportMethods:null,
    reportProcess:null,
    topHeight:0,
    topTitle:"新生报到",
    doneimage:getResourceUrl("resource/img/icon_done.png")
  },
  onLoad(e){
    console.log("e=====>",e)
    const data = e?.data&&JSON.parse(e.data)
    if(data){
      this.studentLogin(data);
      this.setData({
        xsdataInfo:{}
      })
    }
    this.getLocalData()
  },
  // 获取本地数据
  getLocalData(){
    // myGetStorger(storagename.xsbdInfo).then(res=>{
    //   console.log("获取本地数据成功",res)
    //   const data = {
    //     xsdataInfo:{},
    //     name:res.data.sno,
    //     id:res.data.pws
    //   }
    //   this.studentLogin(data)
    // }).catch(err=>{
    //   console.log("获取本地数据失败")
    // })
    myGetStorger(storagename.systemInfo).then(res=>{
      console.log("获取到的数据",res.data)
      this.setData({
        titleTop:res.data.menuTop,
        titleHeight:res.data.menuHeight,
        topHeight:res.data.menuBottom+32
      })
    })
   
    myGetStorger(storagename.openId).then(res=>{
      console.log("获取到了本地的opeind",res)
      this.setData({
        openid:res.data
      })
    })
  },

  goback(){
    if(this.data.reportProcess?.length){
      this.setData({
        reportProcess:null,
        topTitle:"个人信息"
      })
      return ;
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  goWebview(e){
    var src = encodeURIComponentUrl(e.currentTarget.dataset.type ==="protocol"? BaseRequestUrl+"resource/privacy/service.html": BaseRequestUrl+"/resource/privacy/private.html")
console.log(src)
myNavigatorTo(`/webview/webview?src=${src}`)
},
// 获取表单中数据
getinfo(e){
  const value = e.detail.value.trim();
  const type = e.currentTarget.dataset.index
  console.log("获取表单中输入的信息",e)
  if(type=="sno"){
    this.setData({
      snoValue:value
    })
  }
   else if(type =="pwd"){
    this.setData({
      pwsValue:value
    })
  }
},
// 同意协议
bindProtocol(){
  this.setData({
    argeeProtol:!this.data.argeeProtol
  })
},
// 自动登录
bindChageck(){
  this.setData({
    isSave:!this.data.isSave
  })
},
// 登录
goDetail(){
  if(!this.data.snoValue){
    myToast("账号不能为空");
    return;
  }
  if(!this.data.pwsValue){
    myToast("密码不能为空");
    return;
  }
  if(!this.data.argeeProtol){
    myToast("阅读协议同意并勾选");
    return;
  } 
  
  const data = {
    name:this.data.snoValue,
    id:this.data.pwsValue
  }
  this.studentLogin(data)
},
// 新生报到登录网络查询
studentLogin(data){
  myRequest("studentinfo",data,"POST",true,{"content-type":"application/x-www-form-urlencoded"}).then(res=>{
    console.log("获取成功",res)
    if(res.message){
      myToast(res.message);
      return ;
    }
    if(this.data.isSave){
      mySetStorage(storagename.xsbdInfo,{pws:this.data.pwsValue,sno:this.data.snoValue})
    }
    this.setData({
      xsdataInfo:res.data.newPersonInfo,
      cookie:res.data.cookie,
      reportMethods:res.data.reportMethods,
      topTitle:"个人信息"
    })
  }).catch(err=>{
    console.log("err",err)
  })
},
//新生报到流程
process(){
    let data = {
      setid:this.data.reportMethods[0].id,
      cookie:this.data.cookie
    }
    myRequest("reportinfo",data,"POST",true,{"content-type":"application/x-www-form-urlencoded"}).then(res=>{
      console.log("获取成功====>",res)
      
      if(res.message){
        myToast(res.message)
        return;
      }
      this.setData({
        topTitle:"报到流程",
        reportProcess:res.data
      })
    }).catch(err=>{
      console.log("获取失败了",err)

    })
}
})