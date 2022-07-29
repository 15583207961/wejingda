
// app.js
App({
  onLaunch() {

  },
  globalData: {
    // userInfo: null,
    UserInfo:{
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
    quitLoginFlag:{
      jww:false,
      ykt:false,
      tsg:false
    }
  }
})
