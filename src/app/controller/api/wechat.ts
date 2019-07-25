import { controller, get, provide, inject, config } from 'midway';
import * as _ from 'lodash';

@provide()
@controller('/api/wechat/', { middleware: ['errorHandlerMiddleware', 'checkTokenMiddleware'] })
export class WeChatController {
    @inject('wxHelper')
    wxHelper;

    @config('wx')
    wxConfig;

    @get('/getJsSdkConfig')
    async getJsSdkConfig(ctx) {
        let url = ctx.query.url;
        let res = await this.wxHelper.sign(url);
        ctx.body = ctx.helper.success(res);
    }

    @get('/getOpenid')
    async getOpenid(ctx) {
        let code = ctx.query.code;
        let res = await this.wxHelper.getOpenid(code);
        ctx.body = ctx.helper.success(res);
    }

    @get('/sendTemplateMsg')
    async sendTemplateMsg(ctx) {
        var temp = {
            touser: "oJrl9v2-150c2Yc5Xa6k2MioBTf8",
            template_id: this.wxConfig.template_id_bill,
            url: "http://kcy.shsaijing.com/wx/bill",
            data: {
                first: {
                    value: "您好！您收到一个新的账单"
                },
                keyword1: {
                    value: "￥3500.00元",
                },
                keyword2: {
                    value: "2019年3月——2019年4月"
                },
                remark: {
                    value: "点击查看账单详情"
                }
            }
        }
        let res = await this.wxHelper.sendTemplateMsg(temp);
        ctx.body = ctx.helper.success(res);
    }

    @get('/getMedia')
    async getMedia(ctx) {
        let mediaId = 'kfdjafladj';
        let res = await this.wxHelper.getMedia(mediaId);
        ctx.body = ctx.helper.success(res);
    }
}