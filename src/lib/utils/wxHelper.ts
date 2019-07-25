import { provide, plugin, config, inject, Context } from 'midway';
import * as path from 'path';
import * as fs from 'fs';
import * as sha1 from 'sha1';
import * as _ from 'lodash';

@provide('wxHelper')
export class wxHelper {
    @plugin()
    redis;

    @config('wx')
    wxConfig;

    @inject()
    ctx: Context;

    /**
     * 生成随机字符串
     */
    async createnoncestr(): Promise<any> {
        var strs = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
        ];
        var sb = [];
        for (var i = 0; i < 15; i++) {
            sb.push(strs[Math.ceil(Math.random() * strs.length)]);
        }
        return sb.join('');
    }

    /**
     * 生成微信jssdk签名
     * @param url     
     */
    async sign(url): Promise<any> {
        var noncestr = await this.createnoncestr(),
            timestamp = Math.floor(Date.now() / 1000), //精确到秒
            jsapi_ticket;
        var ticket = await this.redis.get('ticket');
        if (!_.isEmpty(ticket)) {
            return {
                debug: false,
                appId: this.wxConfig.appid,
                nonceStr: noncestr,
                timestamp: timestamp,
                url: url,
                jsapi_ticket: jsapi_ticket,
                signature: sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
            };
        } else {
            let tokenMap = await this.ctx.curl(this.wxConfig.accessTokenUrl + '?grant_type=' + this.wxConfig.grant_type + '&appid=' +
                this.wxConfig.appid + '&secret=' + this.wxConfig.appsecret, { dataType: 'json' });
            let ticketMap = await this.ctx.curl(this.wxConfig.ticketUrl + '?access_token=' + tokenMap.data.access_token + '&type=jsapi', { dataType: 'json' });
            this.redis.set('ticket', ticketMap.data.ticket, 'EX', this.wxConfig.cache_duration); //加入缓存          
            return {
                debug: false,
                appId: this.wxConfig.appid,
                nonceStr: noncestr,
                timestamp: timestamp,
                url: url,
                jsapi_ticket: ticketMap.data.ticket,
                signature: sha1('jsapi_ticket=' + ticketMap.data.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
            };
        }
    }

    /**
     * 获得openid
     * @param code 
     */
    async getOpenid(code): Promise<any> {
        let response = await this.ctx.curl('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + this.wxConfig.appid + '&secret=' +
            this.wxConfig.appsecret + '&code=' + code + '&grant_type=authorization_code', { dataType: 'json' });
        return response.data;
    }

    /**
     * 发送模板消息
     * @param temp 
     */
    async sendTemplateMsg(temp): Promise<any> {
        let tokenMap = await this.ctx.curl(this.wxConfig.accessTokenUrl + '?grant_type=' + this.wxConfig.grant_type + '&appid=' + this.wxConfig.appid +
            '&secret=' + this.wxConfig.appsecret, { dataType: 'json' });
        let response = await this.ctx.curl(this.wxConfig.templateMsgUrl + 'access_token=' + tokenMap.data.access_token, {
            method: 'POST',
            contentType: 'json',
            data: JSON.stringify(temp),
            dataType: 'json',
        });
        return response.data;
    }

    /**
     * 拉取微信多媒体流
     * @param mediaId 
     */
    async getMedia(mediaId): Promise<any> {       
        var dirPath = path.join(__dirname, "../../public/upload");
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        let tokenMap = await this.ctx.curl(this.wxConfig.accessTokenUrl + '?grant_type=' + this.wxConfig.grant_type + '&appid=' + this.wxConfig.appid +
            '&secret=' + this.wxConfig.appsecret, { dataType: 'json' });
        let fileName = Date.now() + ".jpg";
        let url = this.wxConfig.mediaUrl + 'access_token=' + tokenMap.data.access_token + '&media_id=' + mediaId;      
        await this.ctx.curl(url, {
            writeStream: fs.createWriteStream(path.join(dirPath, fileName)),
        });
        return '\\public\\upload\\' + fileName;
    }
}