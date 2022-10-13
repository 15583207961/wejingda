import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage,
  myRedirectTo,
  myNavBarHieght
} from "../../utils/usePackegeSysFun.js";
import { storagename } from "../../config/storageNameconfig.js";
Page({
  data: {
    curIndex: -1,
    introduce:false,
    titleTop:0,
    titleHeight:0,
    topHeight:0,
    showModal:false,
    appearcloseAnima:false,
    list:[],
    page:0,
    noMore:false
  },
onLoad(){
this.getLocalDate();
this.getInterestedQGroup(this.data.page)
},
goback(){
  wx.navigateBack({
    delta: 1,
  })
},
    // 获取本地数据
    getLocalDate(){
      // 获取手机系统信息
      myGetStorger(storagename.systemInfo).then(res=>{
        console.log("获取到的数据",res.data)
        this.setData({
          titleTop:res.data.menuTop,
          titleHeight:res.data.menuHeight,
          topHeight:res.data.menuBottom+32
        })
      })
    
    },

  cancel(){
    this.setData({
      appearcloseAnima:true
    })
    setTimeout(()=>{
      this.setData({
        showModal:false,
        appearcloseAnima:false
      })
    },190)
  },
  // goDetail
  goDetail(e){
    console.log("e",e)
    const index  = e.currentTarget.dataset.index;
    console.log("index--->",index)
    this.setData({
      showModal:true,
      modalData:this.data.list[index],
      modalIndex:index
    })
},

getInterestedQGroup(page){
    myRequest("getInterestedQGroup?page="+page).then(res=>{
      console.log("获取到的数据",res)
      let list = this.data.list;
      if(!res.data?.length){
        this.setData({
          noMore:true
        })
        return ;
      }
      if(res.code === 200){
        this.setData({
          list:list.concat(res.data),
          page:this.data.page+1
        })
      }
    }).catch(err=>{
      console.log("err",err)
    })
},
// copy
copy(e){
  console.log("e",e)
  const value = e.currentTarget.dataset.value
  wx.setClipboardData( {
    data: value,
    success:res=>{
        myToast(`QQ群号${value}复制成功`)
        console.log("成功了复制")
        setTimeout(()=>{
          this.setData({
            appearcloseAnima:true
          })
          setTimeout(()=>{
            this.setData({
              showModal:false,
              appearcloseAnima:false
            })
          },190)
        },2000)
    },
    fail:err=>{
      console.log("失败了",err)
    }
  }
)
},
onReachBottom(){
  
  !this.data.noMore&&this.getInterestedQGroup(this.data.page)
}
})