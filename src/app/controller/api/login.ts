import { controller, post, provide, inject, plugin, config } from 'midway';
import * as _ from 'lodash';
import * as md5 from 'md5-node';

@provide()
@controller('/api/login/', { middleware: ['errorHandlerMiddleware'] })
/**
 * @controller login 登录接口
 */
export default class LoginController {
    @inject('userService')
    userService;

    @plugin()
    jwt;

    @config('jwt')
    jwtConfig;

    @plugin()
    redis;

    /**
     * @summary 注册用户
     * @description 注册用户，记录用户账户/密码/
     * @router post /api/login/doRegist
     * @request body registUserRequest *body    
     */
    @post('/doRegist')
    async doRegist(ctx) {
        let loginname = ctx.request.body.loginname;
        let password = ctx.request.body.password;
        let user = {
            loginname: loginname,
            password: md5(password)
        }
        await this.userService.create(user);
        ctx.body = ctx.helper.success("注册成功");
    }

    /**
    * @summary 用户登录
    * @description 用户登录
    * @router post /api/login/doLogin
    * @request body registUserRequest *body    
    */
    @post('/doLogin')
    async doLogin(ctx) {
        let loginname = ctx.request.body.loginname;
        let password = ctx.request.body.password;
        if (!_.isEmpty(loginname) && !_.isEmpty(password)) {
            let user = await this.userService.getUserByName(loginname);
            if (user == null) {
                return ctx.body = ctx.helper.success("用户不存在");
            }
            if (md5(password) != user.password) {
                return ctx.body = ctx.helper.success("密码错误");
            }
            let seconds = this.jwtConfig.seconds;
            let token = this.jwt.sign({
                data: user.loginname + user.uid
            }, this.jwtConfig.secret, { expiresIn: seconds });
            await this.redis.set(token, user.id, 'EX', seconds);
            ctx.session.user = user;
            ctx.body = ctx.helper.success({
                token: token,
                msg: '登录成功'
            });
        } else {
            ctx.body = ctx.helper.success('请输入用户名和密码');
        }
    }

    @post('/doLogOut')
    async doLogOut(ctx) {
        let token = ctx.header.token;
        await this.redis.del(token);
        ctx.session = null;
        ctx.body = ctx.helper.success('退出成功');
    }

}