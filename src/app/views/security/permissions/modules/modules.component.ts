import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { SpartanRoleService } from '../../../../api-services/spartan-role.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../../../../models/spartan-user-role';
import { SpartanModuleService } from '../../../../api-services/spartan-module.service';
import { SpartanUserRuleModuleService } from '../../../../api-services/spartan-user-rule-module.service';
import { SpartanUserRoleStatusService } from '../../../../api-services/spartan-user-role-status.service';
import { UserRoleStatus } from '../../../../models/spartan-user-role-.status';
import { ModuleTreeService } from 'src/app/api-services/module-tree.service';
import { Observable } from 'rxjs';
import { UserRuleModule } from './../../../../../app/models/spartan-user-rule-module';
//import { UserRuleModule } from '/home/juanx/Documents/Proyectos/Totaltech/SpartaneAngularFront/SpartaneAngularFront/light/src/app/models/spartan-user-rule-module';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { StorageKeys } from 'src/app/app-constants';

/**
 * Local interface to manage object
 * ** */
export interface FlatObject {
  name: string;
  id: number;
  parentId: number;
  origOrder: number;
}


@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {
  userRoles: Role[] = [];
  selectedValue: any;
  arrFlatObj: FlatObject[] = [];

  $roleService: any;
  $moduleServiceAll: any;
  $moduleServiceAllByRole: any;
  lstGlobalUserRoleModule: import("./../../../../models/spartan-user-rule-module").UserRuleModule[];
  constructor(
    private _spartanRoleService: SpartanRoleService,
    private _spartanModuleService: SpartanModuleService,
    private _spartanUserRuleModuleService: SpartanUserRuleModuleService,
    public _matDialog: MatDialog,
    public _moduleTreeService: ModuleTreeService,
    private translateService: TranslateService, private localStorageHelper: LocalStorageHelper) {
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
  }

  /**
   * Get All roles to load the mat-select Role
   */
  ngOnInit(): void {
    this.$roleService = this._spartanRoleService.getAll().subscribe((res: Role[]) => this.userRoles = res, err =>
      this.userRoles = []
    );
  }

  /**
   * Allow to get the modules for the Role selected by the user
   */
  changeSelectedRole() {

    console.log(this.selectedValue);

    this._moduleTreeService.idSelectedRole.next(this.selectedValue);

    this.$moduleServiceAll = this._spartanModuleService.getAll().subscribe(
      result => {
        for (let ind = 0; ind < result.length; ind++) {
          const module = result[ind];
          let obj: FlatObject = {
            id: module.Module_Id,
            name: module.Name,
            parentId: module.Parent_Module === null ? 0 : module.Parent_Module,
            origOrder: module.Order_Shown
          }
          this.arrFlatObj.push(obj);
        }

        this.$moduleServiceAllByRole = this._spartanModuleService.GetAllByRole(this.selectedValue).subscribe(res => {
          this.prepareTreeData(this.arrFlatObj, res);
        });
      },
      err => console.error(err)
    );

  }

  /**
   * Open dialog-modal to edit or create a rol
   * @param action can be 0 to create, and 1 to edit
   * @returns void
   */
  openDialogRol(action: number) {

    let data: any;
    data = action === 0 ? {} : this.userRoles.filter(role => role.User_Role_Id == this.selectedValue);
    if (action !== 0 && data[0] === undefined) {
      alert('Debe elegir un rol para editar');
      return;
    }

    data.action = action
    const dialogRef = this._matDialog.open(DialogContentRole, {
      width: '500px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.changeSelectedRole();
    });

  }

  /**
   * Prepare data to send to the service Tree
   * @param arrModules 
   * @param arrUserModules 
   */
  prepareTreeData(arrModules: FlatObject[], arrUserModules: any) {

    arrModules = arrModules.sort((a, b) => a.origOrder - b.origOrder);
    arrUserModules = arrUserModules.sort((a, b) => a.displayorder - b.displayorder);

    let output = {
      Modules: {}
    };

    for (let i = 0; i < arrModules.length; i++) {
      const elementArrModules = arrModules[i];
      output.Modules[elementArrModules.name] = {
        id: elementArrModules.id,
        checked: false,
        User_Rule_Module_Id: 0,
        Order_Shown: elementArrModules.origOrder

      };

      for (let j = 0; j < arrUserModules.length; j++) {
        const elementArrUserModules = arrUserModules[j];
        if (elementArrModules.id === elementArrUserModules.moduleid) {
          // if the module is founded in rol modules, load obj to check in view, and get id
          output.Modules[elementArrModules.name] = {
            id: elementArrModules.id,
            checked: true,
            User_Rule_Module_Id: elementArrUserModules.User_Rule_Module_Id,
            Order_Shown: elementArrUserModules.displayorder
          }
        }
      }
    }

    output = this.sortByValue(output);
    this._moduleTreeService.updateTree(output);

  }

  sortByValue(jsObj) {
    let x = Object.entries(jsObj.Modules).sort(function (a, b) {
      return b[0].localeCompare(a[0]);
    });

    // arrUserModules = arrUserModules.sort( (a,b) => a.displayorder - b.displayorder );
    x = x.sort((a: any, b: any) => a[1].Order_Shown - b[1].Order_Shown);

    let output = {
      Modules: {}
    };
    for (let ind = 0; ind < x.length; ind++) {
      const element = x[ind];
      output.Modules[element[0]] = element[1]
    }

    return output;
  }

  /**
   * Open dialog to create/edit a module
   * @param action can be 0 to create, 1 to edit
   */
  openDialogModule(action: number) {
    console.log('openDialogModule');
    console.log(action);

    let data: any = {};

    console.log(` this._moduleTreeService.selectedNodeTree.value`, this._moduleTreeService.selectedNodeTree.value);
    data[0] = action === 0 ? {} : this._moduleTreeService.selectedNodeTree.value;
    if (action !== 0 && data[0].id === undefined) {
      alert('Debe elegir un módulo para editar');
      return;
    }


    data.action = action
    const dialogRef = this._matDialog.open(DialogContentModule, {
      width: '500px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.changeSelectedRole();
    });



  }

  /**
   * Allow delete the module selected
   */
  deleteModule() {
    console.log('deleteModule');
    console.log(` this._moduleTreeService.selectedNodeTree.value`, this._moduleTreeService.selectedNodeTree.value);
    console.log(this._moduleTreeService.selectedNodeTree.value.id)
    let idMod: number = this._moduleTreeService.selectedNodeTree.value.id;
    this._spartanUserRuleModuleService.selAll(false, 'Spartan_User_Rule_Module.Module_Id=' + idMod, 'Spartan_User_Rule_Module.Module_Id').subscribe(
      resp => {
        console.log(resp);
        if (resp.length == 0) {
          this._spartanModuleService.delete(idMod).subscribe(res => {
            console.log(res);
            this.changeSelectedRole();
          }, err => {
            console.error(err);
            alert('No se ha podido borrar el modulo. Revise que no tenga relaciones');
          })
        } else {
          alert('No se ha podido borrar el modulo. Revise que no tenga relaciones');
        }
      }
    );
  }

  /**
   * Allow to change the position module to up
   */
  upModule() {
    console.log('upModule');
    if (!this._moduleTreeService.selectedNodeTree.value.id) {
      alert('Debe elegir un módulo para editar');
      return;
    }

    let obj = {
      userRole: this.selectedValue,
      module: this._moduleTreeService.selectedNodeTree.value.id,
      order: this._moduleTreeService.selectedNodeTree.value.Order_Shown,
      direction: 'up'
    };

    this.ReOrderUserRoleModules(obj);


  }


  ReOrderUserRoleModules(obj: { userRole: any; module: number; order: number; direction: string; }) {
    this._spartanUserRuleModuleService.getAll().subscribe(result => {
      if (result != null) {
        this.lstGlobalUserRoleModule = result;
        let auxlstGlobalUserRoleModule = this.lstGlobalUserRoleModule.filter(m => m.Spartan_User_Role == obj.userRole);
        auxlstGlobalUserRoleModule = auxlstGlobalUserRoleModule.sort((a, b) => a.Order_Shown - b.Order_Shown);
        let lstModulestoUpdate = this.orderModules(auxlstGlobalUserRoleModule, obj.direction, obj.module, obj.order)

        lstModulestoUpdate.forEach(oUserRoleModule => {
          this._spartanUserRuleModuleService.updateOrderModule(oUserRoleModule).subscribe(res => this.changeSelectedRole(), err => this.changeSelectedRole());
        });

      }
    }, err => console.error(err));
  }

  orderModules(auxlstGlobalUserRoleModule: UserRuleModule[], direction: string, module: number, order: number) {
    let lstModulestoUpdate: UserRuleModule[] = [];
    let spCurrentModule = auxlstGlobalUserRoleModule.filter(m => m.Module_Id == module)[0];
    let moduleToSwap = null;

    let count = 0;

    auxlstGlobalUserRoleModule.forEach(oUserRoleModule => {
      if (oUserRoleModule.Module_Id == module) {

        if (direction.toLowerCase() === 'up') {
          moduleToSwap = auxlstGlobalUserRoleModule[--count];
        } else if (direction.toLowerCase() === 'down') {
          moduleToSwap = auxlstGlobalUserRoleModule[++count];
        }
        return;
      }
      ++count;
    });

    spCurrentModule.Order_Shown = moduleToSwap.Order_Shown;
    moduleToSwap.Order_Shown = order;
    lstModulestoUpdate.push(spCurrentModule);
    lstModulestoUpdate.push(moduleToSwap);

    return lstModulestoUpdate;

  }

  /**
   * Allow to change the position module to up
   */
  downModule() {
    console.log('downModule')
    if (!this._moduleTreeService.selectedNodeTree.value.id) {
      alert('Debe elegir un módulo para editar');
      return;
    }

    let obj = {
      userRole: this.selectedValue,
      module: this._moduleTreeService.selectedNodeTree.value.id,
      order: this._moduleTreeService.selectedNodeTree.value.Order_Shown,
      direction: 'down'
    };

    this.ReOrderUserRoleModules(obj);


  }


  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.$roleService?.unsubscribe();
    this.$moduleServiceAll?.unsubscribe();
    this.$moduleServiceAllByRole?.unsubscribe();
  }

}


