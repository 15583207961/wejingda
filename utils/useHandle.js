const { BaseRequestUrl } = require("../config/baseConfig");

// 封装请的资源路径方法

const getResourceUrl = (url)=>{
  return BaseRequestUrl+url;
}

// 封装页面跳转，传递参数http请求链接,使用encodeURIComponent
const encodeURIComponentUrl = (url)=>{
  return encodeURIComponent(JSON.stringify(url))
}
//封装解码
const decodeURIComponentUrl =(ecodeUrl)=>{
  return JSON.parse(decodeURIComponent(ecodeUrl))
}

// 封装获取当前时间
const getNowTime = ()=>{
  var date = new Date()
    var time = (date.getMonth() + 1) + "月" + date.getDate() + "日 " + date.getHours() + ":" + date.getMinutes()
    return time;
}

// 敏感词汇过滤
 const checkText = (text)=>{
  return new Promise((resolve,rej)=>{
    myRequest("checkmsg",{
      "openid": this.data.openid, 
      "scene": 2, 
      "version": 2, 
      "content": text 
      },"POST").then(res=>{
        console.log("检测成功了",res)
        resolve(res)
      }).catch(err=>{
        rej(err)
        console.log("检测失败了",err)
      })
  })
}

module.exports = {
  getResourceUrl,getNowTime,encodeURIComponentUrl,decodeURIComponentUrl,checkText
}