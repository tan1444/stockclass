export interface IRoleService {
    setRolePower(role_id: string, power_id: string): Promise<any>;
    setUserRole(user_id: string, role_id: string): Promise<any>;
}