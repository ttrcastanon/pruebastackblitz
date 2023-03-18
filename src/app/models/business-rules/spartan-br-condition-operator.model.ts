export class Spartan_BR_Condition_Operator_Model {

    ConditionOperatorId: number;
    Valor: string;
    Description: string;
    Implementation_Code: string;
    Sentence: string;

}

export class Spartan_BR_Condition_Operator_PagingModel {

    RowCount: number;
    Spartan_BR_Condition_Operators: Array<Spartan_BR_Condition_Operator_Model>;

}