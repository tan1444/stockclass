import { inject } from 'midway';

export class BaseService  {  
    @inject('mysqlDB')
    db;  
   
    async excuteQuery(sql: string, params: object): Promise<any> {
        let result = await this.db.sequelize.query(sql, {
            replacements: params,
            type: this.db.sequelize.QueryTypes.SELECT
        });
        return result;
    }

    async excuteUpdate(sql: string, params: object): Promise<any> {
        let result = await this.db.sequelize.query(sql, {
            replacements: params,
            type: this.db.sequelize.QueryTypes.UPDATE
        });
        return result;
    }

    async excuteDelete(sql: string, params: object): Promise<any> {
        let result = await this.db.sequelize.query(sql, {
            replacements: params,
            type: this.db.sequelize.QueryTypes.DELETE
        });
        return result;
    }

}