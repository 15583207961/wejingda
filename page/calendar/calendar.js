import {getResourceUrl} from "../../utils/useHandle"


Page({
	data: {  
       imgalist:[getResourceUrl("resource/img/schoolcalendar_1.png"),getResourceUrl("resource/img/schoolcalendar_2.png")]
    },
	/** 
	 * 预览图片
	 */
	previewImage: function (e) {  
		var current=e.target.dataset.src;
		wx.previewImage({
		  	current: current, // 当前显示图片的http链接
		  	urls: this.data.imgalist // 需要预览的图片http链接列表
		})
	}  
})