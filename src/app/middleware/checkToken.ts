import { WebMiddleware, provide, plugin, config } from 'midway';
import * as moment from 'moment';

@provide()
export class CheckTokenMiddleware implements WebMiddleware {
    @plugin()
    jwt;

    @config('jwt')
    jwtConfig;

    @plugin()
    redis;

    resolve() {
        return async (ctx, next) => {
            let decodedJwt;
            let token = ctx.header.token;
            try {
                decodedJwt = this.jwt.verify(token, this.jwtConfig.secret);
                let uid = await this.redis.get(token);
                let now = moment().unix();
                if (uid == null || now > decodedJwt.exp) {
                    throw new Error('token过期');
                }

            } catch (error) {
                throw new Error(error);
            }
            if (decodedJwt.exp) {
                await next();
            }
        };
    };


}