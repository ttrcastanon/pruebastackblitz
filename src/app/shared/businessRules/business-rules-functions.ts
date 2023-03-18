import {
  AsyncValidatorFn,
  FormArray,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Injector, Renderer2 } from "@angular/core";
import { flattenDiagnosticMessageText } from "typescript";
import { DatePipe } from '@angular/common';
import { SpartanService } from "src/app/api-services/spartan.service";
import { q, q2 } from "src/app/models/business-rules/business-rule-query.model";
import { LocalStorageHelper } from "../../helpers/local-storage-helper";
import { CleanQueryHelper } from "../../helpers/clean-query-helper";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { varsReplace } from '../../helpers/vars-replace-Helper';
import { fromEvent } from "rxjs";

export class BusinessRulesFunctions {

  constructor(
    private renderer: Renderer2,
    private _spartanService: SpartanService,
    private localStorageHelper: LocalStorageHelper
  ) { }

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

  public AsignarValorMutiplesCamposFronQuery(
    formGroup: FormGroup,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {

    Query = this.ReplaceVARS(formGroup, Query);
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

  public async FillMultiRenglonfromQueryAsync(
    dataSource: MatTableDataSource<any>,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    await this._spartanService.GetRawQuery(model).toPromise().then((result) => {
      if (result == null) {
        return
      }

      let dt = JSON.parse(result.replace('\\', ''))

      let ob = [];
      const data = dataSource.data;
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];
        resDt.IsDeleted = false;
        resDt.edit = false;
        resDt.isNew = true;
        data.push(resDt);
      }

      dataSource.data = data;
    });
  }

