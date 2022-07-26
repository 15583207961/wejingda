import {myRequest} from "./usePackegeSysFun.js"
// 获取用的openid
export const getUserInfos = () =>{
 return  new Promise((resolve,rej)=>{
    wx.getUserProfile({
      desc: 'MrcoJc完善资料',
      success: res => {
          wx.login({
              success: res => {
                 myRequest("getopenid?code="+res.code,{},"POST").then(res=>{
                   console.log("成功了",res)
                     resolve(res)
                 }).catch(err=>{
                   rej(err)
                     console.log("获取失败",err)
                 })
              }
          })
      },
      fail: err => {
          rej(err)
      }
  })
  })

}