/**
 * Local component to Dialog role
 */
@Component({
  selector: 'dialog-content-role',
  templateUrl: './dialogs/dialog-content-role.html',
})
export class DialogContentRole implements OnInit {

  userRolesStatus: UserRoleStatus[] = [];
  selectedValue: any;
  rolDescription: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogContentRole>,
    @Inject(MAT_DIALOG_DATA) public data: any, // send by module.component
    private _spartanUserRoleStatusService: SpartanUserRoleStatusService,
    private _spartanRoleService: SpartanRoleService
  ) { }

  /**
   * Load the data send by module.component
   */
  ngOnInit() {

    this.rolDescription = this.data.action === 0 ? '' : this.data[0].Description;

    this._spartanUserRoleStatusService.getAll().subscribe(res => {
      this.userRolesStatus = res;

      if (this.data.action === 1) {
        this.selectedValue = this.data[0].Status;
      }

    }, err => console.error(err), () => console.log('end'));
  }

  /**
   * Allow to create/Update the rol selected
   */
  saveClick(): void {

    let obj: Role = {
      Description: this.rolDescription,
      User_Role_Id: this.data[0] !== undefined ? this.data[0].User_Role_Id : 0,
      Status: this.selectedValue,
      Status_Spartan_User_Role_Status: null,
      Id: 0
    };

    // call the servide depending of the action  
    if (this.data.action === 0) {
      this._spartanRoleService.insert(obj).subscribe(result => {
        this.dialogRef.close();
      }, err => console.error(err));
    } else if (this.data.action === 1) {
      this._spartanRoleService.update(this.data[0].User_Role_Id, obj).subscribe(result => {
        this.dialogRef.close();
      }, err => console.error(err));
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }




}

