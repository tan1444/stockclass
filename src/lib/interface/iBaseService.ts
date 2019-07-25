export interface IBaseService {
    findAll(): Promise<any>;
    findById(id: number): Promise<any>;
    create(entity: any): Promise<any>;
    update(entity: any): Promise<any>;
    delete(id: number): Promise<any>;
}