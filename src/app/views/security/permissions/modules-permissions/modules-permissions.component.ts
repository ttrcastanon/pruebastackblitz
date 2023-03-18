import { ConstantPool } from '@angular/compiler';
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModuleTreeService } from 'src/app/api-services/module-tree.service';
import { StorageKeys } from 'src/app/app-constants';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { SpartanUserRuleObjectFunctionService } from '../../../../api-services/spartan-user-rule-object-function.service';

declare var $: any;

export interface TableModuleObjectPermissions {
  object: string;
  allowAll: boolean;
  consult: boolean;
  new: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  print: boolean;
  configure: boolean;
  trId: number;
  functionID?: number;
  userRuleObjectFunctionId?: number;
  moduleId: number;
  idSelectedRole: number;
}

const ELEMENT_DATA: TableModuleObjectPermissions[] = [];


@Component({
  selector: 'app-modules-permissions',
  templateUrl: './modules-permissions.component.html',
  styleUrls: ['./modules-permissions.component.scss']
})
export class ModulesPermissionsComponent implements OnInit {


  @ViewChild("reftr") trView: any;
    
  inputObjPermission:string='';
  objModuleName:string='';
  moduleId: number;
  moduleName: string;
  lstDataHolder: any;
   
  displayedColumns: string[] = ['object', 'allowAll', 'consult', 'new', 'edit', 'delete', 'export', 'print', 'configure'];
  dataSource = ELEMENT_DATA;
  consdataSource = ELEMENT_DATA;
  $timeOutChkPermissions: NodeJS.Timeout;
  idSelectedRole: number;

  constructor(
    private _moduleTreeService: ModuleTreeService,
    private _spartanUserRuleObjectFunctionService: SpartanUserRuleObjectFunctionService,private translateService: TranslateService,
    private localStorageHelper: LocalStorageHelper) {
      const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
      this.translateService.setDefaultLang(selectedLanguage);
      this.translateService.use(selectedLanguage);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this._moduleTreeService.selectedNodeTree.subscribe( res => {
      if (res.id) {
      this.moduleId = res.id;
      this.moduleName = res.item;
      }
    });

    this._moduleTreeService.idSelectedRole.subscribe( idSelectedRole => this.idSelectedRole = idSelectedRole);

    this._moduleTreeService.lstDataHolder.subscribe( lstDataHolder => {
      this.lstDataHolder = lstDataHolder.filter( item => item.Checked !== '');
      this.generateTableData(300);
     });



  }

  generateTableData(miliseconds: number) {
    let newDataSource: TableModuleObjectPermissions[] = [];

      for (let index = 0; index < this.lstDataHolder.length; index++) {
        const element = this.lstDataHolder[index];
        
        let elementDModObjPermission: TableModuleObjectPermissions = {
          object: element.Data,
          allowAll: false,
          consult: false,
          new: false,
          edit: false,
          delete: false,
          export: false,
          print: false,
          configure: false,
          trId: element.ObjectID,
          idSelectedRole: this.idSelectedRole,
          moduleId: this.moduleId,
        }

        newDataSource.push(elementDModObjPermission);
      }

      this.dataSource = newDataSource; // Asigna nuevo datasource sin checksboxes data
      this.consdataSource = newDataSource;
      
      if(this.$timeOutChkPermissions){
        clearTimeout(this.$timeOutChkPermissions);
      }

      this.$timeOutChkPermissions = setTimeout(() => {
        this.chkPermissions();
      }, miliseconds);
  }