/**
 * Local component to Dialog module
 */
@Component({
  selector: 'dialog-content-mod',
  templateUrl: './dialogs/dialog-content-module.html',
})
export class DialogContentModule implements OnInit {

  modDescription: string = '';
  selectedValue: any = 1;
  modStatus = [];
  modId = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogContentRole>,
    @Inject(MAT_DIALOG_DATA) public data: any, // send by module.component
    private _spartanUserRoleStatusService: SpartanUserRoleStatusService,
    private _spartanModuleService: SpartanModuleService
  ) { }

  ngOnInit() {

    console.log(this.data);


    this._spartanUserRoleStatusService.getAll().subscribe(res => {
      this.modStatus = res;

      if (this.data.action === 1) {
        this.modDescription = this.data[0].item;
        this.modId = this.data[0].id;
      }

    }, err => console.error(err), () => console.log('end'));



  }

  saveClick() {

    if (this.modDescription === '' || this.selectedValue === undefined || this.selectedValue === null) {
      alert('Please select Module Status first');
      return;
    }

    let obj: any = {
      Name: this.modDescription,
      Status: this.selectedValue,
      Parent_Module: this.modId,
      Description: this.modDescription,
      Module_Id: this.modId,
      System_Id: 1,
      Order_Shown: 1,
      Image: 11
    };

    // call the servide depending of the action  
    if (this.data.action === 0) {
      this._spartanModuleService.insert(obj).subscribe(result => {
        this.dialogRef.close();
      }, err => console.error(err));
    } else if (this.data.action === 1) {
      this._spartanModuleService.update(this.data[0].id, obj).subscribe(result => {
        this.dialogRef.close();
      }, err => console.error(err));
    }


  }

  closeDialog() {
    this.dialogRef.close();
  }
}