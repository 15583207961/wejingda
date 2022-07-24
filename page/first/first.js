import {InfoSetStorage,InfoGetStroage} from '../../utils/OInfoStroage'
import {getWechatUserInfo} from '../../utils/getWechatUserInfo'
const baseUrl = getApp().globalData.BaseURL
Page({
    data:{
        firstvalue:'',
        ischecked:false,
        isshowdetail:false
    },
    // 页面启动
    onLoad(){
        InfoGetStroage("firstvalue",data=>{
            if(data!=-1){
                wx.switchTab({
                  url: '../../page/compus/compus',
                })
            }
        })
    },
    // 点击勾选le
    radioTap(){
      this.setData({
        ischecked:!this.data.ischecked
      })
    },
    // 点击条状到详情页面
    goagreementDetail(){
      this.setData({
        isshowdetail:!this.data.isshowdetail
      })
    },
    // 获取输入数据
    getdata(e){
        console.log(e.detail.value)
        this.setData({
            firstvalue:e.detail.value.trim()
        })
    },
    // 点击确认弹框
    tap_ok(){
      if(!this.data.ischecked){
        wx.showToast({
          title: '请阅读协议同意并勾选',
          icon:"none"
        })
        return ;
      }
        if(this.data.firstvalue == ""){
            wx.showToast({
              title: '请输入账号',
              icon:'none'
            })
            return
        }
        wx.showModal({
          title:"确认输入",
          content:`确认账号：${this.data.firstvalue} 是本人账号`,
          success:res=>{
              if(res.confirm){
                InfoSetStorage("firstvalue",this.data.firstvalue)
                this.getUserProfile(()=>{})
               wx.switchTab({
                url: '../../page/compus/compus',
              })
             
              }
             
          }
        })
    },
    getUserProfile(cb){
        wx.getUserProfile({
               desc: 'MrcoJc完善资料',
               success:res=>{
                   console.log(res)
                   cb(res)
                   wx.login({
                     success:res=>{
                         var {code} = res
                         wx.request({
                           url: baseUrl+'/getopenid?code='+code,
                           success:res=>{
                             console.log(res)
                             if(res.data?.openid){
                                 InfoSetStorage("openId",res.data.openid)
                                 getWechatUserInfo(res.data.openid)
                                 
                             }

                           },
                           fail:err=>{
                             console.log("失败了",err)
                           }
                         })
                     }
                   })
               },
               fail:err=>{
                   console.log("hello",err)
                   cb(-1);
               }
             })
       }
})