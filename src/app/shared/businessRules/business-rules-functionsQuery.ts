import {
  AsyncValidatorFn,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Renderer2 } from "@angular/core";
import { flattenDiagnosticMessageText, StringLiteral } from "typescript";
import { SpartanService } from "src/app/api-services/spartan.service";
import { q, q2 } from "src/app/models/business-rules/business-rule-query.model";
import { LocalStorageHelper } from "../../helpers/local-storage-helper";
import { BusinessRulesFunctions } from "src/app/shared/businessRules/business-rules-functions";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { json } from "@andufratu/ngx-custom-validators";
export class BusinessRulesFunctionsQuery {
  constructor(
    private renderer: Renderer2,
    private _spartanService: SpartanService,
    private localStorageHelper: LocalStorageHelper
  ) {}

  public CreateSessionVar(
    SessionVarName: string,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {
    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    this._spartanService.ExecuteQuery(model).subscribe((result) => {
      console.log(result);
      let variable =
        this.localStorageHelper.getItemFromLocalStorage(SessionVarName);
      console.log(variable);
      if (variable == null) {
        this.localStorageHelper.setData(SessionVarName, result);
      } else {
        this.localStorageHelper.removeItemFromLocalStorage(SessionVarName);
        this.localStorageHelper.setData(SessionVarName, result);
      }
      let variable2 =
        this.localStorageHelper.getItemFromLocalStorage(SessionVarName);
      console.log(variable2);

      //hace falta la funcion replace vars
    });
  }

  public SetValueControlQuery(
    formGroup: FormGroup,
    controlName: string,
    value: any
  ) {
    //const control = formGroup.get(controlName);
    // console.log(control)
    const element = document.getElementById(`div${controlName}`);
    const control = formGroup.get(controlName);
    //console.log(element);
    if (element) {
      if (element.contains(element.getElementsByTagName("mat-checkbox")[0])) {
        let arrayTrue = ["true", "si", "yes", "1", "verdadero"];

        let val = value.toString().toLowerCase().replace('"', "");
        let check_result = arrayTrue.indexOf(value) > -1 ? true : false;
        control.setValue(check_result);
      } else if (
        element.contains(element.getElementsByTagName("mat-select")[0])
      ) {
        if (value !== null) {
          if (value.length > 0) {
            if (!isNaN(value)) {
              let retValue = parseInt(value);
              control.setValue(retValue);
            }
          }
        }
      } else if (
        element.contains(element.getElementsByTagName("mat-datepicker")[0])
      ) {
        let fecha = new Date(value);
        control.setValue(fecha);
      } else if (
        element.contains(element.getElementsByTagName("ckeditor")[0])
      ) {
        control.setValue(value);
      } else {
        control.setValue(value);
      }
    } else {
      control.setValue(value);
    }
  }

  public SetValueFromQuery(
    formGroup: FormGroup,
    controlName: string,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {
    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    this._spartanService.ExecuteQuery(model).subscribe((result) => {
      console.log(result);
      this.SetValueControlQuery(formGroup, controlName, result);

      //hace falta la funcion replace vars
    });
  }

  public AssignGlobalVariabletoField(
    formGroup: FormGroup,
    controlName: string,
    SessionVarName: string
  ) {
    let variable =
      this.localStorageHelper.getItemFromLocalStorage(SessionVarName);
    if (variable != null) {
      this.SetValueControlQuery(formGroup, controlName, variable);
    }
  }

  public cast(rawObj, constructor) {
    var obj = new constructor();
    for (var i in rawObj) obj[i] = rawObj[i];
    return obj;
  }



  public AsignarValorMutiplesCamposFronQuery(
    formGroup: FormGroup,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {
    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;
    console.log(model);

    this._spartanService.GetRawQuery(model).subscribe((result) => {
      let jsonresult = JSON.parse(result);
      console.log(jsonresult);
      let obj = jsonresult[0];

      console.log(obj);
      for (const x in obj) {
        console.log(x);
        console.log(obj[x]);
        this.SetValueControlQuery(formGroup, x, obj[x]);
      }
      //hace falta la funcion replace vars
    });
  }

  public FilterComboBox(
    ds: any[],
    Query: string,
    Clave: string,
    Descripcion: string,
    Id: number,
    SecurityCode: string
  ) {
    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;
    console.log(model);
    console.log(ds);
    let dsTemp = new Array<any>();
    this._spartanService.ExecuteQueryDictionary(model).subscribe((result) => {
      console.log(result);
      while (ds.length > 0) {
        ds.pop();
      }

      let jsonstring = "";
      let json = "[";
      for (const x in result) {
        jsonstring += `{\"${Clave}\":${x},\"${Descripcion}\":\"${result[x]}\"},`;
      }
      json += jsonstring.substring(0, jsonstring.length - 1);
      json += "]";
      console.log(json);
      let json_parse = JSON.parse(json);
      console.log(json_parse);
      for (var i = 0; i < json_parse.length; i++) {
        ds.push(json_parse[i]);
      }

      console.log(ds);
      //hace falta la funcion replace vars
    });
  }

  public FilterComboBox2(
    ds: any[],
    Query: string,
    Clave: string,
    Descripcion: string,
    modelInterface:string,
    Id: number,
    SecurityCode: string
  ) {
    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;
    console.log(model);
    console.log(ds);
    let dsTemp = new Array<any>();
    this._spartanService.ExecuteQueryDictionary(model).subscribe((result) => {
      console.log(result);
    

      let jsonstring = "";
      let json = "[";
      for (const x in result) {
        jsonstring += `{\"${Clave}\":${x},\"${Descripcion}\":\"${result[x]}\"},`;
      }
      json += jsonstring.substring(0, jsonstring.length - 1);
      json += "]";
      console.log(json);
      let json_parse = JSON.parse(json);
      console.log(json_parse);
     for (var i = 0; i < json_parse.length; i++) {
       dsTemp.push(json_parse[i]);
      }
      ds[modelInterface]=dsTemp
      console.log(ds);
      //hace falta la funcion replace vars
    });
  }




  public FillMultiRenglonfromQuery(
 
    dataSource:MatTableDataSource<any>,
    modelName:string,
    paginator: MatPaginator,
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

   

   let ob=[];
   const data =dataSource.data;
   for (var i = 0; i < dt.length; i++) {
    let resDt=dt[i];
    resDt.IsDeleted=false;
    resDt.edit=false;
    resDt.isNew=true;
    data.push(resDt);
  }

   
    
    dataSource.data=data;
      console.log(dataSource)
   /*   for (var i = 0; i < ob.length; i++) {
        data.(ob[i]);
      }*/
    /*
      const length =dataSource.data.length;
      const index = length - 1;
   
      
      const page = Math.ceil(dataSource.data.filter(d => !d.IsDeleted).length / paginator.pageSize);
      if (page !== paginator.pageIndex) {
        paginator.pageIndex = page;
      }
*/
   
      //hace falta la funcion replace vars






      
    });
  }
}
