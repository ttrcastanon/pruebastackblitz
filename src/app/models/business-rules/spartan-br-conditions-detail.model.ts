export class Spartan_BR_Conditions_Detail_Model {

    ConditionsDetailId: number;
    Business_Rule: number;
    Condition_Operator?: number;
    First_Operator_Type?: number;
    First_Operator_Value: string;
    Condition?: number;
    Second_Operator_Type?: number;
    Second_Operator_Value: string;

    IsDeleted: boolean;
    IsEdit: boolean;
    IsNew: boolean;

}

export class Spartan_BR_Conditions_Detail_PagingModel {

    RowCount: number;
    Spartan_BR_Conditions_Details: Array<Spartan_BR_Conditions_Detail_Model>;

}