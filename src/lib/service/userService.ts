import { provide, inject, plugin } from 'midway';
import { IUserService } from '../../lib/interface/iUserService';
import { BaseService } from './baseService';

@provide('userService')
export class UserService extends BaseService implements IUserService {

    @inject('userModel')
    model;

    @plugin()
    redis;

    async findAll(): Promise<any> {
        return this.model.findAll();
    }

    async findById(id: number): Promise<any> {
        let user = await this.model.findByPk(id);
        if (!user) {
            throw new Error('user not found');
        }
        return user;
    }

    async create(entity: any): Promise<any> {
        return this.model.create(entity);
    }

    async update(entity: any): Promise<any> {
        let t = await this.findById(entity.id);
        return t.update(entity);
    }

    async delete(id: number): Promise<any> {
        let user = await this.findById(id);
        return user.destroy();
    }

    async getCurUser(token: string): Promise<any> {
        let id = await this.redis.get(token);
        return this.findById(id);
    }

    async getUserByName(loginname: string): Promise<any> {       
        let user = await this.model.findOne({
            where: {
                loginname: loginname
            }
        });
        return user;
    }

    /**
     * 事务的测试
     */
    async transaction(): Promise<any> {
        let transaction;
        try {
            transaction = await this.model.sequelize.transaction();
            let user = await this.model.create({
                loginname: 'xxxx',
                loginpass: 'c4ca4238a0b923820dcc509a6f75849b'
            }, transaction);
            user.certverify = 3;
            await user.update(user, transaction);
            let users = await this.model.sequelize.query('SELECT * FROM user WHERE uid >= :n', {
                replacements: {
                    n: 10
                },
                type: this.model.sequelize.QueryTypes.SELECT
            });
            await transaction.commit();
            return users
        } catch (e) {
            await transaction.rollback();
            throw new Error(e);
        }
    }
}