export interface IPowerService {
    list(query): Promise<any>;
    deletePower(id: number): Promise<any>;
    configPowerMenu(power_id: number, menu_id: string): Promise<any>;
    configPowerElement(power_id: number, element_id: string): Promise<any>;
    configPowerOperation(power_id: number, opeation_id: string): Promise<any>;
}