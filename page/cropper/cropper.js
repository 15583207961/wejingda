//获取应用实例
const app = getApp()
Page({
    data: {
        src: '',
        width: 300, //宽度
        height: 300, //高度
        max_width: 300,
        max_height: 400,
    },
    onLoad: function (options) {
            this.cropper = this.selectComponent("#image-cropper");
            this.setData({
                src: options.imgSrc
            });
            if(!options.imgSrc){
                this.cropper.upload(); //上传图片
            }
        },
        cropperload(e) {
            console.log('cropper加载完成');
        },
        loadimage(e) {
            wx.hideLoading();
            console.log('图片');
            this.cropper.imgReset();
        },
        clickcut(e) {
            console.log(e.detail);
            //图片预览
            wx.previewImage({
                current: e.detail.url, // 当前显示图片的http链接
                urls: [e.detail.url] // 需要预览的图片http链接列表
            })
        },
        upload() {
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    wx.showLoading({
                        title: '加载中',
                    })
                    const tempFilePaths = res.tempFilePaths[0];
                    //重置图片角度、缩放、位置
                    that.cropper.imgReset();
                    that.setData({
                        src: tempFilePaths
                    });
                }
            })
        },


 


   
        
        switchChangeDisableWidth(e) {
            this.setData({
                disable_width: e.detail.value
            });
        },
       
        submit() {
            this.cropper.getImg((obj) => {
                app.globalData.imgSrc = obj.url;
                wx.navigateBack({
                    delta: -1,
                })
            });
        },
       
})