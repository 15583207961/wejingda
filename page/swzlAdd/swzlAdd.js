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
})