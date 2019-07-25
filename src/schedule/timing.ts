import { provide, schedule, CommonSchedule } from 'midway';
import { Payway } from '../lib/common/cenum';

@provide()
@schedule({
    //cron: '0 0 1 * *', // 每月一号
    interval: 20000000000000000000000000,
    type: 'worker', // 指定某一个 worker 执行
})
export class TimingCron implements CommonSchedule {

    // 定时执行的具体任务
    async exec(ctx) {
        for (var i in Payway) {
            console.log(Payway[i]);
        }

    }
}