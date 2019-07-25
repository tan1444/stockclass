import { WebMiddleware, provide } from 'midway';

@provide()
export class AuthFilterMiddleware implements WebMiddleware {
    resolve() {
        return async (ctx, next) => {
            //let userService = await ctx.requestContext.getAsync('userService');           
            let user = ctx.session.user;
            if (user == null) {
                return ctx.redirect('/login')
            }
            await next();
        };
    };
}