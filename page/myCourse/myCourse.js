import { getResourceUrl } from "../../utils/useHandle";
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
  data:{
    id:0,
    deleteUrl:getResourceUrl("resource/img/icon_del.png"),
    openid:null,
    applyPage:0,
    createPage:0,
    createNoMore:false,
    applyNomore:false,
    applyList:null,//报名课程列表
    createList:null,//开办的课程列表
  },
  onLoad(){
  this.getLocalData()
  },
  // 页面启动获取本地数据
  getLocalData(){
    myGetStorger(storagename.openId).then(res=>{
      console.log("获取本地数据成功");
      this.setData({
        openid:res.data
      })
      this.getMyApplyCourse(this.data.applyPage,res.data);
    }).catch(err=>{
      console.log("获取失败了--------->",err);
    })
  },
  hanlde(e){

    const id =e.currentTarget.dataset.id
    this.setData({
      id:id
    })
    if(!this.data.openid){
      return;
    }
    if(id==0){
      !this.data.applyList&&this.getMyApplyCourse(0,this.data.openid)
    }else{
      !this.data.createList&&this.getMyCreateCourse(0,this.data.openid)
    }
  },
  // 下拉触底事件
  // onReachBottom(){
  //   if(this.data.id==0&&!this.data.applyNomore){
  //     this.getMyApplyCourse(this.data.applyPage,this.data.openid);
  //   }else if(!this.data.createNoMore){
  //     this.getMyCreateCourse(this.data.createPage,this.data.openid)
  //   }
  // },
  // 获取我的报名课堂
  getMyApplyCourse(page,openid){
    myRequest(`GetOpenCourseInformation?page=${page}&openid=${openid}&type=apply`).then(res=>{
      console.log("获取成功res----------->1,",res);
      if(res.data?.length){
        this.setData({
          applyList:res.data,
          applyPage:this.data.applyPage+1
        })
      }else{
        myToast("没有更多数据了")
        this.setData({
          applyNomore:true
        })
      }
     
    }).catch(err=>{
      console.log("失败了------>1,",err)
    })
  },
  // 获取我开办的课程
  getMyCreateCourse(page,openid){
    myRequest(`GetOpenCourseInformation?page=${page}&openid=${openid}&type=create`).then(res=>{
      console.log("获取成功我开办的课程------》1",res)
      if(res.data?.length){
        this.setData({
          createList:res.data,
          createPage:this.data.createPage+1
        })
      }else{
        myToast("没有更多数据了")
        this.setData({
          createNoMore:true
        })
      }
     
    }).catch(err=>{
      console.log("获取失败-----》2",err)
    })
  },
  // deleteApply
  deleteApply(e){
    console.log("点击了~~~")
    const index = e.currentTarget.dataset.index;
    let courseData;
    let content;
    let id = this.data.id
    if(id==0){
      courseData = this.data.applyList[index]
      content = courseData.ended?"删除"+courseData.className+"课程记录":"取消"+courseData.className+"课程报名"
    }
    else{
      courseData = this.data.createList[index];
      console.log("fghj6789")
      content = "删除"+courseData.className+"课程"
    } 
    wx.showModal({
        title:"提示",
        content:content,
        success:res=>{
          console.log("操作做成功",res);
          if(res.confirm&&id==0){
            console.log("执行了-----")
            this.deleteApplyCourse(courseData.classId,this.data.openid,index)
          }else if(res.confirm && id ==1){
            this.deleteCreate(index)
          }
          // 开办
        }
        })
    console.log(e)
  },
  // 取消报名操作
  deleteApplyCourse(classId,openid,index){
    myRequest(`ApplyClasses?classId=${classId}&openid=${openid}&type=delete`).then(res=>{
      console.log("取消报名成功",res);
      if(res.code==200){

        let list = this.data.applyList;
        list.splice(index,1)
        this.setData({
          applyList:list
        })
      }
    })
  },
  // deleteCreate
  deleteCreate(index){
    
    console.log("457678oopoiu65")
    this.data.openid && myRequest(`DeleteApplyCourse?openid=${this.data.openid}&classId=${this.data.createList[index].classId}`).then(res=>{
      console.log("删除自己创建的课程成功",res);
      let list = this.data.createList;
      list.splice(index,1);
      if(res.code == 200){
        this.setData({
          createList:list
        })
      }
    }).catch(err=>{
      console.log("删除失败了",err)
    })
  },
  // update
  update(e){
    const index = e.currentTarget.dataset.index;
    console.log("index",index)
    console.log(this.data.createList)
    myNavigatorTo("/applyCourse/applyCourse?data="+JSON.stringify(this.data.createList[index]))
  }
})