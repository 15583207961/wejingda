import {InfoGetStroage, InfoSetStorage} from '../../utils/OInfoStroage'
const baseUrl = getApp().globalData.BaseURL
import {getWechatUserInfo} from '../../utils//getWechatUserInfo'
Page({
    data:{
        userInfo:'',
        hasopenid:false
    },
    // 页面加载
   onShow(){
    this.hasOpenId()
   },
    // 页面加载查看是否有openId
    hasOpenId(){
      InfoGetStroage("openId",data=>{
        console.log("花花胡",data)
        if(data == -1){
          this.setData({
            hasopenid:false
          })
        }else{
          this.setData({
            hasopenid:true
          })
        }
      })
    },
    // 或本地是否授权过
    isGetOpenId(){
      if(!this.data.hasopenid){
        this.getUserProfile()
      }
      else{
          wx.showToast({
            title: '已授权,进设置取消授权',
            icon:'none'
          })
        }
    },
    //获取用户授权
    getUserProfile(cb){
      wx.showLoading({
        title:"加载中."
      })
      setTimeout(()=>{
        wx.hideLoading()
      },500)
      wx.getUserProfile({
          desc: 'MrcoJc完善资料',
          success:res=>{
            console.log("头像",res)
            wx.showLoading({
              title: '授权登录中...',
            })
          
              wx.login({
                success:res=>{
                    var {code} = res
                    console.log("hellhuahuahuuqgiia>>",res)
                    console.log("这个是code:",code)
                    wx.request({
                      url: baseUrl+'/getopenid?code='+code,
                      success:res=>{
                        console.log("获取到的数据",res)
                        if(res.data?.openid){
                          wx.hideLoading()
                          wx.showToast({
                            title: '登录成功',
                            icon:"none"
                          })
                          InfoSetStorage("openId",res.data.openid)
                          getWechatUserInfo(res.data.openid)
                          this.setData({
                            hasopenid:true
                          })
                        }
                      },
                      fail:err=>{
                        wx.hideLoading()
                        wx.showToast({
                          title: '登录异常',
                          icon:'error'
                        })
                      }
                    })
                },
                fail:err=>{
                  wx.hideLoading()
                  wx.showToast({
                    title: '登录异常',
                    icon:"error"
                  })
                }
              })
          }
        })
  },
    // 点击复制
    handle_copy(){
      wx.setClipboardData({
        //要复制的数据
         data:"95547598",
         success: function (res) {
           wx.showToast  ({
             title: 'QQ号复制成功,进群反馈',
             icon: 'none',
             duration: 2000,
           });
         }
       });
    },
    // 点击跳转到详情页面
    to_detail(){
      InfoGetStroage("openId",data=>{
        if(data == -1){
          wx.showToast({
            title: '请先登录账号',
            icon:"none"
          })
          return ;
        }
        wx.navigateTo({
          url: '../../page/setting/setting',
        })
      })
    },
    // 
    
})