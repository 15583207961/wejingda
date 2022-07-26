
import { storagename } from "../../config/storageNameconfig.js";
import {
    myNavigatorTo,
    myGetStorger,
    myRequest,
    myToast,
    mySetStorage,
} from "../../utils/usePackegeSysFun.js"
Page({
    data:{
        function_list:[{
            imgurl:"../../static/public/bianzu7.png",
            color:"#fdc021",
            title:"成绩查询"
        },{
            imgurl:"../../static/public/bianzu8.png",
            color:"#1296db",
            title:"考试查询"
        },{
            imgurl:"../../static/public/bianzu9.png",
            color:"#ffda44",
            title:"补考查询"
        },{
            imgurl:"../../static/public/bianzu10.png",
            color:"#1296db",
            title:"空教室查询"
        }
    ], //列表数据
        studentName:''
    },
    onLoad(e){
        console.log(e)
        myGetStorger("jwwInfo").then(res=>{
            console.log("获取成功",res);
            this.setData({
                studentName:res.data.studentName
            })
        }).catch(err=>{
            this.setData({
                studentName:e.name
            })
        })
       
        if(!e?.name){
            this.getSessionInfo();
        } 
    },
// 等待获取__VIEWSTAT和sessionId
getSessionInfo(){
    myRequest("jwloginbefore").then(res=>{
        
            console.log("res",res)
            this.setData({
                sessionId: res.sessionId,
                 __VIEWSTATE: res.__VIEWSTATE
            })
            mySetStorage("sessionId",res.sessionId);
            mySetStorage("__VIEWSTATE",res.__VIEWSTATE);
            myGetStorger("jwwInfo").then(res2=>{
                const {jwwSno,jwwPwd} = res2.data
                this.jwwlogin(res.sessionId,res.__VIEWSTATE,jwwSno,jwwPwd)
            })
        })
   
},
//登录教务网,函数将被第二次登入时调用
jwwlogin(sessionId,__VIEWSTATE,sno,pwd){
    let data ={
        "studentName": "",
        "username": sno, 
        "password": pwd, 
        "checkCode": "",
        "xn": "",
        "xq": "", 
        "sessionId": sessionId, 
        "__VIEWSTATE": __VIEWSTATE, 
    }
    console.log("data====>",data)
    myRequest("jwlogin",data,"POST").then(res=>{
        mySetStorage(storagename.jwwInfo,{jwwPwd:pwd,jwwSno:sno,studentName:res.studentName})
        this.setData({
            studentName:res.studentName
        })
    }).catch(err=>{
        console.log("登录失败了",err)
        myToast("登录异常，请稍后尝试")
        wx.switchTab({
            url: '../../page/compus/compus',
          })
    })
  },
    godetail(e){
        var index = e.currentTarget.dataset.index 
        if(index == "3"){
            myNavigatorTo(`/kjscx/kjscx?name=${this.data.function_list[index].title}`)
        }
        else{
            myNavigatorTo(`/xxcx/xxcx?index=${index}&Name=${this.data.function_list[index].title}`)
        }
    }
})