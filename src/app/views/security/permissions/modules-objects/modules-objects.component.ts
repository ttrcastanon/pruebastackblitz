import { Component, OnInit } from '@angular/core';
import { ModuleTreeService } from 'src/app/api-services/module-tree.service';
import { SpartanObjectService } from '../../../../api-services/spartan-object.service';
import { SpartanUserRuleModuleObjectService } from '../../../../api-services/spartan-user-rule-module-object.service';
import { SpartanMetadataService } from '../../../../api-services/spartan-metadata.service';
import { SpartanObjectType } from 'src/app/api-services/enum-spartan-object-type';
import { TranslateService } from '@ngx-translate/core';
import { StorageKeys } from 'src/app/app-constants';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';

@Component({
  selector: 'app-modules-objects',
  templateUrl: './modules-objects.component.html',
  styleUrls: ['./modules-objects.component.scss']
})
export class ModulesObjectsComponent implements OnInit {

  moduleName:string = '';
  moduleId:number = 0;
  inputObjModule = '';
  All: boolean = false;
  lstDataHolder: any[] = [];
  conslstDataHolder: any[] = [];
  viewAllObjects: boolean = false;
  constructor(
    private _moduleTreeService: ModuleTreeService,
    private _spartanObjectService: SpartanObjectService,
    private _spartanUserRuleModuleObjectService: SpartanUserRuleModuleObjectService,
    private _spartanMetadataService: SpartanMetadataService,private translateService: TranslateService,
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
        this.moduleName = res.item;
        this.moduleId = res.id;

        this.loadDataHolder();
        
      }
    });
  }


  loadDataHolder() {
    this._spartanObjectService.listaSelAll(1,2147483647,'','').subscribe(spartaneObject => {
      const whereClause = "Spartan_User_Rule_Module_Object.Module_Id=" + this.moduleId + " AND Spartan_User_Role = " + this._moduleTreeService.idSelectedRole.value;
      this._spartanUserRuleModuleObjectService.GetAllParams(false, whereClause,'Spartan_User_Rule_Module_Object.Object_Id').subscribe(result => {
        this.GetModuleRoleObject(spartaneObject.Spartan_Objects, result, this.moduleId, this._moduleTreeService.idSelectedRole.value, this.All );
      }, err => console.error(err));
    }, err => console.error(err));
  }


  GetModuleRoleObject(objects: any, lstspartaneModuleObject: any, moduleId: number, value: number, All: boolean) {

    let objectType:number;
    this.lstDataHolder = [];
    this._moduleTreeService.lstDataHolder.next([]);
    
    if (!All) {
      objects = objects.filter( obj1 => lstspartaneModuleObject.filter(obj2 => obj1.Object_Id === obj2.Object_Id ) );
    }
    
    if (objects.length != 0) {
      
      let haveObjects = lstspartaneModuleObject.length > 0;
      objects.forEach(sprtnModObject => {

        let dataHolder:any = {};
        let item = null;
        if (haveObjects) {
          for (let ind = 0; ind < lstspartaneModuleObject.length; ind++) {
            const modObj = lstspartaneModuleObject[ind];
            if (modObj.Object_Id === sprtnModObject.Object_Id) {
              item = modObj;
              break;
            } 
          } 
        }

        if (item === null) {
          dataHolder.Checked = "";
        } else {
          dataHolder.Checked = "checked";
          dataHolder.User_Rule_Module_Object_Id = item.User_Rule_Module_Object_Id;
        }

        dataHolder.Module_Object_Id = sprtnModObject.Object_Id;
        dataHolder.Data = sprtnModObject.Name;
        dataHolder.ObjectID = sprtnModObject.Object_Id;
        objectType = parseInt(sprtnModObject.Object_Type);
        dataHolder.ParentObjectId = -1;

        if (objectType === 6) {
          
          this._spartanMetadataService.listaSelAll(0,100,'Spartan_Metadata.Object_Id=' + sprtnModObject.Object_Id + ' AND Identifier_Type=2', '').subscribe(parentObject => {

            if (parentObject.Spartan_Metadatas[0] !== undefined) {
              if (parentObject.length != 0 && parentObject.Spartan_Metadatas[0].Related_Object_Id != null) {
                let parentObjectId:number = parentObject.Spartan_Metadatas[0].Related_Object_Id.Value;
                dataHolder.ParentObjectId = parentObjectId;
              }
            }

            let objectDescription:string = SpartanObjectType[objectType];
            dataHolder.ObjectType = objectType;
            dataHolder.ObjectTypeDescription = objectDescription;
            this.lstDataHolder.push(dataHolder);
            this.conslstDataHolder.push(dataHolder);
            this._moduleTreeService.lstDataHolder.next(this.lstDataHolder);

          }, err => console.error(err))
        } else {
          
          let objectDescription:string = SpartanObjectType[objectType];
          dataHolder.ObjectType = objectType;
          dataHolder.ObjectTypeDescription = objectDescription;
          this.lstDataHolder.push(dataHolder);
          this.conslstDataHolder.push(dataHolder);
          this._moduleTreeService.lstDataHolder.next(this.lstDataHolder);

        }
      });

    }
  }

  filterModuleObject(){
    if (this.inputObjModule.length == 0) {
      this.lstDataHolder = this.conslstDataHolder;
    } else {
      this.lstDataHolder = this.conslstDataHolder.filter(d => d.Data.toLowerCase().includes(this.inputObjModule.toLowerCase()));
    }
  }

  selectObjectModule(item){
    // this._moduleTreeService.objectModuleSelected.next(item);
  }


  checkObjectModule(item){
    console.log('aquí podría ser el lugar para sobreescribir el item array this.lstDataHolder con spread operator');
    if (item.Checked === '') {
      // assign
      let obj = {
        Object_Id: item.ObjectID,
        Module_Id: this.moduleId, 
        Spartan_User_Role: this._moduleTreeService.idSelectedRole.value
      };
  
      this._spartanUserRuleModuleObjectService.insert(obj).subscribe( res => console.log(res), err => console.error(err), () => this.loadDataHolder());
    } else {
      // unassing
      let obj = {
        userRoleModuleObjectID: item.User_Rule_Module_Object_Id,
        UserRole: this._moduleTreeService.idSelectedRole.value
      };
      this._spartanUserRuleModuleObjectService.DeleteParams(obj.userRoleModuleObjectID, obj.UserRole).subscribe(
        res => console.log(res), err => console.error(err), () => this.loadDataHolder()
      )
    }
  }


}
