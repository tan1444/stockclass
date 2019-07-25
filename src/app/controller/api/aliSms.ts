import { controller, post, provide, inject } from 'midway';
import * as _ from 'lodash';

@provide()
@controller('/api/aliSms/', { middleware: ['errorHandlerMiddleware', 'checkTokenMiddleware'] })
export class AliSmsController {
    @inject('aliSmsHelper')
    aliSmsHelper;

    /**
     * 发送验证码
     * @param ctx 
     */
    @post('/sendCheckCode')
    async sendCheckCode(ctx) {
        let mobile = ctx.request.body.mobile;
        let rand = _.random(100000, 999999);
        let tplParam = {
            code: rand,
            product: 'xx系统'
        }
        let params = {
            "PhoneNumbers": mobile,
            "TemplateCode": "SMS_6745453",
            "SignName": "注册验证",
            "TemplateParam": JSON.stringify(tplParam)
        }
        ctx.session.checkCode = rand;
        let res = await this.aliSmsHelper.sendSms(params);
        ctx.body = ctx.helper.success(res);
    }
}