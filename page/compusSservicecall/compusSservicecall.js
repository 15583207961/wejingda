Page({
  data:{
    id:0
  },
  // 店电话
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  hanlde(e){
    this.setData({
      id:e.currentTarget.dataset.id
    })
  }
})