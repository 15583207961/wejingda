
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
import { getUserInfos } from "../../utils/getUserInfo.js";
Page({
  data: {
    listData:[],
    curIndex: -1,
    clsname: "option",
    openid: null
  },
  onLoad() {
    this.getLocalData();
    this.getdata();
  },
  // 获取本地数据
  getLocalData() {
    myGetStorger(storagename.openId).then(res => {
      console.log("获取成功", res)
      this.setData({
        openid: res.data
      })
    }).catch(err => {
      console.log("err", err)
    })
  },
  // 跳转到添加页面
  add() {
    if (this.data.openid) {
      myNavigatorTo("/WSPAdd/WSPAdd?openid=" + this.data.openid)
      return;
    }
    getUserInfos().then(res => {
      console.log("获取成功", res)
      this.setData({
        openid: res.data.openid
      })
      mySetStorage(storagename.openId, res.data.openid)
      myNavigatorTo("/WSPAdd/WSPAdd?openid=" + res.data.openid)
    })
  },
  // 获取网络数据
  getdata() {
    myRequest("getWorkStudyProgramInfo?role=normal").then(res => {
      console.log("获取成功", res)
      if(res.code ==200){
        this.setData({
          listData:res.data
        })
      }
    }).catch(err => {
      console.log("获取成败了", err)
    })
  }
})