import { SpartanFormatModel } from "./spartan-format.model";

export class SpartanFormatPermissionsModel {

    Format_Spartan_Format: Array<SpartanFormatModel>;
    PermissionId: number;
    Format?: number;
    FormatId?:number;
    Permission_Type?: number;
    Apply: boolean;
    Spartan_User_Role?: number;

}

export class SpartanFormatPermissionsPagingModel {

    RowCount: number;
    Spartan_Format_Permissionss: Array<SpartanFormatPermissionsModel>;
}