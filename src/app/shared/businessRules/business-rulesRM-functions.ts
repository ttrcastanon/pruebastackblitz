import {
  AsyncValidatorFn,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Renderer2 } from "@angular/core";
import { flattenDiagnosticMessageText } from "typescript";
import { SpartanService } from "src/app/api-services/spartan.service";
import { q, q2 } from "src/app/models/business-rules/business-rule-query.model";
import { LocalStorageHelper } from "../../helpers/local-storage-helper";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export class BusinessRulesRMFunctionsQuery<T> {

  constructor(
    private renderer: Renderer2,
    private _spartanService: SpartanService,
    private localStorageHelper: LocalStorageHelper
  ) {}



  public FillMultiRenglonfromQuery(
 
    dataSource:MatTableDataSource<T>,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {

console.log("inicia")
console.log(dataSource)
    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    this._spartanService.GetRawQuery(model).subscribe((result) => {
      console.log(result);
      let dt=JSON.parse(result)
    
      console.log(dt);

   let ob=new Array<T>();
   for (var i = 0; i < dt.length; i++) {
    let resDt=dt[i];
    resDt.IsDeleted=false;
    resDt.edit=false;
    ob.push(resDt);
  }

   console.log(ob)
      const data =dataSource.data;
   
      for (var i = 0; i < ob.length; i++) {
        data.push(ob[i]);
      }
    
   
      dataSource.data=data;
    console.log(dataSource)
   
      //hace falta la funcion replace vars






      
    });
  }
}
