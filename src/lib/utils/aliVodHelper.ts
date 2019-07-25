import { provide, config } from 'midway';
import * as moment from 'moment';
import * as md5 from 'md5-node';
import * as RPCClient from '@alicloud/pop-core'

@provide('aliVodHelper')
export class aliVodHelper {
    @config('aliVod')
    aliVodConfig;

    @config('aliSdk')
    aliSdkConfig;

    /**
     * 阿里云直播鉴权
     */
    async createLiveVodUrl(duration, appName, streamName): Promise<any> {
        let timestamp = moment().add(duration, 'minutes').unix();
        // console.log(timestamp1)
        // let timestamp=1561254810;
        let rand = 0;
        let uid = 0;
        let pushKey = this.aliVodConfig.pushKey;//Qdok8F7dZx
        let pullkey = this.aliVodConfig.pullKey;//d3hWoPivyq
        let pullDomain = this.aliVodConfig.pullDomain;//bo.hzzhsq.com
        let pushDomain = this.aliVodConfig.pushDomain;//tui.hzzhsq.com
        let sstring = `/${appName}/${streamName}-${timestamp}-${rand}-${uid}-${pushKey}`;
        let hashvalue = md5(sstring);

        let obsUrl = `rtmp://${pushDomain}/${appName}/`;
        let obsKey = `${streamName}?auth_key=${timestamp}-${rand}-${uid}-${hashvalue}`;
        let rtmpPlayer = `/${appName}/${streamName}-${timestamp}-${rand}-${uid}-${pullkey}`;
        let flvPlayer = `/${appName}/${streamName}.flv-${timestamp}-${rand}-${uid}-${pullkey}`;
        let m3u8Player = `/${appName}/${streamName}.m3u8-${timestamp}-${rand}-${uid}-${pullkey}`;

        let rtmpUrl = `rtmp://${pullDomain}/${appName}/${streamName}?auth_key=${timestamp}-${rand}-${uid}-${md5(rtmpPlayer)}`;
        let flvUrl = `http://${pullDomain}/${appName}/${streamName}.flv?auth_key=${timestamp}-${rand}-${uid}-${md5(flvPlayer)}`;
        let m3u8Url = `http://${pullDomain}/${appName}/${streamName}.m3u8?auth_key=${timestamp}-${rand}-${uid}-${md5(m3u8Player)}`;

        return {
            obsUrl: obsUrl,
            obsKey: obsKey,
            rtmpUrl: rtmpUrl,
            flvUrl: flvUrl,
            m3u8Url: m3u8Url
        }
    }

    /**
     * 初始化点播服务
     */
    private initVodClient() {
        var regionId = 'cn-shanghai';
        var client = new RPCClient({
            accessKeyId: this.aliSdkConfig.accessKeyId,
            accessKeySecret: this.aliSdkConfig.accessKeySecret,
            endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
            apiVersion: '2017-03-21'
        });
        return client;
    }

    /**
     * 获取视频上传地址和凭证
     * @param title 
     * @param fileName 
     */
    async createUploadVideo(title, fileName): Promise<any> {
        let client = this.initVodClient();
        let res = client.request("CreateUploadVideo", {
            Title: title,
            FileName: fileName
        }, {});
        return res;
    }

    /**
     * 刷新视频上传凭证
     * @param videoId 
     */
    async refreshUploadVideo(videoId): Promise<any> {
        let client = this.initVodClient();
        let res = client.request("RefreshUploadVideo", {
            VideoId: videoId
        }, {});
        return res;
    }

    /**
     * 获取视频播放凭证
     * @param videoId 
     */
    async getVideoPlayAuth(videoId): Promise<any> {
        let client = this.initVodClient();
        let res = client.request("GetVideoPlayAuth", {
            VideoId: videoId
        }, {});
        return res;
    }

    /**
     * 删除视频(支持批量)
     * @param videoIds 
     */
    async deleteVideo(videoIds): Promise<any> {
        let client = this.initVodClient();
        let res = client.request("DeleteVideo", {
            VideoIds: videoIds
        }, {});
        return res;
    }
}