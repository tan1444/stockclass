import { controller, provide, get } from 'midway';
import * as _ from 'lodash';

@provide()
@controller('/login/', { middleware: ['errorHandlerMiddleware'] })
export class PloginController {
    @get('/')
    async index(ctx) {
        await ctx.render('login/index.ejs');
    }
}