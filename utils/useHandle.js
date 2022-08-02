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
module.exports = {
  getResourceUrl,getNowTime,encodeURIComponentUrl,decodeURIComponentUrl
}