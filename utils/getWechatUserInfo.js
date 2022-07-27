

import {
  myRequest,
  mySetStorage,
} from "./usePackegeSysFun.js"

const getWechatUserInfo = (charId) => {
  var date = new Date()
  var time = date.getMonth() + 1 + "年" + date.getDate() + "日 " + date.getHours() + ":" + date.getMinutes()
  console.log("charId", charId)

  myRequest(`getwechatuserinfo?openID=${charId}`, {}, "POST").
  then(res => {
    console.log("res==>", res);
    const {
      chatID,
      jwwPass,
      openID,
      studentID,
      tsgPass,
      yktPass
    } = res;
    jwwPass && mySetStorage("jwwInfo", { jwwSno: studentID, jwwPwd: jwwPass, studentName: "" })
    tsgPass && mySetStorage("tsgInfo", {
      tsgSno: studentID,
      tsgPwd: tsgPass
    })
    yktPass && mySetStorage("yktInfo", {
      yktpwd: yktPass,
      yktSno: studentID
    })

  }).catch(err=>{
    console.log("res",err)
  })


}

module.exports = {
  getWechatUserInfo
}