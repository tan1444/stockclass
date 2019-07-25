import { provide, config } from 'midway';
import * as Core from '@alicloud/pop-core'

@provide('aliSmsHelper')
export class aliSmsHelper {

    @config('aliSdk')
    aliSdkConfig;

    requestOption = {
        method: 'POST'
    };

    /**
     * 初始化短信服务
     */
    private initClient() {
        var client = new Core({
            accessKeyId: this.aliSdkConfig.accessKeyId,
            accessKeySecret: this.aliSdkConfig.accessKeySecret,
            endpoint: 'https://dysmsapi.aliyuncs.com',
            apiVersion: '2017-05-25'
        });
        return client;
    }

    /**
     * 发送短信
     * @param params 
     */
    async sendSms(params): Promise<any> {
        let client = this.initClient();
        let res = client.request('SendSms', params, this.requestOption);
        return res;
    }
}