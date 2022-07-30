
var app = getApp();
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
import { BaseRequestUrl } from "../../config/baseConfig.js";
const quitLoginFlag = getApp().globalData.quitLoginFlag;
Page({
    data: {
        dataInfo: {
            pwd: null,
            sno: null,
            // openId: ""
        }, //存储通入信息
        isSave: false, //是否保存
        argeeProtol:false,//是否统一协议
        Index: '', //存储跳转的下标
        openId: '', //用户的openID
        jwwInfo: {},
        tsgInfo:{},
        yktInfo:{},
        studentName: "",
        __VIEWSTATE: "",
        sessionId: "",
        count: 5,
        hasOpendId: false, //是否有openid
        firstvalue: '', //存储第一的账号
        iscommon: ' ',//判断输入的账号是否是相同
        disabel:false,
        pageTitle:"",
        icon:"../../static/public/login_uncheck.png",
        selectedIcon:"../../static/public/login_check.png",
        titleTop:0,
        titleHeight:0,
        localNo:null,
    },
    // 页面加载
    onLoad(e) {
        var custom  = wx.getMenuButtonBoundingClientRect()
        console.log("res==================>***&&&12,2221====-------------->",e?.index)
        console.log("======>",e)
        this.setData({
            Index: e?.index,
            pageTitle: e?.title,
            titleTop:custom.top*2,
            titleHeight:custom.height*2
        })
        this.getlocalInfo();
    },
    onShow() {
        if (this.data.Index == 0) {
            this.getSessionInfo();//页面加载等待获取会话id
        }
        myGetStorger(storagename.localNo).then(res=>{
            this.setData({
                localNo:res.data
            })
        }).catch(err=>{
            console.log("没有err",err);
        })
    },
    goback(){
        console.log("hehhiihhihihi")
        wx.navigateBack({
          delta: 1,
        })
    },
    //页面加载获取本地数据一卡通，图书馆，教务网
    getlocalInfo() {
        !quitLoginFlag.jww ? myGetStorger(storagename.jwwInfo).then(res => {
            console.log("resjwwInfo===>", res)
            this.setData({
                jwwInfo:res.data
            })
        }).catch(err => {
            console.log("jwwInfo", err)
        }):this.setData({
            disabel:true,
            isSave:false
        })
        !quitLoginFlag.ykt?myGetStorger(storagename.yktInfo).then(res => {
            console.log("resyktinfo==>", res)
            this.setData({
                yktInfo:res.data
            })
        }).catch(err => {
                console.log("err", err)
        }):this.setData({
            disabel:true,
            isSave:false
        })
        !quitLoginFlag.tsg?myGetStorger(storagename.tsgInfo).then(res => {
            console.log("restsg===>", res)
            this.setData({
                tsgInfo:res.data
            })
        }).catch(err => {
            console.log(err)
        }):this.setData({
            disabel:true,
            isSave:false
        })
        myGetStorger(storagename.openId).then(res => {
            console.log("用openid", res)
            this.setData({
                hasOpendId: res.data?.length > 0,
                openId: res.data
            })
        }).catch(err => {
          this.setData({
            disabel:true
          })
            console.log("err", err)
        })
    },

    // 等待获取__VIEWSTAT和sessionId
    getSessionInfo() {
        myRequest('jwloginbefore').then(res => {
            console.log("data", res)
            const {sessionId,__VIEWSTATE} = res.data
            this.setData({
                sessionId: sessionId,
                __VIEWSTATE: __VIEWSTATE
            })
            mySetStorage('sessionId', sessionId)
            mySetStorage("__VIEWSTATE", __VIEWSTATE)

        }).catch(err => {
            console.log("fail", err)
            myToast("网络异常，请稍后尝试")
        })

    },
    // 获取输入信息
    getinfo(e) {
        var value = e.detail.value;
        var index = e.currentTarget.dataset.index;
        var datainfo = this.data.dataInfo;
        datainfo[index] = value;
        this.setData({
            dataInfo: datainfo
        })
    },
    // 获取是否记住密码
    bindChageck(e) {
        let sno = this.data.dataInfo.sno;
        
        this.data.localNo&&this.data.localNo!=sno?this.isCommon():this.setData({
            isSave: !this.data.isSave,
            disabel:!this.data.disabel
        });
        
    },
    bindProtocol(){
        this.setData({
            argeeProtol:!this.data.argeeProtol
        })
    },
    goWebview(e){
        var src =e.currentTarget.dataset.type ==="policy"? BaseRequestUrl+"resource/privacy/service.html": BaseRequestUrl+"/resource/privacy/private.html"
    console.log(src)
    myNavigatorTo(`/webview/webview?src=${src}`)
    },
    // 判断是否有openid，判断是否存在已有账号，控制chooseable
    isCommon() {
        let openid = this.data.openId;
        let sno = this.data.dataInfo.sno;
        let name = ["jww","tsg","ykt"]
        console.log("openid****************&&&&&======>",openid)
        if(openid){
           console.log("!quitLoginFlag[name[this.data.Index]]===>",!quitLoginFlag[name[this.data.Index]])
        //    可以考虑删除
            if(!this.data.localNo){
                console.log("可以删除的")
              this.setData({
                    disabel:false,
                    isSave:false
              })
             return;
          }
          this.remind();
            this.setData({
                disabel:true,
                isSave:false
            })
       } else if(openid){
        !quitLoginFlag[name[this.data.Index]]&&!this.data.localNo ?this.setData({
            disabel:false,
            isSave:true
        }): this.remind()
       }
    },
     remind (){
        wx.showModal({
            title:"账号提醒",
            content:"本账号和本微信绑定的账号不是同一个账号！只能做临时登录！如果想改变本微信绑定的账号，请前往 我的->设置->清空云端数据",
            confirmText:"去设置",
            success:res=>{
                if(res.confirm&&this.data.openId){
                    wx.redirectTo({
                      url: '../../page/setting/setting',
                    })
                }
            }
          })
    },
    // 跳转到下一个页面
    goDetail() {
        
        console.log(this.data.sessionId)
        if(this.data.index==0){
            !this.data.sessionId||!this.data.__VIEWSTATE?this.getSessionInfo()?.then(res=>{
                console.log("------>res1",res)
                this.to()
            }):this.to()
            return;
        }
        this.to();
       
    },

    // 页面跳转
    to() {
        setTimeout(() => {
            console.log("this.data.dataInfo", this.data.dataInfo)
            if (!this.data.dataInfo.pwd && !this.data.dataInfo.sno) {
                myToast("填写信息不能为空或者空格")
                return;
            }else if(!this.data.argeeProtol){
                myToast("请阅读协议，同意并勾选");
                return ;
            } else {
                switch (this.data.Index) {  //switch 通过index选择调用对应的login函数
                    case "0":
                        this.jwwlogin();  //调用登录教务网函数
                        break;
                    case "1":
                        this.tsglogin(this.data.dataInfo.sno, this.data.dataInfo.pwd); //调用登录图书馆函数
                        break;
                    case "2":
                        this.yktlogin(this.data.dataInfo.pwd, this.data.dataInfo.sno);//调用登录一卡通函数
                        break;

                }
            }
        }, 1000)
    },
    // 登入教务网
    jwwlogin() {
        console.log("this.data.issave============>",this.data.isSave)
        myRequest("jwlogin", {
            "sessionId": this.data.sessionId,
            "__VIEWSTATE": this.data.__VIEWSTATE,
            "studentName": "",
            "username": this.data.dataInfo.sno,
            "password": this.data.dataInfo.pwd,
            "checkCode": "",
            "xn": "",
            "xq": ""
        }, "POST").then(res => {
            console.log("登录成功", res)
            if (res.code != 200) {
                myToast("错误还有" + res.message.replace(/[^0-9]/g, '') + "机会", "error")
                return;
            }
            const studentName = res.data.studentName;
            var jwwInfo = {
                studentName: studentName,
                jwwSno: this.data.dataInfo.sno,
                jwwPwd: this.data.dataInfo.pwd
            }
            console.log("jwwInfo====>2",jwwInfo)
            if (this.data.isSave) {
                mySetStorage("jwwInfo", jwwInfo)
                this.setDataToDB("", this.data.dataInfo.sno, this.data.dataInfo.pwd, "", "", this.data.openId)
                mySetStorage(storagename.localNo,this.data.dataInfo.sno)
            }
            else {
                var UserInfo = getApp().globalData.UserInfo;
                UserInfo.jwwPwd = this.data.dataInfo.pwd;
                UserInfo.jwwSno = this.data.dataInfo.sno;
                UserInfo.studentName = studentName;
                app.globalData.UserInfo = UserInfo;
            }
            myRedirectTo(`jww/jww?name=${studentName}`)
        }).catch(err => {
            console.log("err", err)
            myToast("网络错误，请稍后尝试")
        })
    },
    // 登入图书馆函数
    tsglogin(tsgSno, tsgPwd) {
        myRequest("librarylogin", {
            name: tsgSno,
            pass: tsgPwd
        }, "POST").then((res) => {
            console.log("图书馆登录成功", res)
            if (res?.code != 200) {
                myToast(res.message);
                return;
            }
            var tsgInfo = {
                tsgSno: tsgSno,
                tsgPwd: tsgPwd
            }
            if (this.data.isSave) {
                mySetStorage("tsgInfo", tsgInfo)
                this.setDataToDB("", this.data.dataInfo.sno, "", this.data.dataInfo.pwd, "", this.data.openId)
                mySetStorage(storagename.localNo,this.data.dataInfo.sno)
            }
            var data1 = JSON.stringify(res.data)
            console.log("data1", data1)
            wx.redirectTo({
                url: "../../page/tsg/tsg?data=" + data1
            })
        }).catch(err => {
            console.log("err", err)
        })
    },
    // 登录一卡通账号
    yktlogin(pwd, Sno) {
        console.log(pwd, Sno)
        myRequest("yktlogin", {
            pass: pwd,
            name: Sno
        },"POST").then(res => {
            if (res?.code != 200) {
                myToast(res?.message);
                return;
            }
            
            const { limitMoney, state, name, money } = res.data;
            console.log("limitMoney, state, name, money=====>1",limitMoney, state, name, money)
            const yktInfo = {
                yktpwd: pwd,
                yktSno: Sno,
                state: state
            }
            if (this.data.isSave) {


                console.log("======>111111111111this.data.isSave",this.data.isSave)
                this.setDataToDB("", this.data.dataInfo.sno, "", "", this.data.dataInfo.pwd, this.data.openId)
                mySetStorage("yktInfo", yktInfo)
                mySetStorage(storagename.localNo,this.data.dataInfo.sno)
            }
            else {
                console.log("======>2222222222222222222,this.data.isSave",this.data.isSave)

                var UserInfo = getApp().globalData.UserInfo;
                UserInfo.yktInfo = yktInfo;
                app.globalData.UserInfo = UserInfo;
            }
            myRedirectTo(`ykt/ykt?title=账户详情&limitMoney=${limitMoney}&state=${state}&userName=${name}&money=${money}&pwd=${pwd}&Sno=${Sno}`)


        }).catch(err => {
            console.log("登录失败");
            myToast("登录失败")
        })
    },
    // 上传数据
    setDataToDB(openID, studentID, jwwPass, tsgPass, yktPass, chatID) {
        myRequest('setwechatuserinfo', {
            "openID": openID,
            "studentID": studentID,
            "jwwPass": jwwPass,
            "tsgPass": tsgPass,
            "yktPass": yktPass,
            "chatID": chatID
        }, "POST").then(res => {
            console.log("上传成功", res)
        }).catch(res => {
            myToast("网络链接异常");
        })
    },
})