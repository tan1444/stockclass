import { controller, get, post, provide, inject } from 'midway';

@provide()
@controller('/api/user/', { middleware: ['errorHandlerMiddleware', 'checkTokenMiddleware'] })
export class UserController {
    @inject('userService')
    userService;

    @get('/getAllUser')
    async getAllUser(ctx) {       
        let res = await this.userService.findAll()
        ctx.body = ctx.helper.success(res);
    }

    @get('/getUser')
    async getUser(ctx) {
        let id = ctx.query.id;
        let res = await this.userService.findById(id);
        ctx.body = ctx.helper.success(res);
    }

    @post('/createUser')
    async createUser(ctx) {
        let user = ctx.request.body;
        user.loginpass = ctx.helper.bhash(user.loginpass);
        let res = await this.userService.create(user);
        ctx.body = ctx.helper.success(res);
    }

    @post('/updateUser')
    async updateUser(ctx) {
        let user = ctx.request.body;
        user.loginpass = ctx.helper.bhash(user.loginpass);
        let res = await this.userService.update(user);
        ctx.body = ctx.helper.success(res);
    }

    @post('/deleteUser')
    async deleteUser(ctx) {
        let uid = ctx.request.body.uid;
        let res = await this.userService.delete(uid);
        ctx.body = ctx.helper.success(res);
    }

    @get('/getCurUser')
    async getCurUser(ctx) {
        let res = await this.userService.getCurUser(ctx.header.token);
        ctx.body = ctx.helper.success(res);
    }

    @get('/transaction')
    async transaction(ctx) {
        let res = await this.userService.transaction();
        ctx.body = ctx.helper.success(res);
    }
}