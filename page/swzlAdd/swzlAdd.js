import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
Page({
  data:{
    WhereArr:[
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
    typeArr:[
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
    whereValue:"",//地点显示信息
    whenValue:"",//显示时间信息
    typeValue:"",//类型信息
    descriptionValue:"",//描述信息
  },
  // takePhoto
  takePhoto(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success :res=> {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        this.compressImage(tempFilePaths[0],(data)=>{
          console.log("datta==>",data)
          wx.uploadFile({
            url: 'https://singlestep.cn/wejinda/file', 
            filePath: data,
            name: 'file',
            success (res){
              const data = res.data
              console.log("ressss----->",data)
            }
          })
        })
      }
    })
  },
  //canvas 压缩
  compressImage(path, callback) {
    wx.getImageInfo({
      src: path,
      success: res=> {
        var ctx = wx.createCanvasContext('photo_canvas'); // 创建画布
        var towidth = 500;  //设置canvas尺寸，按宽度500px的比例压缩
        var toheight = Math.trunc(500*res.height/res.width);  //根据图片比例换算出图片高度
        this.setData({ canvasHeight: toheight });
        ctx.drawImage(path, 0, 0, res.width, res.height, 0, 0, towidth, toheight);
        ctx.draw(false, function () {
          wx.canvasToTempFilePath({
            canvasId: 'photo_canvas',
            fileType:"jpg",
            quality: 0.8, // 注意你的压缩质量，卤煮真的压缩出20KB的，图片整个都是糊的
            success: res2=> {
              console.log(res2.tempFilePath);
              callback(res2.tempFilePath);
            }
          }, this)
        })
      }
    });
  },
  //地点下来选择方式
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      whereValue:this.data.WhereArr[e.detail.value]
    })
  },
  //地点获取方式，用户输入
  inputWhere(e){
    console.log("e",e)
    let  value = e.detail.value
    this.setData({
      whereValue:value.trim()
    })
  },

  // 获取时间
  bindDateChange(e){
    console.log(e)
    this.setData({
      whenValue:e.detail.value
    })
  },
  // 获取输入的类型
  inputWhereType(e){
    let  value = e.detail.value
    this.setData({
      typeValue:value.trim()
    })
  },
  bindPickerChangeType(e){
    this.setData({
      typeValue:this.data.typeArr[e.detail.value]
    })
  },
  //getDescription获取描述
  getDescription(e){
    let value = e.detail.value.trim()
    if(this.data.descriptionValue.length>100){
      console.log("jahuahuagu")
      return;
    }
    this.setData({
      descriptionValue:value
    })
  },
  // 发送
  submit(){
   if(!this.data.WhereArr){
     myToast("点的信息不能为空");
     return ;
   }
   if(!this.data.whenValue){
     myToast("时间信息不能为空");
     return ;
   }
   if(!this.data.typeValue){
     myToast("类型选择不能为空");
     return ;
   }
   if(this.data.descriptionValue.length>100){
     myToast("描述类容超出限制~")
   }
  }
})