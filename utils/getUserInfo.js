import {myRequest,mySetStorage} from "./usePackegeSysFun.js";
import {storagename} from "../config/storageNameconfig.js"
// 获取用的openid
export const getUserInfos = () =>{
 return  new Promise((resolve,rej)=>{
    wx.getUserProfile({
      desc: 'MrcoJc完善资料',
      success: res => {
        console.log("res授权信息==》",res)
        let chatInfo = {
          name :res.userInfo.nickName,
          gender :res.userInfo.gender,
          avatarUrl:res.userInfo.avatarUrl,
          language:res.userInfo.language
        }
        mySetStorage(storagename.chatInfo,chatInfo)
          wx.login({
              success: res => {
                console.log("res===>",res)
                 myRequest("getopenid?code="+res.code,{},"POST").then(res=>{
                   console.log("成功了---------------》2",res)
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