 //从本地获取数据


 const InfoGetStroage=(key,cb)=>{
        wx.getStorage({
                key:key,
                success:res=>{
                    cb(res.data);
                },
                fail:err=>{
                    cb(-1)
                }
            })
        }

const InfoSetStorage=(key,data)=>{
    wx.setStorage({
        key:key,
        data:data,
        success:res=>{
          
        },
        fail:err=>{
         
        }
    })
}
        module.exports = {
            InfoGetStroage,
            InfoSetStorage
          }