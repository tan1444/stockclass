import { controller, get, provide, inject } from 'midway';
import * as _ from 'lodash';
import { cconst } from '../../../lib/common/cconst';

@provide()
@controller('/api/dict/', { middleware: ['errorHandlerMiddleware', 'checkTokenMiddleware'] })
export class DictController {
    @inject('dictService')
    dictService;

    @get('/getPowerTypeList')
    async getPowerTypeList(ctx) {
        let res = await this.dictService.getDictByParentid(cconst.DICT_POWER_TYPE);
        ctx.body = res;
    }
}