export interface IOperationService {
    getRootOperation(): Promise<any>;
    deleteOperation(id: number): Promise<any>;
}