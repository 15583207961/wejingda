import * as echarts from '../../ec-canvas/echarts';
let chart = null;
const baseUrl = getApp().globalData.BaseURL
let spendMoneyArr =[]
var initChart = null;
import {
  myRequest,
  myToast,
} from "../../utils/usePackegeSysFun.js"
Page({
    data:{
        pwd:"",
        Sno:"",
        ec:{
            onInit: function(canvas, width, height,dpr) {
              initChart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr
              });
              canvas.setChart(initChart);
              return initChart;
            }
        },
        data_list:[],
        startdate: '2016-09-01',
        enddate:"2017-09-01",
        info:{
          title1:"今日消费",
          number1:"0",
          title2:"余额",
          number2:"",
          linear_gradiebt:"linear-gradient(#8CD1FF,#8CD1FF,#FAFAFA)",
          text1:'元',
          text2:"元"
        },
        spendMoneyArr:[],
        timeArr:[]
    },
    // initChartOption
    initChartOption(){
      initChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.data.timeArr,
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
          axisLine: {
            show: false //不显示坐标轴轴线
          },
          axisTick: {
            show: false //不显示坐标轴刻度
          }
        }],
        series: [{
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: this.data.spendMoneyArr,     
          itemStyle:{
            barBorderRadius:[6,6,0,0],
            color:"#4DADFF"
          }
        }]
      })
    },
    // 页面加载
    onLoad(e){
        console.log("e",e)
        var info = this.data.info
        info.number2 = e.balance;
        this.setData({
            pwd:e.pwd,
            Sno:e.Sno,
            info:info
        })
        var date = new Date();
        var date1 = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
        this.setData({
          startdate:date1,
          enddate:date1
        })
        this.getRecord(date1,date1,1);
        this.getSevenData(e.pwd,e.Sno);
    },
    //改变页面时间数据 
    bindDateChange: function(e) {
      console.log(e)
      console.log('picker发送选择改变，携带值为', e.detail.value)
      var index = e.currentTarget.dataset.index
      if(index == "0"){
        this.setData({
          startdate: e.detail.value
        })
      }else if(index == "1"){
        this.setData({
          enddate:e.detail.value
        })
        this.getRecord(this.data.startdate,this.data.enddate)
      }
    },
    // 发送请求获取时间段的消费记录数据
    getRecord(startdate,enddate,num=0){
      wx.showLoading({
        title: '数据加载中...'
      })
      myRequest("yktrecords",{
        "name": this.data.Sno, 
        "pass": this.data.pwd, 
        "start": startdate, 
        "end": enddate 
      },"POST").then(res=>{
        var recordsInfoArrayList = res.recordsInfoArrayList;
        this.setData({
          data_list:recordsInfoArrayList?.map(item=>{
            var i = item;
            i.machine = i.machine?.split("-")
            return i
          })
        })

        if(num == 1 && recordsInfoArrayList?.length>=1){ 
          var info =this.data.info;
          info.number1=res.spendMoney;
          this.setData({
            info:info,
            data_list:recordsInfoArrayList
          })
        }
      }).catch(err=>{
        myToast("数据查询失败","error")
      })
     
    },
    // 获取七天数据
    getSevenData(pwd,sno){
      myRequest("sevenrecords",{
        "name": pwd, 
        "pass": sno 
        },"POST").then(res=>{
          const sevenRecordsInfoArrayList =res.sevenRecordsInfoArrayList
          let spendMoneyArr = sevenRecordsInfoArrayList.map(item=>{
            return item.spendMoney
          }).reverse()
          let timeArr = sevenRecordsInfoArrayList.map(item=>item.time.split('-')[2]).reverse()
          this.setData({
            spendMoneyArr:spendMoneyArr,
            timeArr:timeArr
          })
          this.initChartOption()
        console.log("七天数据",res);
      }).catch(err=>{
        console.log("获取错误",err);
        myToast("网络异常")
      })
    }
})
