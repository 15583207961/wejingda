import {myToast,myNavigatorTo,myRequest} from "../../utils/usePackegeSysFun";
import {encodeURIComponentUrl} from "../../utils/useHandle";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:{
      type:Array,
      value:[]
    },
    check:{
      type:Boolean,
      value:false
    },
    openid:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    radioValue:null,
    id:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    more(e){
      console.log(e)
      this.setData({
        curIndex:e.currentTarget.dataset.index,
        clsname:"show option"
      })
    },
    cancle(){
      this.setData({
        clsname:"hide option"
      })
      setTimeout(()=>{
        this.setData({
          curIndex:-1,
          clsname:"option"
        })
      },200)
    },
    jump(e){
      myNavigatorTo("/webview/webview?src="+encodeURIComponentUrl(e.currentTarget.dataset.index))
    },
    connect(e){
      console.log(e)
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.index,
      })
    },
    change(e){
      console.log(e)
      this.setData({
        radioValue:e.detail.value
      })
    },
    submit(e){
      console.log("e",e)
      let index =e.currentTarget.dataset.index
      let id = this.properties.listData[index].id
     
      console.log("openid",this.properties.openid)
      if(this.data.radioValue != null){
        wx.showModal({
          title:"提醒",
          content:`确认${this.data.radioValue==0?"不通过":"通过"}${this.properties.listData[index].companyName}的招聘信息`,
          success:res=>{
            if(res.confirm){
              myRequest(`updateWorkStudy?id=${id}&openid=${this.properties.openid}&state=${+this.data.radioValue}`).then(res=>{
                console.log("修改成功",res)
                if(res.code==200){
                  let list = this.properties.listData
                  list.splice(index,1)
                  this.setData({
                    radioValue:null,
                    listData:list
                  })
                  
                }else{
                  myToast(res.message)
                }
              }).catch(err=>{
                console.log("err",err)
              })
            }
          }
        })
       
      }
      else{
        myToast("未选择是否通过")
      }
    },
    copy(e){
      console.log(e.currentTarget.dataset.value)

      wx.setClipboardData( {
        data: e.currentTarget.dataset.value,
        success:res=>{
          console.log("复制成功")
          myToast("复制成功");
        }
      })
    }
  }
})
