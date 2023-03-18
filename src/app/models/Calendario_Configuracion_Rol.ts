import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Cargos } from './Cargos';
import { Calendario_Configuracion } from './Calendario_Configuracion';



export class Calendario_Configuracion_Rol  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('User_Role_Id', [''])
    User_Role_Id = null;
    User_Role_Id_Cargos: Cargos;
    @FormField('Calendario_Configuracion', [''])    
    Calendario_Configuracion : [] = [];


     @FormField('Calendario_Configuracion_Rols', [''])
     Calendario_Configuracion_Rols: Calendario_Configuracion_Rol[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

