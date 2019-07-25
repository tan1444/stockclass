export abstract class AbsPayer {
    // 微信扫码支付时二维码中包含的商品ID
    public product_id: string;

    // 外部订单号，商户网站订单系统中唯一的订单号
    public out_trade_no: string;

    // 订单名称
    public subject: string;

    // 付款金额
    public total_amout: string;

    // 用户的客户端IP
    public spbill_create_ip: string;

    // 商品描述
    public body: string;

    public abstract doPay(): Promise<any>;

    public abstract tradeQuery(tradeNo: string): Promise<any>

    public abstract notify(req: any): Promise<any>;
}