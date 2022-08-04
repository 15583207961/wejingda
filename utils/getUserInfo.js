import { myRequest, mySetStorage } from "./usePackegeSysFun.js";
import { storagename } from "../config/storageNameconfig.js"
// 获取用的openid
export const getUserInfos = () => {
  return new Promise((resolve, rej) => {
    wx.getUserProfile({
      desc: 'MrcoJc完善资料',
      success: res => {
        console.log("res授权信息==》", res)
        let chatInfo = {
          name: res.userInfo.nickName,
          gender: res.userInfo.gender,
          avatarUrl: res.userInfo.avatarUrl,
          language: res.userInfo.language
        }

        mySetStorage(storagename.chatInfo, chatInfo)
        wx.login({
          success: res => {
            console.log("res===>", res)
            myRequest("getopenid?code=" + res.code, {}, "POST").then(res => {
              console.log("成功了---------------》2", res)
              myRequest("adduser", {
                chatID: res.data.openid,
                userImage: chatInfo.avatarUrl,
                nickname: chatInfo.name
              },"POST").then(res12=>{
                console.log("上传成功了",res12)
              resolve(res)
              }).catch(err=>{
                console.log("失败了",err)
                resolve(res)
              })
            }).catch(err => {
              rej(err)
              console.log("获取失败", err)
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