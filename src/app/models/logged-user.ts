import { Timestamp } from 'rxjs';



export class Token {
    access_token: string;
    token_type: string;
    expires_in: number;
    dateExpire: Date;
}

export class LoggedUser {
    Token: Token;
    Name: string;
    Email: string;
    Rol: number;
    RoleId: number;
    UserId: number;
    Id: number;
    ResultId: number;
    Error: string;
    UserName: string;
    FolioPermisoArco: number;
}

export class Spartan_User {

    Id_User: number;
    Name: string;
    Role?: number;
    Image?: number;
    Email: string;
    Status?: number;
    Username: string;
    Password: string;
    
}