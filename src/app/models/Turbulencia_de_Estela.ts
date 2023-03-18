import { BaseView } from '../shared/base-views/base-view';
import { FormArray, Validators } from '@angular/forms';
import { FormField } from '../shared/base-views/decorators/reactive-form-decorators';
import { FileInput } from 'ngx-material-file-input';


export class Turbulencia_de_Estela  extends BaseView {
    @FormField('Clave', [0])
    Clave = 0;
    @FormField('Descripcion', [''])
    Descripcion = '';

     @FormField('Turbulencia_de_Estelas', [''])
     Turbulencia_de_Estelas: Turbulencia_de_Estela[] = [];

     edit = false;
     isNew = false;        
     IsDeleted = false;
}

