import { controller, get, post, provide, inject, config } from 'midway';
import * as _ from 'lodash';

/**
 * @controller aliVod 阿里云视频接口
 */
@provide()
@controller('/api/aliVod/', { middleware: ['errorHandlerMiddleware', 'checkTokenMiddleware'] })
export default class AliVodController {
    @inject('aliVodHelper')
    aliVodHelper;

    @config('aliSdk')
    aliSdkConfig;


    /**
    * @summary 获取阿里ID
    * @description 获取阿里ID
    * @router get /api/aliVod/getAliId    
    * @apikey 
    */
    @get('/getAliId')
    async getAliId(ctx) {
        ctx.body = ctx.helper.success(this.aliSdkConfig.aliId);
    }


    /**
    * @summary 获取阿里直播地址
    * @description 获取阿里直播地址
    * @router get /api/aliVod/getLiveVodUrl    
    * @request query string duration 持续时间
    * @request query string appName 任意字符串
    * @request query string streamName 任意字符串
    * @apikey 
    */
    @get('/getLiveVodUrl')
    async getLiveVodUrl(ctx) {
        let duration = ctx.query.duration;
        let appName = ctx.query.appName;
        let streamName = ctx.query.streamName;
        let res = await this.aliVodHelper.createLiveVodUrl(duration, appName, streamName);
        ctx.body = ctx.helper.success(res);
    }

    /**
     * 获取视频上传地址和凭证
     * @param ctx 
     */
    @get('/getUploadVideo')
    async getUploadVideo(ctx) {
        let title = ctx.query.title;
        let fileName = ctx.query.fileName;
        let res = await this.aliVodHelper.createUploadVideo(title, fileName);
        ctx.body = ctx.helper.success(res);
    }

    /**
     * 刷新视频上传凭证
     * @param ctx 
     */
    @get('/refreshUploadVideo')
    async refreshUploadVideo(ctx) {
        let videoId = ctx.query.videoId;
        let res = await this.aliVodHelper.refreshUploadVideo(videoId);
        ctx.body = ctx.helper.success(res);
    }

    /**
     * 获取视频播放凭证
     * @param ctx 
     */
    @get('/getVideoPlayAuth')
    async getVideoPlayAuth(ctx) {
        let videoId = ctx.query.videoId;
        let res = await this.aliVodHelper.getVideoPlayAuth(videoId);
        ctx.body = ctx.helper.success(res);
    }

    /**
     * 删除视频
     * @param ctx 
     */
    @post('/deleteVideo')
    async deleteVideo(ctx) {
        let videoIds = ctx.request.body.videoIds;
        let res = await this.aliVodHelper.deleteVideo(videoIds);
        ctx.body = ctx.helper.success(res);
    }
}