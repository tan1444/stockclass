import { provide, inject, config, Context } from 'midway';
import { AbsPayer } from './AbsPayer';
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';
import * as fs from 'fs';

@provide('aliPayer')
export class AliPayer extends AbsPayer {
    @inject()
    ctx: Context;

    @config('host')
    hostConfig;

    alipaySdk = new AlipaySdk({
        appId: '2016092900623620',
        privateKey: fs.readFileSync('private-key.pem', 'ascii'),
        gateway: 'https://openapi.alipaydev.com/gateway.do',
        alipayPublicKey: fs.readFileSync('public-key.pem', 'ascii'),//支付宝公钥
        signType: 'RSA2',
        charset: 'utf-8'
    });

    public async doPay(): Promise<any> {
        let formData = new AlipayFormData();
        formData.setMethod('get');
        formData.addField('notifyUrl', this.hostConfig + '/api/pay/aliPayNotify');
        formData.addField('returnUrl', this.hostConfig + '/pay/success');
        formData.addField('bizContent',
            {
                outTradeNo: this.out_trade_no,
                productCode: 'FAST_INSTANT_TRADE_PAY',//网站支付
                //productCode: 'FACE_TO_FACE_PAYMENT',//面对面支付（扫码）
                totalAmount: this.total_amout,
                subject: this.subject,
                body: this.body,
            });
        let result = await this.alipaySdk.exec('alipay.trade.page.pay', {}, { formData: formData });
        // let url = await this.alipaySdk.exec('alipay.trade.precreate', {}, { formData: formData });
        // let result = await this.ctx.curl(url.toString(), { dataType: 'json' });      
        return result;
    }

    public async tradeQuery(tradeNo: string): Promise<any> {
        let formData = new AlipayFormData();
        formData.setMethod('get');
        formData.addField('bizContent',
            {
                tradeNo: tradeNo
            });
        let url = await this.alipaySdk.exec('alipay.trade.query', {}, { formData: formData });
        let result = await this.ctx.curl(url.toString(), { dataType: 'json' });
        return result.data;
    }

    public async notify(req: any): Promise<any> {
        let flag = this.alipaySdk.checkNotifySign(req);
        let res = '';
        console.log(req);
        if (flag) {
            if (req.trade_status == 'TRADE_SUCCESS') {
                let trade = await this.tradeQuery(req.out_trade_no);
                console.log(trade)
            }
            console.log('success');
            res = 'success';
        } else {
            console.log('fail');
            res = 'fail';
        }
        return res;
    }

}