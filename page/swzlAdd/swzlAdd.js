import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myPreviewInfos,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
import {getUserInfos} from "../../utils/getUserInfo"
Page({
  data: {
    WhereArr: [
      "A教",
      "B教",
      "c教",
      "D教",
      "X教",
      "Z教",
      "图书馆",
      "一食堂",
      "二食堂",
      "三食堂",
      "四食堂",
      "五食堂",
      "六食堂",
      "七食堂",
      "杏岛餐厅",
    ],
    typeArr: [
      "钥匙",
      "手机",
      "衣服",
      "包",
      "饭卡",
      "身份证",
      "钱包",
      "书",
      "作业"
    ],
    typeThingArr:[
      "lost","found"
    ],
    whereValue: "",//地点显示信息
    whenValue: "",//显示时间信息
    typeValue: "",//类型信息
    descriptionValue: "",//描述信息
    openid:null,//openid
    temporaryLink:"",//临时链接
    isShowTips:false,//是否出现过第一次提示
    typeThingValue:null,
  },
  //删除当前照片
  delete(){
    this.setData({
      temporaryLink:""
    })
    getApp().globalData.imgSrc="";
  },
  //预览图片
  preview(){
    myPreviewInfos([{url:this.data.temporaryLink}])
  },
  // 文字检查是否违规
  checkText(text){
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
  },
  // takePhoto
  takePhoto() {
    myNavigatorTo("/cropper/cropper").then(res=>{
      console.log("tiaozhangchengg ",res)
    }).catch(err=>{
      console.log("是啊比了",err)
    })
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success: res => {
    //     // tempFilePath可以作为 img 标签的 src 属性显示图片
    //     const tempFilePaths = res.tempFilePaths
    //     console.log(tempFilePaths)
    //     this.compressImage(tempFilePaths[0], (data) => {
    //       console.log("datta==>", data)
    //       this.setData({
    //         temporaryLink:data
    //       })
    //     })
    //   }
    // })
  },
  //canvas 压缩
  compressImage(path, callback) {
    wx.getImageInfo({
      src: path,
      success: res => {
        var ctx = wx.createCanvasContext('photo_canvas'); // 创建画布
        var towidth = 500;  //设置canvas尺寸，按宽度500px的比例压缩
        var toheight = Math.trunc(500 * res.height / res.width);  //根据图片比例换算出图片高度
        this.setData({ canvasHeight: toheight });
        ctx.drawImage(path, 0, 0, res.width, res.height, 0, 0, towidth, toheight);
        ctx.draw(false, function () {
          wx.canvasToTempFilePath({
            canvasId: 'photo_canvas',
            fileType: "jpg",
            quality: 0.8, // 注意你的压缩质量，卤煮真的压缩出20KB的，图片整个都是糊的
            success: res2 => {
              console.log(res2.tempFilePath);
              callback(res2.tempFilePath);
            }
          }, this)
        })
      }
    });
  },
  //地点下来选择方式
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      whereValue: this.data.WhereArr[e.detail.value]
    })
  },
  //地点获取方式，用户输入
  inputWhere(e) {
    console.log("e", e)
    let value = e.detail.value
    this.setData({
      whereValue: value.trim()
    })
  },

  // 获取时间
  bindDateChange(e) {
    console.log(e)
    this.setData({
      whenValue: e.detail.value
    })
  },
  // 获取输入的类型
  inputWhereType(e) {
    let value = e.detail.value
    this.setData({
      typeValue: value.trim()
    })
  },
  bindPickerChangeType(e) {
    this.setData({
      typeValue: this.data.typeArr[e.detail.value]
    })
  },
//inputThingType
inputThingType(e){
  let value = e.detail.value
  console.log("helloo".value)
  this.setData({
    typeThingValue: this.data.typeThingArr[value]
  })
},
  //getDescription获取描述
  getDescription(e) {
    let value = e.detail.value.trim()
    this.setData({
      descriptionValue: value
    })
  },
  // 发送
  submit() {
    if(!this.data.temporaryLink){
      myToast("图片不能为空")
      return;
    }
    if (!this.data.whereValue) {
      myToast("地点信息不能为空");
      return;
    }
    if (!this.data.whenValue) {
      myToast("时间信息不能为空");
      return;
    }
    if (!this.data.typeValue) {
      myToast("类型选择不能为空");
      return;
    }
    if (this.data.descriptionValue.length < 10) {
      myToast("描述字数不能少于10")
      return;
    }
    if(!this.data.typeThingValue){
      myToast("类别不能为空");
      return ;
    }
    this.checkText(this.data.whereValue+this.data.typeValue+this.data.descriptionValue).then(res=>{
      console.log("成功了",res);
      if(res.data){
        this.updateImageToDB()
        return ;
      }
      myToast(res.message,"error")
    }).catch(err=>{
      console.log("失败了",err)
    })
  },
  // 上传图片
  updateImageToDB(){
    wx.uploadFile({
      url: 'https://singlestep.cn/wejinda/uploadimg?type=lost',
      filePath: this.data.temporaryLink,
      name: 'file',
      success:res1=> {
        console.log("ressss----->0",res1)
        const res = JSON.parse(res1.data)
        console.log("ressss----->1",res.data)
        this.updateInfos(res.data)
      }
    })
  },
  // 上传信息
  updateInfos(filePath) {
    let data ={
      "userID": this.data.openid, 
      "lostID": "", 
      "type": this.data.typeThingValue,
      "userContact": "10086", 
      "userImage": "", 
      "userNickName": "",
      "pickupTime": this.data.whenValue, 
      "pickupLocation": this.data.whereValue, 
      "shortDesc": this.data.typeValue, 
      "describe": this.data.descriptionValue, 
      "fileUrl": filePath, 
      "upLoadTime": "", 
      "checkID": "",
      "checkState": "",
      "city": "" 
    }
    let swzlMySends =[];
    data.checkState="审核中"
     myGetStorger(storagename.swzlMySends).then(res=>{
       console.log("获取到本地数据",res)
       swzlMySends=res.data
       swzlMySends=[...swzlMySends,data];
     }).catch(err=>{
       console.log("shibai le ",err);
       swzlMySends=[data];
     })
     
    
    myRequest("addlostfound", data,"POST").then(res=>{
      console.log("上传成功",res)
      myToast(res.data)
      
      setTimeout(()=>{
        mySetStorage(storagename.swzlMySends,swzlMySends)
        wx.navigateBack({
          delta: 1,
        })
      },2000)
    }).catch(err=>{
      console.log("shibai le ",err)
      myToast("出错了~","error")
    })
  },
  onLoad(e){
    console.log(e)
    this.setData({
      openid:e.openid,
      
    })
  },
  onShow(e){
    console.log("-------------------onshow")
    this.setData({
      temporaryLink:getApp().globalData.imgSrc
    })
  },
  onUnload(){
    getApp().globalData.imgSrc="";
    myGetStorger()
  }
})