import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';
import { Estatus_Modulo_de_Mantenimiento } from './Estatus_Modulo_de_Mantenimiento';


export class Modulo_de_Mantenimiento  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Clave', [''])
    Clave = '';
    @FormField('Estatus', [''])
    Estatus = null;
    Estatus_Estatus_Modulo_de_Mantenimiento: Estatus_Modulo_de_Mantenimiento;

     @FormField('Modulo_de_Mantenimientos', [''])
     Modulo_de_Mantenimientos: Modulo_de_Mantenimiento[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

