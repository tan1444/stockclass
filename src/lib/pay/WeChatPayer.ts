import { provide, config } from 'midway';
import { AbsPayer } from './AbsPayer';
import { PubQrPay, utils } from '@sigodenjs/wechatpay'
import * as fs from 'fs';
import * as _ from 'lodash'

@provide('weChatPayer')
export class WeChatPayer extends AbsPayer {
    @config('host')
    hostConfig;

    pay = new PubQrPay({
        appId: "wxb80e5bddb2d804f3",
        key: "6Q9VX4N3WTBM9G9XBL7H1L9PB9ANHLY7",
        mchId: "1434712502",
        pfx: fs.readFileSync('cert.p12')
    });

    public doPay(): Promise<any> {
        let res = this.pay.unifiedOrder({
            product_id: this.product_id,
            body: this.body,
            out_trade_no: this.out_trade_no,
            total_fee: _.toNumber(this.total_amout) * 100,
            spbill_create_ip: this.spbill_create_ip,
            notify_url: this.hostConfig + "/api/pay/weChatPayNotify"
        });
        return res;
    }

    public async tradeQuery(tradeNo: string): Promise<any> {
        let res = await this.pay.orderQuery({
            out_trade_no: tradeNo
        });
        return res;
    }

    public async notify(req: any): Promise<any> {
        const options = {
            length: req.headers["content-length"],
            limit: "1mb",
            encoding: "utf8"
        };
        let data: any = await utils.getXMLBody(req.req, options);
        return this.pay.payNotify(data, async parsedData => {
            if (this.pay.verifySign(parsedData)) {
                let trade = await this.tradeQuery(parsedData.out_trade_no);
                console.log(trade)
            }
            if (parsedData.result_code === "FAIL") {
                // 业务逻辑失败
            }
            // ...
            return {
                return_code: "SUCCESS",
                return_msg: "OK"
            };
        });
    }
}