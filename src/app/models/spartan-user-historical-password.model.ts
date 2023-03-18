export class SpartanUserHistoricalPasswordModel {

    public Clave: number;
    public Fecha_de_Registro?: Date;
    public Usuario: number;
    public Password: string;

}

export class SpartanUserHistoricalPasswordPagingModel {

    public RowCount: number;
    public Spartan_User_Historical_Passwords: Array<SpartanUserHistoricalPasswordModel>;

}