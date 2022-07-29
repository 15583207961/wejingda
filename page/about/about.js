
import { BaseRequestUrl } from "../../config/baseConfig.js";
import {
  myNavigatorTo,
  myGetStorger,
  myRequest,
  myToast,
  mySetStorage,
  myRemoveStorage
} from "../../utils/usePackegeSysFun.js";
Page({
  data:{
    src:"",
  },
  goWebView(e){
    var src =e.currentTarget.dataset.type ==="policy"? BaseRequestUrl+"resource/privacy/service.html": BaseRequestUrl+"/resource/privacy/private.html"
    console.log(src)
    myNavigatorTo(`/webview/webview?src=${src}`)
  }
})