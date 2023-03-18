import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_de_facturacion_de_vuelo  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Estatus', [''])
    Estatus = '';

     @FormField('Estatus_de_facturacion_de_vuelos', [''])
     Estatus_de_facturacion_de_vuelos: Estatus_de_facturacion_de_vuelo[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

