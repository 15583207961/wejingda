import {getResourceUrl} from "./useHandle.js"


  //封装wxtoast
  const  myToast = (title, icon = "none") =>{
    wx.showToast({
      title: title,
      icon: icon
    })
  }

  // 封装wx Loading
   const myShowLoading = (title) =>{
    wx.showLoading({
      title: title
    })
  }

  // 封装wx request

   const myRequest = (url, data = {}, method = "GET") => {
     myShowLoading("请求中...")
    return new Promise((res, rej) => {
      wx.request({
        url: getResourceUrl(url),
        data: data || {},
        method: method,
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

module.exports = {
  myGetStorger,mySetStorage,myRequest,myShowLoading,myToast,myNavigatorTo,myRemoveStorage,myRedirectTo,myModal
}