import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage,
  myRedirectTo
} from "../../utils/usePackegeSysFun.js"
import { storagename } from "../../config/storageNameconfig.js";
Page({
  data:{
    companyName:null,
    position:null,
    salary:null,
    workType:null,
    name:null,
    phone:null,
    wechatNumber:null,
    type:null,
    address:null,
    articleUrl:null,
    content:null,
    openid:null,
    index:0,
    headPic:null,
    typeArr:["校内招聘","校外招聘"]
  },
  onLoad(e){
    this.setData({
      openid:e.openid
    })
    this.getLocalData()
    console.log("----------------->",e)
  },
  bindPickerChange(e){
  this.setData({
    type:this.data.typeArr[e.detail.value]
  })
  },
  //获取本地数据
  getLocalData(){
    myGetStorger(storagename.chatInfo).then(res=>{
      console.log("res",res)
      this.setData({
        headPic:res.data.avatarUrl
      })
    })
  },
  inputvalue(e){
    let value =e.detail.value
    let type = e.currentTarget.dataset.type
    console.log("e",e)
    switch(type){
      case "companyName":
        this.setData({
          companyName:value
        });break;

        case "position":
        this.setData({
          position:value
        });break;
        case "salary":
        this.setData({
          salary:value
        });break;
        case "workType":
        this.setData({
          workType:value
        });break;
        case "name":
        this.setData({
          name:value
        });break;
        case "phone":
        this.setData({
          phone:value
        });break;
        case "wechatNumber":
        this.setData({
          wechatNumber:value
        });break;
        case "address":
        this.setData({
          address:value
        });break;
        case "articleUrl":
        this.setData({
          articleUrl:value
        });break;
        case "content":
        this.setData({
          content:value
        });break;

    }    
  },
  sumbit(){
    wx.showModal({
      title:"提醒",
      content:"确认提交",
      success:res=>{
        if(res.confirm){
          if(!this.data.companyName){
            myToast("公司名字不能为空")
            return;
          }
          if(!this.data.position){
            myToast("职位不能为空")
            return ;
          }
          if(!this.data.salary){
            myToast("薪资不能为空")
            return ;
          }
          if(!this.data.workType){
            myToast("出勤不能为空")
            return ;
          }
          if(!this.data.name){
            myToast("姓名不能为空")
            return ;
          }
          if(!this.data.phone){
            myToast("电话号码不能为空")
            return ;
          }
          if(!this.data.type){
            myToast("类型不能为空")
            return ;
          }
          if(!this.data.address){
            myToast("地点不能为空")
            return ;
          }
          if(!this.data.content){
            myToast("内容不能为空")
            return ;
          }
          var text = this.data.companyName+this.data.position+this.data.salary+this.data.workType+this.data.name+this.data.phone+this.data.wechatNumber+this.data.type+this.data.address+this.data+this.data.articleUrl+this.data.content
          myRequest("checkmsg",{
            "openid": this.data.openid, 
            "scene": 2, 
            "version": 2, 
            "content": text 
            },"POST").then(res=>{
              console.log("检测成功了",res)
              if(res.message){
                myToast(res.message)
                return;
              }
              let data = {
                "openid":this.data.openid,
                "name":this.data.name,
                "headPic":this.data.headPic,
                "address":this.data.address,
                "phone":this.data.phone,
                "content":this.data.content,
                "position":this.data.position,
                "salary":this.data.salary,
                "workType":this.data.workType,
                "type":this.data.type,
                "companyName":this.data.companyName,
                "wechatNumber":this.data.wechatNumber   
            }
              console.log("34567890-234567890-34567890")
              myRequest("addWorkStudyProgramInfo",data,"POST").then(res=>{
                if(res.code ==200){
                  myToast(res.data,"success")
                  console.log("res",res)
                  setTimeout(()=>{
                    wx.navigateBack({
                      delta: 1,
                    })
                  },2000)
                }
                else{
                  myToast(res.message)
                }
              
              }).catch(err=>{
                console.log("出错了",err)
                myToast("出错了~")
              })
            }).catch(err=>{
              rej(err)
              console.log("检测失败了",err)
            })
        }
      }
    })
 

    
  }
})