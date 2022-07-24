Page({
  data:{
    id:0
  },

  hanlde(e) {
    this.setData({
      id: e.currentTarget.dataset.id
    })
   
  },
})