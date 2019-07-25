;
(function() {
    'use strict';
    var that;
    var uploader;

    var JAliyunUpload = function(ele, opt) {
        that = this;
        that.$element = ele;
        that.default = {

        };
        that.options = $.extend({}, that.default, opt);
    };

    JAliyunUpload.prototype = {
        init: function() {
            that.suitIE();
            that.bindEvent();
        },
        bindEvent: function() {
            that.$element.on('change', function(e) {
                var file = e.target.files[0]
                if (!file) {
                    alert("请先选择需要上传的文件!")
                    return;
                }
                var userData = '{"Vod":{}}'
                if (uploader) {
                    uploader.stopUpload();
                }
                that.initAliyunUpload();
                // 首先调用 uploader.addFile(event.target.files[i], null, null, null, userData)              
                uploader.addFile(file, null, null, null, userData);
            })
        },
        //兼容IE11
        suitIE: function() {
            if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function(fileData) {
                    var binary = "";
                    var pt = this;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var bytes = new Uint8Array(reader.result);
                        var length = bytes.byteLength;
                        for (var i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        //pt.result  - readonly so assign binary
                        pt.content = binary;
                        pt.onload()
                    }
                    reader.readAsArrayBuffer(fileData);
                }
            }
        },
        //初始化阿里云上传器
        initAliyunUpload: function() {
            var userId = that.getAliId();
            uploader = new AliyunUpload.Vod({
                //阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
                userId: userId,
                //分片大小默认1M，不能小于100K              
                partSize: 1048576,
                //并行上传分片个数，默认5
                parallel: 5,
                //网络原因失败时，重新上传次数，默认为3
                retryCount: 3,
                //网络原因失败时，重新上传间隔时间，默认为2秒
                retryDuration: 2,
                // 开始上传
                'onUploadstarted': function(uploadInfo) {
                    console.log(uploadInfo);
                    //上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，
                    //如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
                    var data;
                    if (uploadInfo.videoId) {
                        // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
                        data = that.refreshUploadVideo();
                    } else {
                        // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
                        data = that.getUploadVideo();
                    }
                    //从点播服务获取的uploadAuth、uploadAddress和videoId,设置到SDK里
                    uploader.setUploadAuthAndAddress(uploadInfo, data.UploadAuth, data.UploadAddress, data.VideoId);
                },
                // 文件上传成功
                'onUploadSucceed': function(uploadInfo) {
                    console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint +
                        ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object + ",videoId:" + uploadInfo.videoId);
                },
                // 文件上传失败
                'onUploadFailed': function(uploadInfo, code, message) {
                    console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
                },
                // 文件上传进度，单位：字节
                'onUploadProgress': function(uploadInfo, totalSize, loadedPercent) {
                    console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
                },
                // 上传凭证超时
                'onUploadTokenExpired': function(uploadInfo) {
                    console.log("onUploadTokenExpired");
                    //实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
                    //https://help.aliyun.com/document_detail/55408.html
                    //从点播服务刷新的uploadAuth,设置到SDK里   
                    var data = that.refreshUploadVideo();
                    uploader.resumeUploadWithAuth(data.UploadAuth);
                },
                //全部文件上传结束
                'onUploadEnd': function(uploadInfo) {
                    console.log("onUploadEnd: uploaded all the files");
                }
            });
        },
        //获得阿里ID
        getAliId: function() {
            let aliId = '';
            $.ajax({
                url: '/api/aliVod/getAliId',
                type: 'get',
                async: false,
                success: function(data) {
                    if (data.status == 200) {
                        aliId = data.res;
                    }
                }
            });
            return aliId;
        },
        //获取视频上传地址和凭证
        getUploadVideo: function() {
            let res = '';
            var filename = uploader._uploadList[0].file.name;
            var title = filename.split('.')[0];
            $.ajax({
                url: '/api/aliVod/getUploadVideo',
                type: 'get',
                async: false,
                data: {
                    title: title,
                    fileName: filename
                },
                success: function(data) {
                    if (data.status == 200) {
                        res = data.res;
                    }
                }
            });
            return res;
        },
        //刷新视频上传凭证
        refreshUploadVideo: function() {
            let res = '';
            var videoId = uploader.videoId;
            $.ajax({
                url: '/api/aliVod/refreshUploadVideo',
                type: 'get',
                async: false,
                data: {
                    videoId: videoId
                },
                success: function(data) {
                    if (data.status == 200) {
                        res = data.res;
                    }
                }
            });
            return res;
        },
        //开始上传
        startUpload: function() {
            if (uploader !== null) {
                uploader.startUpload();
            }
        },
        //暂停上传
        stopUpload: function() {
            if (uploader !== null) {
                uploader.stopUpload();
            }
        }
    };

    var allowedMethods = ['startUpload', 'stopUpload'];

    $.fn.jAliyunUpload = function(options) {

        var jAliyunUpload = new JAliyunUpload(this, options),
            args = Array.prototype.slice.call(arguments, 1);

        if (typeof options == 'string') {
            if ($.inArray(options, allowedMethods) < 0) {
                throw new Error("Unknown method: " + options);
            }
            return jAliyunUpload[options].apply(this, args);
        } else if (typeof options === 'object' || !options) {
            return jAliyunUpload.init();
        }
    };

})();