
// app.js
App({
  onLaunch() {

  },
  globalData: {
    // userInfo: null,
    UserInfo:{ //临时登录的账号密码信息
      jwwInfo:{
        jwwPwd:"",
        jwwSno:"",
        studentName:""
      },
      yktInfo:{
        yktpwd:"",
        yktSno:"",
        state:""
      }
    },
    quitLoginFlag:{ //退出登录标记
      jww:false,
      ykt:false,
      tsg:false
    },
    modifityFlag:true,//标记校园电话是否发生了变化
    baseArticles:null,//基本的微信文章
    swzlDataInfo:null,//存放已经出现的失物招领信息
    page:0,//失物招领偏移量
  }
})
