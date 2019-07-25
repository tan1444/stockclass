import { provide, inject } from 'midway';
import { IDictService } from '../interface/iDictService';
import * as _ from 'lodash';

@provide('dictService')
export class dictService implements IDictService {

    @inject('dictModel')
    model;

    /**
     * 父节点查字典列表
     * @param pid 
     */
    async getDictByParentid(pid: string): Promise<any> {
        let result = await this.model.findAll({
            where: {
                parentid: pid
            }
        });
        return result;
    }

}