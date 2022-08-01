import * as echarts from '../../ec-canvas/echarts.js';
var initChart = null;
import {getResourceUrl} from "../../utils/useHandle.js"

import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage,
  myRedirectTo
} from "../../utils/usePackegeSysFun.js"
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
    ecIcon:getResourceUrl("resource/img/icon_wdjy.png"),
    sreachIcon:getResourceUrl("resource/img/icon_ssgcts.png"),
    jyxqIcon:getResourceUrl("resource/img/icon_jyxq.png"),
    ec:{
            onInit: function(canvas, width, height,dpr) {
            console.log("init")  
              initChart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr
              });
              canvas.setChart(initChart);
              return initChart;
            }
        },
    borrowBooks: [

    ]
  },
  initChartOption(){
    console.log("heii")
    initChart.setOption({
      color: ['#80FFA5'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: ['2019年', '2020年', '2021年'],
        boundaryGap: false,
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          show: false //不显示坐标轴轴线
        },
        axisTick: {
          show: false //不显示坐标轴刻度
        }
      }],
      yAxis: [{
        type: 'value',
        boundaryGap: false,
        axisLine: {
          show: false //不显示坐标轴轴线
        },
        splitNumber:3,
        axisTick: {
          show: false //不显示坐标轴刻度
        }
      }],
      series: [{
        name: 'Borrow',
        type: 'line',
                smooth: true,
        lineStyle: {
          width: 1
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(199,243,218,0.9)'
            },
            {
              offset: 1,
              color: 'rgb(255,255,255,0.9)'
            }
          ])
        },
        data: [60, 50, 31], 
      }]
    })
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
  onShow(){
    setTimeout(()=>{
      this.initChartOption()
    },1000)

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
