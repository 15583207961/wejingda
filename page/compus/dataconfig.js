
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
  imgUrl: getResourceUrl("resource/img/icon_jww.png"),
  path:"/jww/jww",
  title: "教务网"
},
{
  imgUrl:getResourceUrl("resource/img/icon_tsg.png"),
  path:"/tsg/tsg",
  title: "图书馆"
}, {
  imgUrl: getResourceUrl("resource/img/icon_ykt.png"),
  path:"/ykt/ykt",
  title: "一卡通"
},{
  imgUrl: getResourceUrl("resource/img/icon_xyfw.png"),
  path:"/compusBaseService/compusBaseService",
  title: "校园服务"
}, {
  imgUrl: getResourceUrl("resource/img/icon_lqcx.png"),
  path:"/enroll/enroll",
  title: "录取查询"
}
, {
  imgUrl: getResourceUrl("resource/img/icon_swzl.png"),
  path:"/LostAndFont/LostAndFont",
  title: "失物招领"
},
 {
  imgUrl: getResourceUrl("resource/img/icon_yywx.png"),
  path:"/confessionWall/confessionWall",
  title: "表白墙"
}
]




module.exports = {
  swiperList,navBars
}