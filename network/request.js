import {baseUrl} from "../common/config.js"
export default function request(url,method="GET",data={}){
  return  wx.request({
    url: baseUrl+url,
    method:method,
    data:data
  })
}