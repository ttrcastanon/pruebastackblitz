import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Spartan_BR_Conditions_Detail_Model } from 'src/app/models/business-rules/spartan-br-conditions-detail.model';

export class SpartanBrConditionsDetailListDatasource extends DataSource<any> {


    constructor(private _list$: Observable<any[]>) {
        super();
    }

    connect(): Observable<any[]> {
        return this._list$;
    }

    disconnect() {
    }

}

// export class SpartanBrConditionsDetailListDatasource extends DataSource<Spartan_BR_Conditions_Detail_Model> {

//     constructor(private _list$: Observable<Spartan_BR_Conditions_Detail_Model[]>) {
//         super();
//     }

//     connect(): Observable<Spartan_BR_Conditions_Detail_Model[]> {
//         return this._list$;
//     }

//     disconnect() {
//     }

// }