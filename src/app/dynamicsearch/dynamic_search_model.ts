export class ModelSearchFields {
    Label: string;
    TypeControl: string;
    FieldDB: string;
    Value: string;
    Values: string;
    Group: string;
    SelAllName: string;
}

export class ModelResultsValueFields {
    Values: string[];
}

export class ModelResultsFields {
    Columns: string[];
    ValuesColumns: ModelResultsValueFields[];
    tableDataSource: any;
}

export class ResultGeneralDetail {
    Details: ModelResultsFields;
    Counter: number;
    Label: string;
    Icon: string;
    ObjectId: number;
   
}

export class ModelSearchResult {
    Data: ModelSearchFields[];
    Label: string;
    LabelValue: string;
    Details: ResultGeneralDetail[];
}
