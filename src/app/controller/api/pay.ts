import { controller, post, provide, inject } from 'midway';
import * as _ from 'lodash';

@provide()
@controller('/api/pay/', { middleware: ['errorHandlerMiddleware'] })
export class PayController {
    @inject('aliPayer')
    aliPayer;

    @inject('weChatPayer')
    weChatPayer;

    @post('/doAliPay')
    async doAliPay(ctx) {
        this.aliPayer.out_trade_no = ctx.helper.createTradeNo();
        this.aliPayer.subject = '帽子';
        this.aliPayer.total_amout = '100';
        this.aliPayer.body = '这是非常好的帽子';
        let res = await this.aliPayer.doPay();
        ctx.body = ctx.helper.success(res);
    }

    @post('/aliPayNotify')
    async aliPayNotify(ctx) {
        let res = await this.aliPayer.notify(ctx.request.body);
        ctx.body = res;
    }

    @post('/doWeChatPay')
    async doWeChatPay(ctx) {
        this.weChatPayer.product_id = '1';
        this.weChatPayer.out_trade_no = ctx.helper.createTradeNo();
        this.weChatPayer.subject = '帽子';
        this.weChatPayer.total_amout = '100';
        this.weChatPayer.body = '这是非常好的帽子';
        this.weChatPayer.spbill_create_ip = ctx.helper.getClientIp(ctx);
        let res = await this.weChatPayer.doPay();
        ctx.body = ctx.helper.success(res);
    }

    @post('/weChatPayNotify')
    async weChatPayNotify(ctx) {
        let res = await this.weChatPayer.notify(ctx);
        ctx.set('Content-Type', 'application/xml; charset=utf-8');
        ctx.body = res;
    }
}