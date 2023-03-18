// declare module DataToShow {

    export class Datum {
        Label: string;
        TypeControl?: any;
        FieldDB?: any;
        Value: string;
        Values?: any;
        Group: string;
        SelAllName?: any;
    }

    export class ValuesColumn {
        Values: string[];
    }

    export class Details {
        Columns: string[];
        ValuesColumns: ValuesColumn[];
    }

    export class Detail {
        Details: Details;
        Counter: number;
        Label: string;
        Icon: string;
        ObjectId: number;
    }

    export class DataToShow {
        Data: Datum[];
        Label: string;
        LabelValue: string;
        Details: Detail[];

        constructor() {
        }
    }

// }




// export class DynamicSearch {
//     id: number;
//     Label: string;
//     TypeControl: string;
//     FieldDB: string;
//     Value: string;
//     Values: string;
//     Group: string;
//     SelAllName: string;
  
//     constructor(dynamicsearch) {
//       {
//         this.id = dynamicsearch.id || this.getRandomID();
//         this.Label = dynamicsearch.Label || '';
//         this.TypeControl = dynamicsearch.TypeControl || '';
//         this.FieldDB = dynamicsearch.FieldDB || '';
//         this.Value = dynamicsearch.Value || '';
//         this.Values = dynamicsearch.Values || '';
//         this.Group = dynamicsearch.Group || '';
//         this.SelAllName = dynamicsearch.SelAllName || '';
//       }
//     }
//     public getRandomID(): string {
//       const S4 = () => {
//         return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//       };
//       return S4() + S4();
//     }
//   }
  