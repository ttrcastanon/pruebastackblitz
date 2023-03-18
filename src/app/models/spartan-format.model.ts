export class SpartanFormatModel {

    FormatId: number;
    Registration_Date?: Date;
    Registration_Hour: string;
    Registration_User?: number;
    Format_Name: string;
    Format_Type?: number;
    Search: string;
    Object?: number;
    Header: string;
    Body: string;
    Footer: string;
    Filter: string;

}

export class SpartanFormatPagingModel {

    RowCount: number;
    Spartan_Formats: Array<SpartanFormatModel>;

}