  public FillMultiRenglonfromQuery(

    dataSource: MatTableDataSource<any>,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    this._spartanService.GetRawQuery(model).subscribe((result) => {


      if (result == null) {
        return
      }

      let dt = JSON.parse(result.replace('\\', ''))

      let ob = [];
      const data = dataSource.data;
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];
        resDt.IsDeleted = false;
        resDt.edit = false;
        resDt.isNew = true;
        data.push(resDt);
      }

      dataSource.data = data;

      //hace falta la funcion replace vars

    });
  }

  public applyConditionsToControl(
    formGroup: FormGroup,
    controlName: string,
    required: boolean,
    enable: boolean = true,
    visible: boolean = true
  ) {
    const control = formGroup.get(controlName);
    if (control) {
      if (required) {
        control.setValidators([Validators.required]);
      } else {
        control.clearValidators();
      }
      const spanElement: HTMLSpanElement = document.querySelector(
        `[formcontrolname="${controlName}"]~span>label>span.mat-form-field-required-marker`
      ) as HTMLSpanElement;
      if (spanElement) {
        if (required) {
          spanElement.innerText = " *";
        } else {
          spanElement.innerText = "";
        }
      } else {
        console.warn(
          `Required: No se encontro el elemento span con el control ${controlName}`
        );
        console.warn(
          `[formcontrolname="${controlName}"]~span>label>span.mat-form-field-required-marker`
        );
      }
      control.updateValueAndValidity();
      if (enable) {
        control.enable();
      } else {
        control.disable();
      }
      const element = document.getElementById(`div${controlName}`);
      if (element) {
        if (visible) {
          this.renderer?.setStyle(element, "display", "block");
        } else {
          this.renderer?.setStyle(element, "display", "none");
        }
      } else {
        console.warn(
          `Display: No se encontro el elemento con el control ${controlName}`
        );
      }
    }
  }

  public updateValidatorsToControl(
    formGroup: FormGroup,
    controlName: string,
    validators: ValidatorFn[],
    asyncValidators: AsyncValidatorFn[] = null,
    updateValueAndValidity: boolean = true
  ) {
    const control = formGroup.get(controlName);
    if (control) {
      control.setValidators(validators);
      if (asyncValidators) {
        control.setAsyncValidators(asyncValidators);
      }
      if (updateValueAndValidity) {
        control.updateValueAndValidity();
      }
    }
  }

  public SetRequiredControl(formGroup: FormGroup, controlName: string) {
    const control = formGroup.get(controlName);
    control.setValidators([Validators.required]);

    const spanElement: HTMLSpanElement = document.querySelector(
      `[formcontrolname="${controlName}"]~span>label>span.mat-form-field-required-marker`
    ) as HTMLSpanElement;
    if (spanElement) {
      spanElement.innerText = " *";
    } else {
      console.warn(
        `Required: No se encontro el elemento span con el control ${controlName}`
      );
      console.warn(
        `[formcontrolname="${controlName}"]~span>label>span.mat-form-field-required-marker`
      );
    }
    control.updateValueAndValidity();
  }

  public SetNotRequiredControl(formGroup: FormGroup, controlName: string) {
    if (controlName) {
      const control = formGroup.get(controlName);

      if (control == null || undefined) {
        return;
      }
      control.clearValidators();

      const spanElement: HTMLSpanElement = document.querySelector(
        `[formControlName="${controlName}"]~span>label>span.mat-form-field-required-marker`
      ) as HTMLSpanElement;

      if (spanElement) {
        spanElement.innerText = "";
      }
      else {
        /* var element = document.querySelector(`[formControlName="${controlName}"]`);
        if (!element) {
          console.warn(`Required: No se encontro el elemento span con el control ${controlName}`);
          console.warn(`[formControlName="${controlName}"]~span>label>span.mat-form-field-required-marker`);
        } */
      }


      control.updateValueAndValidity();
    }

  }

  public SetFormatToHour(formGroup: FormGroup, controlName: any, value: string): void {
    const element = document.getElementById(`div${controlName}`);
    const control = formGroup.get(controlName);
    if (element) {
      if (value != undefined && value.length == 4) {
        let horas = value.substring(0, 2);
        let minutos = value.substring(2, 4);
        let horaFormateada = horas + ':' + minutos;
        control.setValue(horaFormateada);
      }
    }
  }

  public SetEnabledControl(formGroup: FormGroup, controlName: any, enable: number): void {
    const element = document.getElementById(`div${controlName}`);
    const control = formGroup.get(controlName);
    if (control) {
      if (enable == 1) {
        control.enable();
      }
      else {
        control.disable();
        this.SetNotRequiredControl(formGroup, controlName);
      }
    }
  }

  public ShowFieldOfForm(formGroup: FormGroup, controlName: string): void {
    const element = document.getElementById(`div${controlName}`);
    if (element) {
      this.renderer.removeStyle(element, "display");
      this.renderer?.setStyle(element, "display", "block");
    } else {
      console.warn(
        `Display: No se encontro el elemento con el control ${controlName}`
      );
    }
  }

  public HideFieldOfForm(formGroup: FormGroup, controlName: string) {
    const element = document.getElementById(`div${controlName}`);

    this.SetNotRequiredControl(formGroup, controlName);
    console.log("Controlname: ", controlName, " Element: ", element);


    if (element) {
      this.renderer.removeStyle(element, "display");
      this.renderer?.setStyle(element, "display", "none");
    } else {
      console.warn(
        `Display: No se encontro el elemento con el control ${controlName}`
      );
    }

  }

  public SetHideFieldOfForm(formGroup: FormGroup, controlName: string) {
    const element = document.getElementById(`div${controlName}`);

    if (element) {
      this.renderer.removeStyle(element, "display");
      this.renderer?.setStyle(element, "display", "none");
    } else {
      console.warn(
        `Display: No se encontro el elemento con el control ${controlName}`
      );
    }
    this.SetNotRequiredControl(formGroup, controlName);
  }

  public SetValueControl(
    formGroup: FormGroup,
    controlName: string,
    value: any
  ) {
    //const control = formGroup.get(controlName);

    const element = document.getElementById(`div${controlName}`);
    const control = formGroup.get(controlName);

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

  public SetValueControlQuery(
    formGroup: FormGroup,
    controlName: string,
    value: any
  ) {
    //const control = formGroup.get(controlName);

    const element = document.getElementById(`div${controlName}`);
    const control = formGroup.get(controlName);

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

    Query = this.ReplaceVARS(formGroup, Query); // --> se deja comentada la funcion por si aun no existe
    Query = CleanQueryHelper.cleanQuery(Query);

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    this._spartanService.ExecuteQuery(model).subscribe((result) => {
      //console.log(result);

      //console.log("SetValue: ", result, " in: ", controlName);
      formGroup.get(controlName).setValue(result);
      //this.SetValueControlQuery(formGroup, controlName, result);
    });
  }

  public async SetValueFromQueryAsync(
    formGroup: FormGroup,
    controlName: string,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {

    Query = this.ReplaceVARS(formGroup, Query); // --> se deja comentada la funcion por si aun no existe
    Query = CleanQueryHelper.cleanQuery(Query);

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    await this._spartanService.ExecuteQuery(model).toPromise().then((result) => {
      //console.log("Asyn: " + result);
      this.SetValueControlQuery(formGroup, controlName, result);
    });
  }

  public SetDisabledToMR(
    formGroup: FormGroup,
    controlName: string,
    Enable: number
  ) {
    const element = document.getElementById(`div${controlName}`);

    //console.log(element);
    if (element != null) {
      //habilitar y deshabilitar new
      let news = element.getElementsByClassName("top-action-container-table");
      for (let i = 0; i < news.length; i++) {
        let buttonnew = news[i].getElementsByTagName("button");
        for (let y = 0; y < buttonnew.length; y++) {
          let buttonnew = news[i].getElementsByTagName("button");
          Enable == 1
            ? buttonnew[i].removeAttribute("style")
            : buttonnew[i].setAttribute("style", "display: none;");
        }
      }

      //habilitar y deshabilitar actions(delete edit)

      // let actions = element.getElementsByTagName("table");
      // actions[0].setAttribute("disabled", "disabled");
      // actions[0].setAttribute("style", "pointer-events:none");

      let buttonEdit = element.getElementsByClassName("btn-tbl-edit");
      for (let y = 0; y < buttonEdit.length; y++) {
        Enable == 1
          ? buttonEdit[y].removeAttribute("style")
          : this.renderer?.setStyle(buttonEdit[y], "display", "none");

      }
      let buttonDel = element.getElementsByClassName("btn-tbl-delete");
      for (let y = 0; y < buttonDel.length; y++) {

        Enable == 1
          ? buttonDel[y].removeAttribute("style")
          : this.renderer?.setStyle(buttonDel[y], "display", "none");
      }

      //  console.log(actions)



    }
  }

  public SetDisabledToMRControl(
    formGroup: FormGroup,
    controlName: string,

  ) {
    const control = formGroup.get(controlName);
    control.disable();
    this.SetNotRequiredControl(formGroup, controlName);
  }

  public SetEnableToMRControl(
    formGroup: FormGroup,
    controlName: string,

  ) {
    const control = formGroup.get(controlName);
    control.enable();

  }

  public CreateSessionVar(
    SessionVarName: string,
    Query: string,
    Id: number,
    SecurityCode: string
  ) {

    Query = this.ReplaceVARS(null, Query); // --> se deja comentada la funcion por si aun no existe
    Query = CleanQueryHelper.cleanQuery(Query);

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    this._spartanService.ExecuteQuery(model).subscribe((result) => {

      let variable =
        this.localStorageHelper.getItemFromLocalStorage(SessionVarName);

      if (variable == null) {
        this.localStorageHelper.setData(SessionVarName, result);
      } else {
        this.localStorageHelper.removeItemFromLocalStorage(SessionVarName);
        this.localStorageHelper.setData(SessionVarName, result);
      }
    });
  }

  public ShowMessage(message: string) {
    var x: any = document.getElementById("snackbar");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); x.innerHTML = ""; }, 3000);
  }

  public ShowMessageFromQuery(
    Query: string,
    Id: number,
    SecurityCode: string) {

    Query = this.ReplaceVARS(null, Query) // --> se deja comentada la funcion por si aun no existe
    Query = CleanQueryHelper.cleanQuery(Query);

    const model: q = new q();
    model.id = Id;
    model.query = Query;
    model.securityCode = SecurityCode;

    this._spartanService.ExecuteQuery(model).subscribe((result) => {
      var x: any = document.getElementById("snackbar");
      x.innerHTML = result;
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); x.innerHTML = ""; }, 3000);
    });
  }

  public HideFolder(nameOfTAB: string): void {
    const tabHeaders = document.querySelectorAll('.mat-tab-label');
    //console.log("hide: " + nameOfTAB);
    let tabIndex: number = 0;
    let tabIndexFind: number = 0;
    let displayTab: boolean = true;

    tabHeaders.forEach(e => {
      if (e.getAttribute('aria-label') == nameOfTAB) {
        tabIndexFind = tabIndex;
        displayTab = false;
      }
      tabIndex = tabIndex + 1;
      (tabHeaders[tabIndexFind] as HTMLElement).style.display = displayTab ? 'inherit' : 'none';
    });
    console.log("hide tabindex: " + tabIndexFind);
  }

  public HideFolderNew(nameOfTAB: string): void {
    const tabHeaders = document.querySelectorAll('.nav-link');
    //console.log("hide: " + nameOfTAB);
    let tabIndex: number = 0;
    let tabIndexFind: number = 0;
    let displayTab: boolean = true;
    
    tabHeaders.forEach(e => {
      let nameContent = e.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      nameContent = nameContent.trim().replace(/ /g, '_');
      if (nameContent == nameOfTAB) {
        tabIndexFind = tabIndex;
        displayTab = false;
      }
      tabIndex = tabIndex + 1;
      (tabHeaders[tabIndexFind] as HTMLElement).style.display = displayTab ? 'inherit' : 'none';
    });
    console.log("hide tabindex: " + tabIndexFind);
  }

  public ShowFolder(nameOfTAB: string): void {
    const tabHeaders = document.querySelectorAll('.mat-tab-label');
    console.log("show: " + nameOfTAB);
    let tabIndex: number = 0;
    let tabIndexFind: number = 0;
    let displayTab: boolean = false;
    let cantidadTabs: number = 0;

    tabHeaders.forEach(e => { if (e.getAttribute('aria-label') == nameOfTAB) { tabIndexFind = tabIndex; displayTab = true; cantidadTabs = cantidadTabs + 1; } tabIndex = tabIndex + 1; });
    console.log("show tabindex: " + tabIndexFind);

    if (cantidadTabs > 0) {
      if (tabHeaders[tabIndexFind]) {
        console.log("show: ", tabHeaders[tabIndexFind].getAttribute('aria-label'));
        (tabHeaders[tabIndexFind] as HTMLElement).style.display = displayTab ? 'inherit' : 'none';
      }
    }
  }

  public ShowFolderNew(nameOfTAB: string): void {
    const tabHeaders = document.querySelectorAll('.nav-link');
    console.log("show: " + nameOfTAB);
    let tabIndex: number = 0;
    let tabIndexFind: number = 0;
    let displayTab: boolean = false;
    let cantidadTabs: number = 0;

    tabHeaders.forEach(e => { 
      let nameContent = e.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      nameContent = nameContent.trim().replace(/ /g, '_');
      if (nameContent == nameOfTAB) 
      { 
        tabIndexFind = tabIndex; displayTab = true; 
        cantidadTabs = cantidadTabs + 1; 
      } 
      tabIndex = tabIndex + 1; 
    });

    if (cantidadTabs > 0) {
      if (tabHeaders[tabIndexFind]) {
        (tabHeaders[tabIndexFind] as HTMLElement).style.display = displayTab ? 'inherit' : 'none';
      }
    }
  }

  public SetCurrentDateToField(formGroup: FormGroup, element: string) {
    const today = new Date()
    const pipe = new DatePipe('en-US')
    const control = formGroup.get(element)
    const ChangedFormat = pipe.transform(today, 'yyyy-MM-dd')
    const newDate = new Date(ChangedFormat + " 06:00");
    control?.setValue(newDate)
  }

  public SetCurrentHourToField(formGroup: FormGroup, element: string) {
    const today = new Date()
    const pipe = new DatePipe('en-US')
    const control = formGroup.get(element)
    const ChangedFormat = pipe.transform(today, 'HH:mm:ss')
    control?.setValue(ChangedFormat)
  }

  public HideFieldofMultirenglon(ListColumnDefinition: any[], column: string) {

    ListColumnDefinition.forEach(x => {
      if (x.def == column) {
        x.hide = true;
      }
    })
  }

  public ShowFieldofMultirenglon(ListColumnDefinition: any[], column: string) {


    ListColumnDefinition.forEach(x => {
      if (x.def == column) {
        x.hide = false;
      }
    })
  }

  public SetOrderonList(listConfig: any, sortField: string) {

    listConfig.MRSort = sortField;

  }

  public SetOrderonList2(listConfig: any, sortField: string, sortDirecction: string) {

    listConfig.sortField = sortField;
    listConfig.sortDirecction = sortDirecction;

  }

  public SetFilteronList2(listConfig: any, column: string, val: string) {

    listConfig.filter[column] = val;
  }

  public SetFilteronList(listConfig: any, Where: string) {

    Where = this.ReplaceVARS(null, Where);
    listConfig.MRWhere = this.ReplaceVARS(null, Where);
  }

  public TryParseInt(str: any, defaultValue: any): any {
    var retValue = defaultValue;
    if (str !== null) {
      if (str.length > 0) {
        if (!isNaN(str)) {
          if (retValue.indexOf('.') >= 0) {
            retValue = parseFloat(str);
          }
          else {
            retValue = parseInt(str);
          }
        }
      }
    }
    if (retValue == "null") {
      retValue = "";
    }
    return retValue;
  }

  public GetTextFromCombo(formGroup: FormGroup, element: string): string {
    var stringValue: string = "";
    stringValue = formGroup.get(element).value == null ? "" : Object.values(formGroup.get(element).value)[1].toString();
    return stringValue;
  }

  public IsSelectNum(query: string): string {
    var queryS = query.split(" ");
    if (queryS.length == 2) {
      return queryS[1].replace(/'/g, '');
    }
    else {
      return query;
    }
  }

  public GetValueByControlType(formGroup: FormGroup, controlName: any): string {
    var valueOfVar: string = '';

    const element = document.getElementById(`div${controlName}`);
    const control = formGroup.get(controlName);

    if (element) {
      if (element.contains(element.getElementsByTagName("mat-checkbox")[0])) {
        valueOfVar = control.value.toString();
      }

      else if (element.contains(element.getElementsByTagName("mat-select")[0])) {
        valueOfVar = formGroup.get(controlName).value == "" || null ? "" :
          (Object.values(formGroup.get(controlName).value).length == 0 ? formGroup.get(controlName).value : Object.values(formGroup.get(controlName).value)[0].toString());
      }

      else if (element.contains(element.getElementsByTagName("mat-autocomplete")[0])) {
        valueOfVar = formGroup.get(controlName).value.Clave == "" || null ? "" : formGroup.get(controlName).value.Clave.toString();
      }

      else if (element.contains(element.getElementsByTagName("mat-datepicker")[0])) {
        valueOfVar = formGroup.get(controlName).value == "" || null ? "" : formGroup.get(controlName).value.toString();
        const fecha = new Date(valueOfVar);
        const pipe = new DatePipe('en-US')
        const ChangedFormat = pipe.transform(fecha, 'dd-MM-yy')
        valueOfVar = ChangedFormat;
      }

      else {
        valueOfVar = formGroup.get(controlName).value == "" || null ? "" : formGroup.get(controlName).value.toString();
      }
    }

    return valueOfVar = valueOfVar == null ? null : valueOfVar.toString();
  }

  public GetValueByControl(formGroup: FormGroup, controlName: any): string {
    var valueOfVar: string = '';

    const element = document.getElementById(`${controlName}`);
    const control = formGroup.get(controlName);

    if (element) {

      if (element.contains(element.getElementsByTagName("mat-checkbox")[0])) {
        valueOfVar = control.value.toString();
      }

      else if (element.contains(element.getElementsByTagName("mat-select")[0])) {
        valueOfVar = formGroup.get(controlName).value == "" || null ? "" :
          (Object.values(formGroup.get(controlName).value).length == 0 ? formGroup.get(controlName).value : Object.values(formGroup.get(controlName).value)[0].toString());
      }

      else if (element.contains(element.getElementsByTagName("mat-autocomplete")[0])) {
        valueOfVar = formGroup.get(controlName).value == "" || null ? "" : formGroup.get(controlName).value.toString();
      }

      else if (element.contains(element.getElementsByTagName("mat-datepicker")[0])) {
        valueOfVar = formGroup.get(controlName).value == "" || null ? "" : formGroup.get(controlName).value.toString();
        const fecha = new Date(valueOfVar);
        const pipe = new DatePipe('en-US')
        const ChangedFormat = pipe.transform(fecha, 'dd-MM-yy')
        valueOfVar = ChangedFormat;
      }

      else {
        valueOfVar = formGroup.get(controlName).value == "" || null ? "" : formGroup.get(controlName).value.toString();
      }
    }

    return valueOfVar = valueOfVar == null ? null : valueOfVar.toString();
  }

  public EvaluaQuery(query: string, Id: number, SecurityCode: string) {
    query = this.ReplaceVARS(null, query) // --> se deja comentada la funcion por si aun no existe

    let res: any = '';
    var number = Number(this.IsSelectNum(query));

    if (Number.isNaN(number)) {
      const model: q = new q();
      model.id = Id;
      model.query = query;
      model.securityCode = SecurityCode;

      this._spartanService.ExecuteQuery(model).subscribe((result) => {
        res = result;
      });
    }
    else {
      res = number;
    }
    return this.TryParseInt(res, res);
  }

  public EvaluaQueryNumber(query: string, Id: number, SecurityCode: string) {
    query = this.ReplaceVARS(null, query) // --> se deja comentada la funcion por si aun no existe

    let res: any = '';
    var number = Number(this.IsSelectNum(query));

    if (Number.isNaN(number)) {
      const model: q = new q();
      model.id = Id;
      model.query = query;
      model.securityCode = SecurityCode;

      this._spartanService.ExecuteQuery(model).subscribe((result) => {
        res = result;
      });
    }
    else {
      res = number;
    }
    return this.TryParseInt(res, res);
  }

  public async EvaluaQueryAsync(query: string, Id: number, SecurityCode: string) {
    query = this.ReplaceVARS(null, query)

    let res: any = '';
    var number = Number(this.IsSelectNum(query));

    if (Number.isNaN(number)) {
      const model: q = new q();
      model.id = Id;
      model.query = query;
      model.securityCode = SecurityCode;

      await this._spartanService.ExecuteQuery(model).toPromise().then((result) => {
        res = result;
      });
    }
    else {
      res = number;
    }
    return this.TryParseInt(res, res);
  }

  public EvaluaQueryDictionary(query: string, Id: number, SecurityCode: string) {
    let response: any = [];

    query = this.ReplaceVARS(null, query);

    const model: q = new q();
    model.id = Id;
    model.query = query;
    model.securityCode = SecurityCode;

    this._spartanService.ExecuteQueryDictionary(model).subscribe((result) => {
      if (result) {
        //Se realiza el mapeo al modelo [{Clave, Description}]
        result = Object.keys(result).map((key) => [Number(key), result[key]]);
        result.forEach((element) => {
          response.push(
            {
              "Clave": element[0],
              "Description": element[1]
            }
          )
        });

      }
      else {
        response = []
      }
    });

    return response;
  }

  public async EvaluaQueryDictionaryAsync(query: string, Id: number, SecurityCode: string) {
    let res: any = [];

    query = this.ReplaceVARS(null, query);

    const model: q = new q();
    model.id = Id;
    model.query = query;
    model.securityCode = SecurityCode;

    await this._spartanService.ExecuteQueryDictionary(model).toPromise().then((result) => {
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        res.push(
          {
            "Clave": element[0],
            "Description": element[1]
          }
        )
      });
    });

    return res;
  }

  public async EvaluaQueryStringDictionaryAsync(query: string, Id: number, SecurityCode: string) {
    let res: any = [];

    query = this.ReplaceVARS(null, query);

    const model: q = new q();
    model.id = Id;
    model.query = query;
    model.securityCode = SecurityCode;

    await this._spartanService.ExecuteQueryDictionary(model).toPromise().then((result) => {
      result = Object.keys(result).map((key) => [String(key), result[key]]);
      result.forEach((element) => {
        res.push(
          {
            "Clave": element[0],
            "Description": element[1]
          }
        )
      });
    });

    return res;
  }

  public ReplaceVARS(formGroup: FormGroup, data: string) {

    return varsReplace.RaplceVarsAll(formGroup, data);

  }

  public ReplaceVAR(data: string) {

    return varsReplace.RaplceVarsAll(null, data);
  }

  public SendEmailQuery(subject: string, to: string, body: string) {
    1
  }

  public SendEmailQueryPrintFormat() {

  }

  public SendEmailQueryPrintSenderFormat() {

  }

  //#region Limpia los validators(incluye required) 
  public SetNotValidatorControl(formGroup: FormGroup, controlName: string) {

    try {
      if (controlName) {
        const control = formGroup.get(controlName);

        if (control == null || undefined) {
          return;
        }
        control.clearValidators();
        control.updateValueAndValidity();
      }
    }
    catch {
    }

    try {
      const htmlElement: HTMLSpanElement = document.querySelector(`[formControlName="${controlName}"]`) as HTMLSpanElement;

      if (htmlElement) {
        htmlElement.removeAttribute("required")
      }
    }
    catch {
    }

  }
  //#endregion

  public SetNotValidatorControl2(formGroup: FormGroup, controlName: string) {
    if (controlName) {
      const control = formGroup.get(controlName);
      if (control == null || undefined) {
        return;
      }
      control.clearValidators();
      control.updateValueAndValidity();
    }

  }

  public SetNotRequiredElementControl(formGroup: FormGroup, controlName: string) {

    const htmlElement: HTMLSpanElement = document.querySelector(
      `[formControlName="${controlName}"]`
    ) as HTMLSpanElement;

    if (htmlElement) {
      htmlElement.removeAttribute("required")
    }
  }

  //#region Asigna el atributo required de input/select/checkbox. Despues de renderizar la pantalla.
  public SetRequiredElementControl(formGroup: FormGroup, controlName: string) {
    const control = formGroup.get(controlName);
    control.setValidators([Validators.required]);

    const htmlElement: HTMLElement = document.querySelector(`[formControlName="${controlName}"]`) as HTMLElement;

    if (htmlElement) {
      htmlElement.setAttribute("required", "true");
    }

    const spanElement: HTMLSpanElement = document.querySelector(
      `[formcontrolname="${controlName}"]~span>label>span.mat-form-field-required-marker`
    ) as HTMLSpanElement;

    if (spanElement) {
      spanElement.innerText = " *";
    }

    control.updateValueAndValidity();
  }
  //#endregion

  //#region Oculta campo de formulario en pantalla despues de renderizar.
  public HideFieldOfFormAfter(formGroup: FormGroup, controlName: string) {
    const element = document.getElementById(`div${controlName}`);

    formGroup.get(controlName).disable();

    if (element) {
      this.renderer.removeStyle(element, "display");
      this.renderer?.setStyle(element, "display", "none");
    } else {
      console.warn(
        `Display: No se encontro el elemento con el control ${controlName}`
      );
    }
  }
  //#endregion

  //#region Movimiento del mouse: Agrega atributo required de input/select/checkbox. En MR: MULTIREGLONES. | Despues de renderizar
  SetRequiredControlMR(formArray: FormArray, index: number, controlName: string) {
    const mouseMoves = fromEvent(document, 'mousemove');
    const control = formArray.controls[index].get(controlName)

    control.setValidators([Validators.required]);

    const subscription = mouseMoves.subscribe(() => {

      let nodesControl = document.querySelector(`[formControlName="${controlName}"]`)
      nodesControl.setAttribute("required", '');

      let nodesLabel = document.querySelector(`[formControlName="${controlName}"]~span>label`)

      if (nodesLabel) {
        nodesLabel.appendChild(this.createSpanItem())
      }

      control.updateValueAndValidity();
      subscription.unsubscribe();

    });

  }
  //#endregion

  //#region Crear Elemento Span con valor "*" en HTML | para required
  createSpanItem() {
    let span = document.createElement('span');
    span.className = "mat-placeholder-required mat-form-field-required-marker ng-star-inserted"
    span.textContent = " *"
    return span;
  }
  //#endregion

  //#region Movimiento del mouse: Limpia atributo required de input/select/checkbox. En MR: MULTIREGLONES. | Despues de renderizar
  SetNotValidatorControlMR(formArray: FormArray, index: any, controlName: string) {
    const mouseMoves = fromEvent(document, 'mousemove');
    const control = formArray.controls[index].get(controlName)

    if (control == null || control == undefined) {
      return;
    }

    const subscription = mouseMoves.subscribe(() => {

      control.clearValidators();

      let nodesControl = document.querySelector(`[formControlName="${controlName}"]`)
      nodesControl.removeAttribute("required");

      let nodesLabel: any = document.querySelector(`[formControlName="${controlName}"]~span>label>span`)
      if (nodesLabel) {
        nodesLabel.innerText = ""
      }

      control.updateValueAndValidity();

      subscription.unsubscribe();

    });

  }
  //#endregion

  //#region Asigna atributo disabled en input/select/checkbox. En MR: MULTIREGLONES. | Despues de renderizar
  SetDisabledControlMR(formArray: FormArray, index: any, controlName: string) {
    const mouseMoves = fromEvent(document, 'mousemove');
    const control = formArray.controls[index].get(controlName)

    if (control == null || control == undefined) {
      return;
    }

    const subscription = mouseMoves.subscribe(() => {
      control.disable();
      subscription.unsubscribe();
    });

  }
  //#endregion

}