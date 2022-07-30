
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
    appId: "wx8abaf00ee8c3202e",
    extraData : {
        id : "419686",
        customData : {
            clientInfo: `iPhone OS 10.3.1 / 3.2.0.43 / 0`,
        }
    },
  },
  goWebView(e){
    var src =e.currentTarget.dataset.type ==="policy"? BaseRequestUrl+"resource/privacy/service.html": BaseRequestUrl+"/resource/privacy/private.html"
    console.log(src)
    myNavigatorTo(`/webview/webview?src=${src}`)
  }
})