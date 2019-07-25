
import { controller, post, provide } from 'midway';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

@provide()
@controller('/api/upload/', { middleware: ['errorHandlerMiddleware', 'checkTokenMiddleware'] })
export class UploadController {

    @post('/uploadFile')
    async uploadFile(ctx) {
        let stream = await ctx.getFileStream();
        let farr = stream.filename.split('.');//取文件名后缀
        let fileName = Date.now() + '.' + farr[farr.length - 1];
        var dirPath = path.join(__dirname, "../../public/upload");
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        let remoteFileStream = fs.createWriteStream(path.join(dirPath, fileName));
        stream.pipe(remoteFileStream);
        ctx.body = ctx.helper.success({
            path: '\\public\\upload\\' + fileName,
            msg: '文件上传成功'
        });
    }
}