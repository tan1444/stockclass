import { controller, provide, get } from 'midway';
import * as _ from 'lodash';

@provide()
@controller('/pay')
export class PPayController {
    viewOptions = {
        layout: '_layout/layout-main.ejs'
    };

    @get('/index')
    async index(ctx) {

        await ctx.render('pay/index.ejs', { pageTitle: '支付宝测试' }, this.viewOptions);
    }

    @get('/success')
    async success(ctx) {

        await ctx.render('pay/success.ejs', { pageTitle: '支付成功' }, this.viewOptions);
    }
}