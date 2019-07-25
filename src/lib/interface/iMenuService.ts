export interface IMenuService {
    getRootMenu(): Promise<any>;
    deleteMenu(id: number): Promise<any>;
}