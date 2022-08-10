
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
import { getUserInfos } from "../../utils/getUserInfo"
// const dataInfo = getApp().globalData.swzlDataInfo||{foundInfoArrayList:[],lostInfoArrayList:[]}
const pagelost = getApp().globalData.pagelost || 0 //丢失的偏移页数
const pagepick = getApp().globalData.pagepick || 0  //拾的的偏移页数
const swzlDataInfoPick = getApp().globalData.swzlDataInfoPick || []
const swzlDataInfoLost = getApp().globalData.swzlDataInfoLost || []
Page({
  data: {
    swzlDataList: {},//失物招领的渲染信息
    netWorkErr: false,//网络出错了
    // pagelast: pages,
    pagelost: pagelost,
    pagepick: pagepick,
    showTips: false,
    currentType: "lost",
    swzlDataInfoPick: swzlDataInfoPick,
    swzlDataInfoLost: swzlDataInfoLost,
  },
  /**
   * 内部函数
   */
  onLoad() {
    !swzlDataInfoPick.length || !swzlDataInfoLost.length ? this.getLostInfo(0) : this.setData({
      swzlDataInfoPick: swzlDataInfoPick,
      swzlDataInfoLost: swzlDataInfoLost,
    })
  },
  onReachBottom() {
    console.log("触底了")
    if (!this.data.showTips) {
      this.data.currentType=="lost"? this.getLostInfo(this.data.pagelost):this.getLostInfo(this.data.pagepick)
    }
  },
  // onPullDownRefresh(){
  //   console.log("下拉刷新",this.data.showTips)
  //   this.getLostInfo(this.data.pagelast)
  // },
  //获取失物招领数据
  getLostInfo(pages) {
    myRequest(`lostfound?type=all&userID=null&page=${pages}`).then(res => {
      console.log("获取到了数据~", res);
      let reqData;
      if (this.data.currentType === "lost") {
        reqData = res.data.lostInfoArrayList;
        let lostInfoArrayList = this.data.swzlDataInfoLost.concat(reqData)
        getApp().globalData.pagelost = this.data.pagelost + 1;
        getApp().globalData.swzlDataInfoLost = lostInfoArrayList;
        this.setData({
          swzlDataInfoLost: lostInfoArrayList,
          pagelost: this.data.pagelost + 1
        })

      } else {
        reqData = res.data.foundInfoArrayList;
        let swzlDataInfoPick = this.data.swzlDataInfoPick.concat(reqData)
        getApp().globalData.pagepick = this.data.pagepick + 1;
        getApp().globalData.swzlDataInfoPick = swzlDataInfoPick;
        console.log("swzlDataInfoPick1--",swzlDataInfoPick)
        console.log("reqData1--",reqData)
        this.setData({
          swzlDataInfoPick: swzlDataInfoPick,
          pagepick: this.data.pagepick + 1
        })
      }
      if (!reqData.length) {
        myToast("没有更多数据了~")
        this.setData({
          showTips: true
        })
        return;
      } else {
        this.setData({
          showTips: false
        })
      }
      // const data = {
      //   foundInfoArrayList,lostInfoArrayList
      // }
      // console.log("data===》",data)
      // this.setData({
      //   swzlDataList:data,
      //   pagelast:this.data.pagelast+1
      // }),

      // getApp().globalData.page=this.data.pagelast+1;
      // getApp().globalData.swzlDataInfo=data;
    }).catch(err => {
      console.log("获取失败了", err)
      myToast("出错了,请稍后重试")
      this.setData({
        netWorkErr: true
      })
    })
  },





  /**
   * 自定义绑定函数
   */

  //  去搜索详情页面
  goSreachPage() {
    console.log("nhao")
    wx.navigateTo({
      url: '../../page/swzlSreach/swzlSreach',
    })
  },
  // selectType
  selectType(e) {
    console.log("e", e)
    this.setData({
      currentType: e.currentTarget.dataset.type
    })
    if(e.currentTarget.dataset.type=="lost" && !this.data.swzlDataInfoLost.length){
      this.getLostInfo(this.data.pagelost)
    }else if(e.currentTarget.dataset.type=="pick" &&!this.data.swzlDataInfoPick.length){
      this.getLostInfo(this.data.pagepick)
    }
  },

  // 去发布失物招领页面
  goAddPage() {
    console.log("跳转到添加详情页面")
    myGetStorger(storagename.openId).then(res => {
      console.log("获取到了", res);
      this.myNavGoto(res.data)
    }).catch(err => {
      getUserInfos().then(res => {
        console.log("获取到的数据", res)
        this.myNavGoto(res.data.openid)
        mySetStorage(storagename.openId, res.data.openid)
      }).catch(err => {
        myToast("授权失败", "error")
        console.log(err)
      })
    })

  },
  myNavGoto(openid) {
    wx.navigateTo({
      url: '../../page/swzlAdd/swzlAdd?openid=' + openid,
    })
  }
})