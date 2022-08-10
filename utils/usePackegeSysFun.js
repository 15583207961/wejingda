import {getResourceUrl} from "./useHandle.js"


  //封装wxtoast
  const  myToast = (title, icon = "none") =>{
    wx.showToast({
      title: title,
      icon: icon,
      mask:true
    })
  }

  // 封装wx Loading
   const myShowLoading = (title) =>{
    wx.showLoading({
      title: title,
      mask:true
    })
  }

  // 封装wx request

   const myRequest = (url, data = {}, method = "GET",isshowLoading=true,header) => {
    isshowLoading&&myShowLoading("请求中...")
    return new Promise((res, rej) => {
      wx.request({
        url: getResourceUrl(url),
        data: data || {},
        method: method,
        header:header,
        success: (data) => {
          res(data.data);
          wx.hideLoading()
        },
        fail: err => {
          rej(err)
          wx.hideLoading();
          // myToast("网络链接异常，请稍后重试~")
        }
      })
    })
  }

  //封装wx setStorger
   const  mySetStorage = (key,data) =>{
    return new Promise((res,rej)=>{
      wx.setStorage({
        key,
        data,
        success:data=>{
          res(data);
        },
        fail:err=>{
          rej(err)
        }
      })
    })
  }

  // 封装wx getStorger
   const   myGetStorger =(key)=>{
     return new Promise((res,rej)=>{
      wx.getStorage({
        key:key,
        success:data=>{
          res(data)
        },
        fail:err=>{
          rej(err)
        }
      })
     })
  }

  // 封装wx的页面跳转
  const myNavigatorTo=(url)=>{
     return new Promise((res,rej)=>{
      wx.navigateTo({
        url: '../../page'+url,
        success:data=>{
            res(data);
        },
        fail:err=>{
          rej(err)
        }
      })
     })
  }

  // 封装清除本地数据
  const myRemoveStorage=(key)=>{
    wx.removeStorage({
      key: key,
      success: res => {
        console.log("执行了")
      }
    })
  }

  // 封装wx.refirectTo
  const myRedirectTo = (url)=>{
    new Promise((res,rej)=>{
      wx.redirectTo({
        url: '../../page/'+url,
        success:data=>{
          res(data)
        },
        fail:err=>{
          rej(err);
        }
      })
    })
  }
// 封装Modal
  const myModal = (title,content)=>{
    return new Promise((resovle,rej)=>{
      wx.showModal({
        title:title,
        content:content,
        success:res=>{
          resovle(res)
        },
        fail:err=>{
          rej(err)
        }
      })
    })
  }

  const mySystemInfo = (multiple = 2)=>{
    return new Promise((resolve,rej)=>{
      wx.getSystemInfo({
        success: (result) => {
          var menu =  wx.getMenuButtonBoundingClientRect()
          console.log("result=======>result",result)
          console.log("result=======>menuHeight",menu)
          // 不想实现,后面实现......
          var data = {
            // 胶囊信息
            menuHeight:menu.height*multiple, //高
            menuWidth:menu.width*multiple, //宽
            menuTop:menu.top*multiple,//胶囊距离顶部的位置
            menuLeft:menu.left*multiple,//胶囊距离左边的位置
            menuRight:menu.right*multiple,//胶囊距离右边的位置
            menuBottom:menu.bottom*multiple,//胶囊底部距离顶部的位置
  
            // 手机信息
            devicePixelRatio:result.devicePixelRatio,//像素比
            model:result.model,//手机型号
            safeAreaBottom:result.safeArea.bottom*multiple,
            safeAreaTop:result.safeArea.top*multiple,
            safeAreaTight:result.safeArea.right*multiple,
            safeAreaLeft:result.safeArea.left*multiple,
            safeAreaHeight:result.safeArea.height*multiple,
            safeAreaWidth:result.safeArea.width*multiple,
            screenWidth:result.screenWidth*multiple,
            screenHeight:result.screenHeight*multiple,
            windowHeight:result.windowHeight*multiple,
            windowWidth:result.windowWidth*multiple
          }
          resolve(data)
        },
        fail:err=>{
          console.log("系统信息获取失败了~")
          rej(err)
        }
      })
    })
  
  }

  // 分装微信预览图片
  const myPreviewInfos = (sources,current=0,showmenu=true) => {
    return new Promise((resovle,rej)=>{
      wx.previewMedia({
        sources: sources,
        current:current,
        showmenu:showmenu,
        success:res=>{
          resovle(res)
        },
        fail:err=>{
          rej(err)
        }
      })
    })
  }

module.exports = {
  myGetStorger,mySetStorage,myRequest,myShowLoading,myToast,myPreviewInfos,myNavigatorTo,myRemoveStorage,myRedirectTo,myModal,mySystemInfo
}