  chkPermissions() {

    this._spartanUserRuleObjectFunctionService.getAll().subscribe(
      (result) => {
        let lstSpUsrRoleObjectFunction: any[] = [];

        // console.log(result);

        for (let index = 0; index < result.length; index++) {
          const m = result[index];
          if (
            m.Module_Id == this.moduleId &&
            m.Spartan_User_Rule ==
              this._moduleTreeService.idSelectedRole.value
          ) {
            lstSpUsrRoleObjectFunction.push(m);
          }
        }

        // inspects lstSpUsrRoleObjectFunction to check this.dataSource checks or not
        $("#tblPermission tbody tr").each(function (i, data) {
          for (let i = 0; i < lstSpUsrRoleObjectFunction.length; i++) {


            let trobjectID = $(this).attr('id')

            let ObjectID = lstSpUsrRoleObjectFunction[i].Object_Id;

            let UserRoleObjectFunctionID = lstSpUsrRoleObjectFunction[i].User_Rule_Object_Function_Id;

            let functionID;

            if (ObjectID == trobjectID) {

              functionID = lstSpUsrRoleObjectFunction[i].Fuction_Id;

              $(this).find("[FunctionID='" + functionID + "']").attr('_checked',true).prop('_checked', true)
              .attr('UserRuleObjectFunctionId', UserRoleObjectFunctionID).addClass('mat-checkbox-checked');



            }

          }
          var length = $(this).find('.mat-checkbox-checked').length;
          if (length == 7){
            $(this).find(".chkkPermissionAll").attr('checked', true).prop('checked', true).attr('_checked',true).prop('_checked', true).addClass('mat-checkbox-checked');
          }
        });


      },
      (err) => console.error(err)
    );


  }


  filterObjectPermission(){
    if (this.inputObjPermission.length == 0) {
      this.dataSource = this.consdataSource;
    } else {
      this.dataSource = this.consdataSource.filter(d => d.object.toLowerCase().includes(this.inputObjPermission.toLowerCase()));
    }
    this.chkPermissions();
  }

  chkkPermission(element) {

    if (element._elementRef.nativeElement.attributes[3].value == 0) {
      console.log('assign');
      let obj:any = {
        Spartan_User_Rule : this.idSelectedRole,
        Module_Id : this.moduleId,
        Fuction_Id : element._elementRef.nativeElement.attributes[1].value,
        Object_Id : element.value
      }
      this._spartanUserRuleObjectFunctionService.insert(obj).subscribe( res => {
        console.log(res);
        this.generateTableData(0);
      }, err => {
        console.error(err);
        this.generateTableData(0);
      })
    } else {
      console.log('unassign');
      this._spartanUserRuleObjectFunctionService.deleteParams(parseInt(element._elementRef.nativeElement.attributes[3].value), this.idSelectedRole).subscribe( res => {
        this.generateTableData(0);
      }, err => {
        console.error(err);
        this.generateTableData(0);
      })
    }



  }

  chkkPermissionAll(elementHTML){
    const idChkSelectedAll:number = elementHTML.value;


    if (elementHTML._elementRef.nativeElement.className.includes('mat-checkbox-checked')) {
      console.log('unassignAll');
      let childNodesRows: any[] = this.trView.__ngContext__[0].children//.filter( item => item.id !== undefined);
      
      for (let ind = 0; ind < childNodesRows.length; ind++) {
        
        const childRowsChecks:any[] = childNodesRows[ind].children;
        if (childNodesRows[ind].id == idChkSelectedAll) {
          for (let index = 2; index < childRowsChecks.length; index++) {
            const elementMatCheckbox = childRowsChecks[index].children[0];
            if (elementMatCheckbox._checked) {
              // Si está chequeado, se debe desasignar
              this._spartanUserRuleObjectFunctionService.deleteParams(parseInt(elementMatCheckbox.attributes[3].value), this.idSelectedRole).subscribe( res => {
                this.generateTableData(0);
              }, err => {
                console.error(err);
                this.generateTableData(0);
              })
            }
          }
        }
      }
    } else {
      console.log('AssignAll');
      let childNodesRows: any[] = this.trView.__ngContext__[0].children
      
      for (let ind = 0; ind < childNodesRows.length; ind++) {
        
        const childRowsChecks:any[] = childNodesRows[ind].children;
        if (childNodesRows[ind].id == idChkSelectedAll) {
          for (let index = 2; index < childRowsChecks.length; index++) {
            const elementMatCheckbox = childRowsChecks[index].children[0];
            if (elementMatCheckbox._checked === undefined || elementMatCheckbox._checked === null) {
              // Si está deschequeado, se debe asignar

              let obj:any = {
                Spartan_User_Rule : this.idSelectedRole,
                Module_Id : this.moduleId,
                Fuction_Id :elementMatCheckbox.attributes[1].value,
                Object_Id : idChkSelectedAll
              }
              console.log(obj);
              this._spartanUserRuleObjectFunctionService.insert(obj).subscribe( res => {
                console.log(res);
                this.generateTableData(0);
              }, err => {
                console.error(err);
                this.generateTableData(0);
              })

            }
          }
        }
      }
    }



  }

}
