const { InfoGetStroage,InfoSetStorage } = require("../../utils/OInfoStroage")

Page({
    data:{
        isSave:true,
        isshow:false,
        firstvalue:'',
        update:""
    },
    // 操作云端数据保存
    handle_switch(){
       if(this.data.isSave){
        wx.showModal({
            title:"取消云备份",
            content:"点击确认后所有数据将会被清除",
            success:res=>{
                if(res.confirm){
                  // 删除备份数据
                  this.setData({
                      isSave:false
                  })
                //   退出当前页面
                wx.showLoading({
                  title: '数据清除中...',
                })
                setTimeout(() => {
                  wx.hideLoading()
                  wx.showToast({
                    title: '清除成功',
                  })
                  wx.clearStorage({
                    success: (res) => {
                      wx.switchTab({ 
                        url: '../../page/porfile/porfile',
                      })
                    },
                  })
                }, 1000);
                
                }
            }
          })
       }else{
           wx.showLoading({
             title: '数据备份中..',
           })
        //    
       }
    },
    //获取本地数据
    get_storage_data(){
        // 获取openId
        InfoGetStroage("openId",data=>{

        })
        // 获取教务网密码
        InfoGetStroage("jwwInfo",data=>{

        })
        // 获取图书密码
        InfoGetStroage("tsgInfo",data=>{

        })
        // 获取一卡通账户密码
        InfoGetStroage("yktInfo",data=>{
            
        })
    },
    // 修改第一下次绑定账号
    handle_update(){
      this.setData({
        isshow:true
      })
    },
     // 获取输入数据
     getdata(e){
      console.log(e.detail.value)
      this.setData({
          update:e.detail.value.trim()
      })
  },
  // 点击确认弹框
  tap_ok(){
      if(this.data.update == ""){
          wx.showToast({
            title: '请输入账号',
            icon:'none'
          })
          return
      }
      wx.showModal({
        title:"确认输入",
        content:`确认账号：${this.data.update} 是本人账号`,
        success:res=>{
            if(res.confirm){
              wx.showToast({
                title: '修改成功',
              })
              this.setData({
                firstvalue:this.data.update,
                isshow:false
              })
            InfoSetStorage("firstvalue",this.data.update)
            }
        }
      })
  },
  onShow(){
      InfoGetStroage("firstvalue",data=>{
        this.setData({
          firstvalue:data
        })
      })
  },
  // 点击取消
  tap_no(){
    this.setData({
      isshow:false
    })
  },

  // 
  handleAbout(){
    wx.navigateTo({
      url: "../../page/about/about",
    })
  }
  
})
