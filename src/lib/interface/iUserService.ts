import { IBaseService } from "./iBaseService";

export interface IUserService extends IBaseService {
    getCurUser(token: string): Promise<any>;
    getUserByName(loginname: string): Promise<any>;
    transaction(): Promise<any>;
}