
import {getResourceUrl} from "../../utils/useHandle.js"
// 轮播图资源配置
const swiperList = [{
  imageUrl: getResourceUrl("resource/img/swapper_1.png")
}, {
  imageUrl: getResourceUrl("resource/img/swapper_2.png")
}, {
  imageUrl: getResourceUrl("resource/img/swapper_3.png")
}]


//导航bar配置

const navBars =  [{
  imgUrl: "../../static/public/jww.png",
  path:"/jww/jww",
  title: "教务网"
},
{
  imgUrl: "../../static/public/tsg.png",
  path:"/tsg/tsg",
  title: "图书馆"
}, {
  imgUrl: "../../static/public/ykt.png",
  path:"/ykt/ykt",
  title: "一卡通"
},{
  imgUrl: "../../static/public/photo.png",
  path:"/compusBaseService/compusBaseService",
  title: "掌上服务"
}, {
  imgUrl: "../../static/public/xzcs.png",
  path:"/enroll/enroll",
  title: "录取查询"
}, {
  imgUrl: "../../static/public/kd.png",
  path:"/LostAndFont/LostAndFont",
  title: "失物招领"
}
]




module.exports = {
  swiperList,navBars
}