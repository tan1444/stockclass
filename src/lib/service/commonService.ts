import { provide, inject } from 'midway';


@provide('commonService')
export class CommonService {
    @inject('mysqlDB')
    db;

    /**
     * 通过id查出二叉树所有的子节点
     * @param id 
     * @param tableName 
     */
    async getChildNodesById(id: number, tableName: string): Promise<any> {
        let sql = [];
        sql.push('select id from (');
        sql.push(' select t1.id,');
        sql.push(' if(find_in_set(parentid, @pids) > 0, @pids := concat(@pids, \', \', id), 0) as ischild');
        sql.push(' from (select id,parentid from ' + tableName + ' t  order by parentid, id) t1,');
        sql.push(' (select @pids := :id) t2');
        sql.push(' ) t3 where ischild != 0');
        let query_res = await this.db.sequelize.query(sql.join(''), {
            replacements: { id: id },
            type: this.db.sequelize.QueryTypes.SELECT
        });
        let result = [];
        result.push(id);
        if (query_res != null) {
            query_res.forEach(ele => {
                result.push(ele.id);
            });
        }
        return result;
    }
}