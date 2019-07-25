export interface IElementService {
    list(query): Promise<any>;
    deleteElement(id: number): Promise<any>;
}