
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
  }
})
