import { getResourceUrl } from "../../utils/useHandle";

import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
import EventType from "../../common/EventType";
Page({
  data:{
    deleteUrl:getResourceUrl("resource/img/icon_del.png"),
    page:"0",
    list:[]
  },
  onLoad(){
    this.getLocalData()
  },
  // 获取本地数据
  getLocalData(){
    myGetStorger(storagename.openId).then(res=>{
      console.log("获取成功",res)
      this.requsetMySendInfo(res.data,this.data.page)
    }).catch(err=>{
      myToast("暂时没有记录")
    })
  },
  // 请求获取我发布的信息
  requsetMySendInfo(openid,page){
    const data={

    }
    myRequest(`lostfound?type=person&userID=${openid}&page=${page}`).then(res=>{
      console.log("请求成功",res)
      this.setData({
        list:res.data.foundInfoArrayList.concat(res.data.lostInfoArrayList)
      })
    }).catch(err=>{
      console.log("请求失败了",err);
    })
  },
  // delete
  delete(e){
    console.log("delete",e)
    const index = e.currentTarget.dataset.index
    wx.showModal({
      content:"删除当前记录",
      success:res=>{
        if(res.confirm){
          myRequest(`dellostfound?type=lostID&id=${this.data.list[index].lostID}`,{},"POST").then(res=>{
            console.log("删除成功",res);
            if(res.data=="删除成功！"){
              const list =this.data.list
            list.splice(index,1);
            this.setData({
              list:list
            })
            }
          }).catch(err=>{
            console.log("删除成功",err)
          })
        }
      }
    })
  },
  // godetail
  godetail(e){
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../page/swzlItemDetail/swzlItemDetail',
      success:res=>{
        res.eventChannel.emit(EventType.SWZLgoItemDetail,{data:this.data.list[index]})
      }
    })
  }
})