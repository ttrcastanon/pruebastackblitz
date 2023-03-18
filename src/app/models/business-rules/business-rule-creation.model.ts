export class Business_Rule_Creation_Model {

    Key_Business_Rule_Creation: number;
    User?: number;
    Creation_Date?: Date;
    Creation_Hour: string;
    Last_Updated_Date?: Date;
    Last_Updated_Hour: string;
    Time_that_took?: number;
    Name: string;
    Documentation?: number;
    Status?: number;
    Complexity?: number;
    Object?: number;
    Attribute?: number;
    AttributeGrid?: boolean;
    Implementation_Code: string;

}

export class Business_Rule_Creation_Model_PagingModel {

    RowCount: number;
    Business_Rule_Creations: Array<Business_Rule_Creation_Model>;

}