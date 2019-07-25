import { controller, provide, get } from 'midway';
import * as _ from 'lodash';

@provide()
@controller('/home', { middleware: ['authFilterMiddleware'] })
export class HomeController {
    viewOptions = {
        layout: '_layout/layout-main.ejs'
    };

    @get('/')
    async index(ctx) {

        await ctx.render('home/index.ejs', { pageTitle: 'A' }, this.viewOptions);
    }
}