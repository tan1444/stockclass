export interface IDictService {
    getDictByParentid(pid: string): Promise<any>;
}