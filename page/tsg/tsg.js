import * as echarts from '../../ec-canvas/echarts.js';
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage,
  myRedirectTo
} from "../../utils/usePackegeSysFun.js"
const baseUrl = getApp().globalData.BaseURL
let chart = null;
Page({
  data: {
    info: {
      title1: "已借阅",
      number1: "",
      title2: "可借阅",
      number2: "",
      linear_gradiebt: "linear-gradient(#8AF081,#8AF081,#FAFAFA)",
      text1: "本",
      text2: "本"
    },
    ec: {
      onInit: initChart
    },
    borrowBooks: [

    ]
  },
  onLoad(e) {
    console.log("huahuhau", e);
    if (e?.index) {
      this.tsgLogin();
    } else {
      console.log(JSON.parse(e.data))
      this.hanleDate(JSON.parse(e.data))
    }
  },
  // 点解跳转到搜索页面
  sreachTsg() {

  },
  //点击续借
  Renew(e) {
    console.log(e)
  },
  // 处理获取的数据
  hanleDate(data) {
    const { available, booksData, borrowed } = data
    var info = this.data.info
    info.number1 = borrowed;
    info.number2 = available - borrowed
    var booksData1 = booksData?.map(item => {
      item.borrowingTime = item.borrowingTime.split(" ")[0];
      var date = new Date();
      var RTArr = item.returnTime.split("-")
      item.value = Date.UTC(parseInt(RTArr[0]), parseInt(RTArr[1]), parseInt(RTArr[2])) - Date.UTC(parseInt(date.getFullYear()), parseInt(date.getMonth() + 1), parseInt(date.getDate())) >= 0 ? "否" : "是"
      return item
    })
    this.setData({
      info: info,
      borrowBooks: booksData1
    })
  },
  // 获取本地数据，并登录
  tsgLogin() {
    myGetStorger("tsgInfo").then(res => {
      console.log("res", res);
      var { tsgSno, tsgPwd } = res.data;
      myRequest("librarylogin", {
        "name": tsgSno, 
        "pass": tsgPwd
      },"POST").then(res1=>{
        console.log("res1",res1);
        this.hanleDate(res1.data)
      })
    }).catch(err=>{
      console.log("err",err);
      myToast("网络异常，请稍后尝试")
      wx.switchTab({
        url: '../../page/compus/compus',
      })
    })
   
  }

})

function initChart(canvas, witdh, height, dpr) {
  chart = echarts.init(canvas, null, {
    witdh: witdh,
    height: height,
    devicePixelRatio: dpr
  })
  canvas.setChart(chart)

  let option = getOption()

  chart.setOption(option)
  return chart
}

function getOption() {
  return {
    color: ['#80FFA5'],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Line 1',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)'
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [140, 232, 101, 264, 90, 340, 250]
      },
    ]
  };
}