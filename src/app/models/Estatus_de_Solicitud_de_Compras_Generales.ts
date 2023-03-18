import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Estatus_de_Solicitud_de_Compras_Generales  extends BaseView {
    @FormField('Folio', [0])
    Folio = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Estatus_de_Solicitud_de_Compras_Generaless', [''])
     Estatus_de_Solicitud_de_Compras_Generaless: Estatus_de_Solicitud_de_Compras_Generales[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

